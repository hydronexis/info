import { db } from "./firebase-config.js";
import {
  applyPlanPermissions,
  getPlanLabel,
  PLAN_PRICES,
  signOutCurrentUser
} from "./plan-manager.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  doc,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

let session;

function getDisplayName() {
  return session.profile?.name?.trim()
    || session.user?.displayName?.trim()
    || session.user?.email?.split("@")[0]
    || "Hydronexis user";
}

function getInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase()).join("") || "HN";
}

function formatMemberSince(value) {
  const date = value?.toDate?.() || session.user?.metadata?.creationTime;
  if (!date) return "Unavailable";
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unavailable";
  return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(parsed);
}

function showFeedback(message, isError = false) {
  const feedback = document.getElementById("profileFeedback");
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.style.background = isError ? "#fff0ec" : "#eff5ec";
  feedback.style.color = isError ? "#8b2d1e" : "#285421";
}

function renderProfile() {
  const name = getDisplayName();
  const planLabel = getPlanLabel(session.plan);
  const photoUrl = session.profile?.photoUrl?.trim() || session.user.photoURL?.trim() || "";
  document.getElementById("profileName").textContent = name;
  document.getElementById("profileNameInput").value = name;
  document.getElementById("profilePhotoInput").value = photoUrl;
  const avatar = document.getElementById("profileAvatar");
  avatar.replaceChildren();
  if (photoUrl) {
    const image = document.createElement("img");
    image.src = photoUrl;
    image.alt = `${name} profile`;
    avatar.appendChild(image);
  } else {
    avatar.textContent = getInitials(name);
  }
  document.getElementById("profileEmail").textContent = session.user.email || "Unavailable";
  document.getElementById("profileMemberSince").textContent = formatMemberSince(session.profile?.createdAt);
  document.getElementById("profilePlanBadge").textContent = planLabel;
  document.getElementById("profilePlanPrice").textContent = PLAN_PRICES[session.plan] || "";
  const upgradeLink = document.getElementById("profileUpgradeLink");
  if (session.plan === "go_green") upgradeLink.textContent = "Review Current Plan";
  applyPlanPermissions(session.plan, document.getElementById("profileLinks"));
  document.getElementById("profileMain").setAttribute("aria-busy", "false");
}

document.getElementById("profileForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = document.getElementById("profileSaveButton");
  const name = document.getElementById("profileNameInput").value.trim();
  const photoUrl = document.getElementById("profilePhotoInput").value.trim();
  if (name.length < 2 || name.length > 80) {
    showFeedback("Enter a name between 2 and 80 characters.", true);
    return;
  }
  if (photoUrl) {
    try {
      const parsedPhotoUrl = new URL(photoUrl);
      if (!["http:", "https:"].includes(parsedPhotoUrl.protocol)) throw new Error("protocol");
    } catch {
      showFeedback("Enter a valid HTTP or HTTPS profile photo URL.", true);
      return;
    }
  }

  button.disabled = true;
  button.textContent = "Saving...";
  try {
    await updateDoc(doc(db, "users", session.user.uid), {
      name,
      photoUrl,
      updatedAt: serverTimestamp()
    });
    session = { ...session, profile: { ...session.profile, name, photoUrl } };
    renderProfile();
    showFeedback("Your profile was updated.");
  } catch {
    showFeedback("Your profile could not be updated. Please try again.", true);
  } finally {
    button.disabled = false;
    button.textContent = "Save Changes";
  }
});

document.getElementById("profileLogoutButton")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await signOutCurrentUser();
    location.replace("index.html");
  } catch {
    button.disabled = false;
    showFeedback("Logout could not be completed. Please try again.", true);
  }
});

session = await requirePageAccess();
renderProfile();
