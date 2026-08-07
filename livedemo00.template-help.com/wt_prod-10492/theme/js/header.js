document.addEventListener("DOMContentLoaded", async () => {

    try {

        const response = await fetch("components/header.html");

        if (!response.ok) {
            throw new Error("No se pudo cargar el header");
        }

        const header = await response.text();

        document.getElementById("header").innerHTML = header;

        console.log("HEADER INSERTADO");


        // ===========================
        // CARGAR CORE.MIN.JS
        // ===========================

        const coreScript = document.createElement("script");

        coreScript.src = "js/core.min.js";

        coreScript.onload = () => {

            console.log("CORE cargado después del header");


            // ===========================
            // CARGAR SCRIPT.JS DESPUÉS
            // ===========================

            const mainScript = document.createElement("script");

            mainScript.src = "js/script.js";

            mainScript.onload = () => {

                console.log("SCRIPT cargado después de CORE");

                // Header completamente listo
                document.dispatchEvent(
                    new CustomEvent("headerLoaded")
                );

            };

            mainScript.onerror = () => {
                console.error("No se pudo cargar script.js");
            };

            document.body.appendChild(mainScript);

        };


        coreScript.onerror = () => {
            console.error("No se pudo cargar core.min.js");
        };


        document.body.appendChild(coreScript);


    } catch (error) {

        console.error(
            "Error cargando el header:",
            error
        );

    }

});