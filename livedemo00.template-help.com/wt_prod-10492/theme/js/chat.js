const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const fileUploadButton = document.querySelector("#file-upload");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
const chatForm = document.querySelector(".chat-form");

// Imagen que aparece junto a las respuestas del bot
const BOT_AVATAR = "images/lechugaj.png";

// El JavaScript se conecta a Flask.
// La clave de Gemini NO debe estar aquí.
const API_URL = "http://127.0.0.1:5000/chat";

const userData = {
    message: "",
    file: {
        data: null,
        mime_type: null
    }
};

const chatHistory = [];

const initialInputHeight = messageInput.scrollHeight;


/* =========================================================
   FUNCIONES GENERALES
========================================================= */

// Desplazarse hasta el último mensaje
const scrollToLatestMessage = () => {
    chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth"
    });
};


// Crear un elemento para los mensajes
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");

    div.classList.add("message", ...classes);
    div.innerHTML = content;

    return div;
};


// Limpiar la imagen seleccionada
const resetSelectedFile = () => {
    userData.file = {
        data: null,
        mime_type: null
    };

    fileUploadWrapper.classList.remove("file-uploaded");

    const previewImage = fileUploadWrapper.querySelector("img");

    if (previewImage) {
        previewImage.src = "";
    }

    fileInput.value = "";
};


/* =========================================================
   RESPUESTA DEL CHATBOT
========================================================= */

const generateBotResponse = async (
    incomingMessageDiv,
    userMessage
) => {
    const messageElement =
        incomingMessageDiv.querySelector(".message-text");

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: userMessage
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.error ||
                "No se pudo obtener una respuesta del chatbot."
            );
        }

        const apiResponseText = String(
            data?.response || ""
        )
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .trim();

        if (!apiResponseText) {
            throw new Error(
                "El chatbot devolvió una respuesta vacía."
            );
        }

        // Mostrar respuesta del bot
        messageElement.textContent = apiResponseText;

        // Guardar respuesta en el historial local
        chatHistory.push({
            role: "model",
            parts: [
                {
                    text: apiResponseText
                }
            ]
        });

    } catch (error) {
        console.error("Error del chatbot:", error);

        messageElement.textContent =
            error.message ||
            "Ocurrió un error al conectar con el chatbot.";

        messageElement.style.color = "#ff0000";

    } finally {
        incomingMessageDiv.classList.remove("thinking");
        scrollToLatestMessage();
    }
};


/* =========================================================
   ENVIAR MENSAJE
========================================================= */

const handleOutgoingMessage = (event) => {
    event.preventDefault();

    const currentMessage = messageInput.value.trim();
    const hasFile = Boolean(userData.file.data);

    // El backend actual necesita texto.
    if (!currentMessage) {
        if (hasFile) {
            alert(
                "Escribe un mensaje junto con la imagen. " +
                "El backend todavía no procesa imágenes."
            );
        }

        return;
    }

    userData.message = currentMessage;

    // Guardar una copia antes de limpiar el input
    const messageToSend = currentMessage;

    // Contenido que se mostrará en el mensaje del usuario
    const messageContent = `
        <div class="message-text"></div>

        ${
            hasFile
                ? `
                    <img
                        src="data:${userData.file.mime_type};base64,${userData.file.data}"
                        class="attachment"
                        alt="Imagen enviada por el usuario"
                    >
                `
                : ""
        }
    `;

    const outgoingMessageDiv = createMessageElement(
        messageContent,
        "user-message"
    );

    const outgoingMessageText =
        outgoingMessageDiv.querySelector(".message-text");

    outgoingMessageText.textContent = messageToSend;

    chatBody.appendChild(outgoingMessageDiv);

    // Guardar mensaje del usuario en historial local
    chatHistory.push({
        role: "user",
        parts: [
            {
                text: messageToSend
            }
        ]
    });

    // Limpiar campo de texto
    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));

    // Limpiar imagen después de mostrarla
    resetSelectedFile();

    scrollToLatestMessage();

    // Crear mensaje del bot con los puntos de carga
    setTimeout(() => {
        const botMessageContent = `
            <img
                class="bot-avatar"
                src="${BOT_AVATAR}"
                alt="Bot HYDRONEXIS"
            >

            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;

        const incomingMessageDiv = createMessageElement(
            botMessageContent,
            "bot-message",
            "thinking"
        );

        chatBody.appendChild(incomingMessageDiv);

        scrollToLatestMessage();

        generateBotResponse(
            incomingMessageDiv,
            messageToSend
        );

    }, 600);
};


/* =========================================================
   CAMPO DE MENSAJE
========================================================= */

// Enviar con Enter
messageInput.addEventListener("keydown", (event) => {
    const userMessage = event.target.value.trim();

    if (
        event.key === "Enter" &&
        !event.shiftKey &&
        window.innerWidth > 768 &&
        userMessage
    ) {
        event.preventDefault();
        handleOutgoingMessage(event);
    }
});


// Ajustar automáticamente la altura del textarea
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height =
        `${messageInput.scrollHeight}px`;

    chatForm.style.borderRadius =
        messageInput.scrollHeight > initialInputHeight
            ? "15px"
            : "32px";
});


/* =========================================================
   SUBIR IMÁGENES
========================================================= */

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Selecciona un archivo de imagen válido.");
        fileInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        const previewImage =
            fileUploadWrapper.querySelector("img");

        if (previewImage) {
            previewImage.src = event.target.result;
        }

        fileUploadWrapper.classList.add("file-uploaded");

        const base64String =
            event.target.result.split(",")[1];

        userData.file = {
            data: base64String,
            mime_type: file.type
        };
    };

    reader.onerror = () => {
        alert("No se pudo leer la imagen seleccionada.");
        resetSelectedFile();
    };

    reader.readAsDataURL(file);
});


// Cancelar imagen seleccionada
fileCancelButton.addEventListener("click", () => {
    resetSelectedFile();
});


// Abrir el explorador de archivos
fileUploadButton.addEventListener("click", () => {
    fileInput.click();
});


/* =========================================================
   SELECTOR DE EMOJIS
========================================================= */

const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",

    onEmojiSelect: (emoji) => {
        const {
            selectionStart: start,
            selectionEnd: end
        } = messageInput;

        messageInput.setRangeText(
            emoji.native,
            start,
            end,
            "end"
        );

        messageInput.dispatchEvent(
            new Event("input")
        );

        messageInput.focus();
    },

    onClickOutside: (event) => {
        if (event.target.id === "emoji-picker") {
            document.body.classList.toggle(
                "show-emoji-picker"
            );
        } else {
            document.body.classList.remove(
                "show-emoji-picker"
            );
        }
    }
});

chatForm.appendChild(picker);


/* =========================================================
   EVENTOS DEL CHATBOT
========================================================= */

// Enviar mensaje mediante el formulario
chatForm.addEventListener(
    "submit",
    handleOutgoingMessage
);


// Abrir o cerrar chatbot
chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});


// Cerrar chatbot
closeChatbot.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
});