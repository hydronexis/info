import os
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS


# Cargar las variables del archivo .env
load_dotenv()

app = Flask(__name__)

# Permitir que Live Server, normalmente en el puerto 5500,
# se comunique con Flask en el puerto 5000
CORS(app)


# Leer la clave desde el archivo .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/"
    "models/gemini-3.1-flash-lite:generateContent"
)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "El servidor del chatbot está funcionando."
    })


@app.route("/chat", methods=["POST"])
def chat():
    if not GEMINI_API_KEY:
        return jsonify({
            "error": "No se encontró GEMINI_API_KEY en el archivo .env."
        }), 500

    data = request.get_json(silent=True) or {}
    prompt = str(data.get("prompt", "")).strip()

    if not prompt:
        return jsonify({
            "error": "No prompt provided"
        }), 400

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY.strip()
    }

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(
            GEMINI_URL,
            headers=headers,
            json=payload,
            timeout=30
        )

        # Mostrar la respuesta en la terminal para diagnosticar errores
        print("Código de Gemini:", response.status_code)
        print("Respuesta de Gemini:", response.text)

        try:
            result = response.json()
        except ValueError:
            return jsonify({
                "error": "Gemini devolvió una respuesta inválida."
            }), 500

        if not response.ok:
            error_message = (
                result.get("error", {}).get("message")
                or "Gemini no pudo procesar la solicitud."
            )

            return jsonify({
                "error": error_message
            }), response.status_code

        candidates = result.get("candidates", [])

        if not candidates:
            return jsonify({
                "error": "Gemini no devolvió candidatos."
            }), 500

        parts = (
            candidates[0]
            .get("content", {})
            .get("parts", [])
        )

        text = "".join(
            part.get("text", "")
            for part in parts
            if isinstance(part, dict)
        ).strip()

        if not text:
            return jsonify({
                "error": "Gemini devolvió una respuesta vacía."
            }), 500

        return jsonify({
            "response": text
        }), 200

    except requests.exceptions.Timeout:
        return jsonify({
            "error": "Gemini tardó demasiado en responder."
        }), 504

    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": "No se pudo conectar con Gemini."
        }), 503

    except requests.exceptions.RequestException as error:
        print("Error de conexión:", error)

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:
        print("Error inesperado:", error)

        return jsonify({
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )