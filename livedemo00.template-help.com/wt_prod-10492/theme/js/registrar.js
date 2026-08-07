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
    throw new Error("La latitud debe ser un número entre -90 y 90.");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("La longitud debe ser un número entre -180 y 180.");
  }
}

async function start() {
  if (!isFirebaseConfigured()) {
    setMessage("Firebase no está configurado. Completa js/firebase-config.js.", "error");
    elements.googleLoginButton.disabled = true;
    return;
  }

  try {
    const { auth, authApi, db, firestore } = await getFirebaseServices();
    const provider = new authApi.GoogleAuthProvider();

    elements.googleLoginButton.addEventListener("click", async () => {
      try {
        setMessage("Abriendo acceso con Google...");
        await authApi.signInWithPopup(auth, provider);
      } catch (error) {
        console.error(error);
        setMessage("No fue posible iniciar sesión con Google.", "error");
      }
    });

    elements.logoutButton.addEventListener("click", async () => {
      await authApi.signOut(auth);
      setMessage("Sesión cerrada.");
    });

    authApi.onAuthStateChanged(auth, user => {
      const signedIn = Boolean(user);
      elements.fieldset.disabled = !signedIn;
      elements.googleLoginButton.classList.toggle("hidden", signedIn);
      elements.logoutButton.classList.toggle("hidden", !signedIn);

      if (signedIn) {
        elements.authTitle.textContent = user.displayName || "Usuario conectado";
        elements.authDescription.textContent = user.email || "Ya puedes registrar vendedores.";
        if (!getValue("sellerName") && user.displayName) {
          document.getElementById("sellerName").value = user.displayName;
        }
      } else {
        elements.authTitle.textContent = "Inicia sesión para continuar";
        elements.authDescription.textContent = "Firebase requiere una cuenta autenticada para guardar ubicaciones.";
      }
    });

    elements.currentLocationButton.addEventListener("click", () => {
      if (!navigator.geolocation) {
        setMessage("Tu navegador no permite obtener la ubicación.", "error");
        return;
      }

      setMessage("Obteniendo ubicación...");

      navigator.geolocation.getCurrentPosition(
        position => {
          document.getElementById("latitude").value = position.coords.latitude.toFixed(7);
          document.getElementById("longitude").value = position.coords.longitude.toFixed(7);
          setMessage("Ubicación obtenida correctamente.", "success");
        },
        error => {
          console.error(error);
          setMessage("No se pudo obtener la ubicación. Usa HTTPS o localhost y concede el permiso.", "error");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });

    elements.form.addEventListener("submit", async event => {
      event.preventDefault();

      const user = auth.currentUser;
      if (!user) {
        setMessage("Debes iniciar sesión antes de guardar.", "error");
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
        elements.saveButton.textContent = "Guardando...";
        setMessage("Guardando vendedor en Firestore...");

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
        setMessage("Vendedor guardado. Ya debe aparecer en el mapa.", "success");
      } catch (error) {
        console.error(error);
        setMessage(error.message || "No fue posible guardar el vendedor.", "error");
      } finally {
        elements.saveButton.disabled = false;
        elements.saveButton.textContent = "Guardar vendedor";
      }
    });
  } catch (error) {
    console.error(error);
    setMessage("Firebase no pudo iniciar. Revisa la configuración del proyecto.", "error");
  }
}

start();
