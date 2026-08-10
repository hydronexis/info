import { getFirebaseServices, isFirebaseConfigured } from "./firebase-service.js";

const elements = {
  form: document.getElementById("sellerForm"),
  fieldset: document.getElementById("sellerFieldset"),
  authTitle: document.getElementById("authTitle"),
  authDescription: document.getElementById("authDescription"),
  googleLoginButton: document.getElementById("googleLoginButton"),
  logoutButton: document.getElementById("logoutButton"),
  currentLocationButton: document.getElementById("currentLocationButton"),
  saveButton: document.getElementById("saveButton"),
  message: document.getElementById("formMessage")
};

function setMessage(text, type = "") {
  elements.message.textContent = text;
  elements.message.className = `form-message ${type}`.trim();
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function parseKeywords(value) {
  return [...new Set(
    value
      .split(",")
      .map(item => item.trim().toLowerCase())
      .filter(Boolean)
  )];
}

function validateCoordinates(latitude, longitude) {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be a number between -90 and 90.");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be a number between -180 and 180.");
  }
}

async function start() {
  if (!isFirebaseConfigured()) {
    setMessage("Firebase is not configured. Complete js/firebase-config.js.", "error");
    elements.googleLoginButton.disabled = true;
    return;
  }

  try {
    const { auth, authApi, db, firestore } = await getFirebaseServices();
    const provider = new authApi.GoogleAuthProvider();

    elements.googleLoginButton.addEventListener("click", async () => {
      try {
        setMessage("Opening Google sign-in...");
        await authApi.signInWithPopup(auth, provider);
      } catch (error) {
        console.error(error);
        setMessage("Could not sign in with Google.", "error");
      }
    });

    elements.logoutButton.addEventListener("click", async () => {
      await authApi.signOut(auth);
      setMessage("Signed out.");
    });

    authApi.onAuthStateChanged(auth, user => {
      const signedIn = Boolean(user);
      elements.fieldset.disabled = !signedIn;
      elements.googleLoginButton.classList.toggle("hidden", signedIn);
      elements.logoutButton.classList.toggle("hidden", !signedIn);

      if (signedIn) {
        elements.authTitle.textContent = user.displayName || "Signed-in user";
        elements.authDescription.textContent = user.email || "You can now register sellers.";
        if (!getValue("sellerName") && user.displayName) {
          document.getElementById("sellerName").value = user.displayName;
        }
      } else {
        elements.authTitle.textContent = "Sign in to continue";
        elements.authDescription.textContent = "Firebase requires an authenticated account to save locations.";
      }
    });

    elements.currentLocationButton.addEventListener("click", () => {
      if (!navigator.geolocation) {
        setMessage("Your browser doesn't support getting your location.", "error");
        return;
      }

      setMessage("Getting location...");

      navigator.geolocation.getCurrentPosition(
        position => {
          document.getElementById("latitude").value = position.coords.latitude.toFixed(7);
          document.getElementById("longitude").value = position.coords.longitude.toFixed(7);
          setMessage("Location obtained successfully.", "success");
        },
        error => {
          console.error(error);
          setMessage("Could not get your location. Use HTTPS or localhost and grant permission.", "error");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });

    elements.form.addEventListener("submit", async event => {
      event.preventDefault();

      const user = auth.currentUser;
      if (!user) {
        setMessage("You must sign in before saving.", "error");
        return;
      }

      if (!elements.form.checkValidity()) {
        elements.form.reportValidity();
        return;
      }

      const latitude = Number(getValue("latitude"));
      const longitude = Number(getValue("longitude"));

      try {
        validateCoordinates(latitude, longitude);
        elements.saveButton.disabled = true;
        elements.saveButton.textContent = "Saving...";
        setMessage("Saving seller to Firestore...");

        await firestore.addDoc(firestore.collection(db, "locations"), {
          businessName: getValue("businessName"),
          sellerName: getValue("sellerName"),
          product: getValue("product"),
          district: getValue("district"),
          township: getValue("township"),
          address: getValue("address"),
          phone: getValue("phone"),
          latitude,
          longitude,
          keywords: parseKeywords(getValue("keywords")),
          active: true,
          ownerId: user.uid,
          ownerEmail: user.email || "",
          createdAt: firestore.serverTimestamp()
        });

        elements.form.reset();
        if (user.displayName) {
          document.getElementById("sellerName").value = user.displayName;
        }
        setMessage("Seller saved. It should now appear on the map.", "success");
      } catch (error) {
        console.error(error);
        setMessage(error.message || "Could not save the seller.", "error");
      } finally {
        elements.saveButton.disabled = false;
        elements.saveButton.textContent = "Save seller";
      }
    });
  } catch (error) {
    console.error(error);
    setMessage("Firebase could not start. Check the project configuration.", "error");
  }
}

start();