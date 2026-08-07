document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("./components/header.html");

        if (!response.ok) {
            throw new Error("No se pudo cargar el header");
        }

        const header = await response.text();

        document.getElementById("header").innerHTML = header;
    } catch (error) {
        console.error("Error cargando el header:", error);
    }
});