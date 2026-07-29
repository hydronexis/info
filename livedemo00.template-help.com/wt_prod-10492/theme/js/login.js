import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const signinForm = document.getElementById("signin");
const emailInput = document.getElementById("signinEmail");
const passwordInput = document.getElementById("signinPassword");

const signinButton = document.getElementById("signinButton");
const googleLoginButton = document.getElementById("googleLoginButton");
const guestLoginButton = document.getElementById("guestLoginButton");

const signinMessage = document.getElementById("signinMessage");

const googleProvider = new GoogleAuthProvider();

function showMessage(text, type = "error") {
  if (!signinMessage) return;

  signinMessage.className = `message ${type}`;
  signinMessage.textContent = text;
}

function clearMessage() {
  if (!signinMessage) return;

  signinMessage.className = "message";
  signinMessage.textContent = "";
}

function setButtonLoading(button, loading, loadingText, normalText) {
  if (!button) return;

  button.disabled = loading;
  button.textContent = loading ? loadingText : normalText;
}

function redirectToDashboard() {
  window.location.replace("dashboard.html");
}

function getLoginErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "The email or password is incorrect.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed.";

    case "auth/popup-blocked":
      return "The browser blocked the Google sign-in window.";

    case "auth/network-request-failed":
      return "Please check your internet connection.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    default:
      console.error("Firebase authentication error:", code);
      return "Authentication could not be completed.";
  }
}

/* Correo y contraseña */
signinForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const email = emailInput?.value.trim() ?? "";
  const password = passwordInput?.value ?? "";

  if (!email || !password) {
    showMessage("Please complete both fields.");
    return;
  }

  setButtonLoading(
    signinButton,
    true,
    "Signing in...",
    "Sign In"
  );

  try {
    await signInWithEmailAndPassword(auth, email, password);

    showMessage(
      "Login successful. Redirecting...",
      "success"
    );

    redirectToDashboard();
  } catch (error) {
    showMessage(getLoginErrorMessage(error.code));
  } finally {
    setButtonLoading(
      signinButton,
      false,
      "Signing in...",
      "Sign In"
    );
  }
});

/* Google */
googleLoginButton?.addEventListener("click", async () => {
  clearMessage();

  setButtonLoading(
    googleLoginButton,
    true,
    "Connecting...",
    "Continue with Google"
  );

  try {
    await signInWithPopup(auth, googleProvider);

    showMessage(
      "Google sign-in successful. Redirecting...",
      "success"
    );

    redirectToDashboard();
  } catch (error) {
    showMessage(getLoginErrorMessage(error.code));
  } finally {
    setButtonLoading(
      googleLoginButton,
      false,
      "Connecting...",
      "Continue with Google"
    );
  }
});

/* Invitado */
guestLoginButton?.addEventListener("click", async () => {
  clearMessage();

  setButtonLoading(
    guestLoginButton,
    true,
    "Entering...",
    "Continue as Guest"
  );

  try {
    await signInAnonymously(auth);

    showMessage(
      "Guest access granted. Redirecting...",
      "success"
    );

    redirectToDashboard();
  } catch (error) {
    showMessage(getLoginErrorMessage(error.code));
  } finally {
    setButtonLoading(
      guestLoginButton,
      false,
      "Entering...",
      "Continue as Guest"
    );
  }
});