const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
const fileUploadButton = document.querySelector("#file-upload");
const chatForm = document.querySelector(".chat-form");

// Ruta de la imagen del bot
const BOT_AVATAR = "images/lechugaj.png";

// API Configuración
// Reemplaza este texto con una clave nueva.
const API_KEY = "APIII ";

const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const userData = {
    message: "",
    file: {
        data: null,
        mime_type: null
    }
};

const chatHistory = [];

const initialInputHeight = messageInput.scrollHeight;

// Desplazarse hasta el último mensaje
const scrollToLatestMessage = () => {
    chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth"
    });
};

// Crear un elemento de mensaje
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");

    div.classList.add("message", ...classes);
    div.innerHTML = content;

    return div;
};

// Limpiar el archivo seleccionado
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
};

// Generar respuesta del bot usando la API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement =
        incomingMessageDiv.querySelector(".message-text");

    const userParts = [];

    // Agregar texto solamente si existe
    if (userData.message) {
        userParts.push({
            text: userData.message
        });
    }

    // Agregar imagen si el usuario seleccionó una
    if (userData.file.data && userData.file.mime_type) {
        userParts.push({
            inline_data: {
                data: userData.file.data,
                mime_type: userData.file.mime_type
            }
        });
    }

    // Agregar mensaje del usuario al historial
    chatHistory.push({
        role: "user",
        parts: userParts
    });

const requestOptions = {
    method: "POST",

    headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
    },

    body: JSON.stringify({
        contents: chatHistory
    })
};

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.error?.message ||
                "No se pudo obtener una respuesta del chatbot."
            );
        }

        const responseParts =
            data?.candidates?.[0]?.content?.parts;

        if (!responseParts || responseParts.length === 0) {
            throw new Error(
                "El chatbot no devolvió ninguna respuesta."
            );
        }

        // Unir todas las partes de texto de la respuesta
        const apiResponseText = responseParts
            .map((part) => part.text || "")
            .join("")
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .trim();

        if (!apiResponseText) {
            throw new Error(
                "La respuesta del chatbot está vacía."
            );
        }

        messageElement.textContent = apiResponseText;

        // Agregar respuesta del bot al historial
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
            "Ocurrió un error al generar la respuesta.";

        messageElement.style.color = "#ff0000";

    } finally {
        resetSelectedFile();

        incomingMessageDiv.classList.remove("thinking");

        scrollToLatestMessage();
    }
};

// Gestionar mensajes enviados por el usuario
const handleOutgoingMessage = (event) => {
    event.preventDefault();

    const currentMessage = messageInput.value.trim();
    const hasFile = Boolean(userData.file.data);

    // Evitar enviar si no hay texto ni imagen
    if (!currentMessage && !hasFile) {
        return;
    }

    userData.message = currentMessage;

    // Crear contenido del mensaje del usuario
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

    // Mostrar texto solamente si existe
    if (currentMessage) {
        outgoingMessageText.textContent = currentMessage;
    } else {
        outgoingMessageText.remove();
    }

    chatBody.appendChild(outgoingMessageDiv);

    // Limpiar el campo de texto
    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));

    // Ocultar la vista previa, pero conservar temporalmente
    // los datos para enviarlos a la API
    fileUploadWrapper.classList.remove("file-uploaded");

    scrollToLatestMessage();

    // Mostrar indicador de escritura del bot
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

        generateBotResponse(incomingMessageDiv);

    }, 600);
};

// Enviar mensaje presionando Enter
messageInput.addEventListener("keydown", (event) => {
    const userMessage = event.target.value.trim();
    const hasFile = Boolean(userData.file.data);

    if (
        event.key === "Enter" &&
        !event.shiftKey &&
        window.innerWidth > 768 &&
        (userMessage || hasFile)
    ) {
        event.preventDefault();
        handleOutgoingMessage(event);
    }
});

// Ajustar automáticamente la altura del textarea
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;

    chatForm.style.borderRadius =
        messageInput.scrollHeight > initialInputHeight
            ? "15px"
            : "32px";
});

// Seleccionar y mostrar una imagen
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    // Verificar que sea una imagen
    if (!file.type.startsWith("image/")) {
        alert("Selecciona un archivo de imagen válido.");
        fileInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        const previewImage =
            fileUploadWrapper.querySelector("img");

        previewImage.src = event.target.result;

        fileUploadWrapper.classList.add("file-uploaded");

        const base64String =
            event.target.result.split(",")[1];

        userData.file = {
            data: base64String,
            mime_type: file.type
        };

        fileInput.value = "";
    };

    reader.onerror = () => {
        alert("No se pudo leer la imagen seleccionada.");
        resetSelectedFile();
    };

    reader.readAsDataURL(file);
});

// Cancelar archivo seleccionado
fileCancelButton.addEventListener("click", () => {
    resetSelectedFile();
});

// Inicializar selector de emojis
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

        messageInput.dispatchEvent(new Event("input"));
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

// Agregar selector de emojis al formulario
chatForm.appendChild(picker);

// Enviar desde el formulario
chatForm.addEventListener(
    "submit",
    handleOutgoingMessage
);

// Abrir selector de archivos
fileUploadButton.addEventListener("click", () => {
    fileInput.click();
});

// Abrir o cerrar chatbot
chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});

// Cerrar chatbot
closeChatbot.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
});