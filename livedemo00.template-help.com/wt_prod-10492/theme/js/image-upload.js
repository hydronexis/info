import { storage } from "./firebase-config.js";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp"
]);

function safeFileName(name) {
  const extension = String(name || "image")
    .split(".")
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") || "jpg";
  const baseName = String(name || "image")
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
  return `${baseName}.${extension}`;
}

function uploadId() {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function validateImageFile(file) {
  if (!(file instanceof File) || !file.size) {
    throw new Error("Select an image from your device.");
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Use a JPG, PNG or WebP image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("The image must be 5 MB or smaller.");
  }
  return file;
}

export function isHttpsImageUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function uploadImageFile(file, { folder, uid, onProgress } = {}) {
  validateImageFile(file);
  if (!uid || !/^[a-zA-Z0-9_-]+$/.test(folder || "")) {
    return Promise.reject(new Error("The image upload destination is invalid."));
  }

  const path = `${folder}/${uid}/${uploadId()}-${safeFileName(file.name)}`;
  const imageRef = ref(storage, path);
  const task = uploadBytesResumable(imageRef, file, {
    contentType: file.type,
    customMetadata: { ownerId: uid }
  });

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        const percent = snapshot.totalBytes
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          : 0;
        onProgress?.(percent);
      },
      () => reject(new Error("The image could not be uploaded. Check Firebase Storage Rules and try again.")),
      async () => {
        try {
          resolve({
            url: await getDownloadURL(task.snapshot.ref),
            path
          });
        } catch {
          await deleteObject(task.snapshot.ref).catch(() => {});
          reject(new Error("The uploaded image URL could not be obtained."));
        }
      }
    );
  });
}

export async function deleteUploadedImage(path) {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (error) {
    if (error?.code !== "storage/object-not-found") throw error;
  }
}
