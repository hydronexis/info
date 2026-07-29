import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const signupForm = document.getElementById("signup");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupConfirm = document.getElementById("signupConfirm");
const signupPlan = document.getElementById("signupPlan");
const signupMessage = document.getElementById("signupMessage");
const signupButton = document.getElementById("signupButton");

function showSignupMessage(text, type = "error") {
  if (!signupMessage) return;

  signupMessage.className = `message ${type}`;
  signupMessage.textContent = text;
}

function clearSignupMessage() {
  if (!signupMessage) return;

  signupMessage.className = "message";
  signupMessage.textContent = "";
}

function setSignupLoading(isLoading) {
  if (!signupButton) return;

  signupButton.disabled = isLoading;
  signupButton.textContent = isLoading
    ? "Creating account..."
    : "Create Account";
}

function getRegisterErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "The password must contain at least 6 characters.";

    case "auth/network-request-failed":
      return "Please check your internet connection.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    default:
      console.error("Firebase registration error:", code);
      return "The account could not be created.";
  }
}

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearSignupMessage();

  const name = signupName?.value.trim() ?? "";
  const email = signupEmail?.value.trim() ?? "";
  const password = signupPassword?.value ?? "";
  const confirmPassword = signupConfirm?.value ?? "";
  const plan = signupPlan?.value ?? "";

  if (!name || !email || !password || !confirmPassword || !plan) {
    showSignupMessage(
      "Please complete every field before creating your account."
    );
    return;
  }

  if (password.length < 6) {
    showSignupMessage(
      "The password must contain at least 6 characters."
    );
    return;
  }

  if (password !== confirmPassword) {
    showSignupMessage("Passwords do not match.");
    return;
  }

  setSignupLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name
    });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      plan,
      role: "user",
      accountStatus: "active",
      provider: "password",
      createdAt: serverTimestamp()
    });

    showSignupMessage(
      "Account created successfully. Redirecting...",
      "success"
    );

    window.location.replace("dashboard.html");
  } catch (error) {
    console.error("Registration error:", error);
    showSignupMessage(getRegisterErrorMessage(error.code));
  } finally {
    setSignupLoading(false);
  }
});