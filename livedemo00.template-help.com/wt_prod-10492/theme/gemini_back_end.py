import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai


# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)


# Leer la clave del archivo .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Modelo actual y económico
GEMINI_MODEL = "gemini-3.5-flash-lite"


def create_gemini_client():
    """
    Crea el cliente de Gemini usando la clave guardada en .env.
    """
    if not GEMINI_API_KEY:
        raise RuntimeError(
            "No se encontró GEMINI_API_KEY en el archivo .env."
        )

    return genai.Client(api_key=GEMINI_API_KEY)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "El servidor del chatbot está funcionando."
    }), 200


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        prompt = str(data.get("prompt", "")).strip()

        if not prompt:
            return jsonify({
                "error": "No se proporcionó ningún mensaje."
            }), 400

        client = create_gemini_client()

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )

        response_text = str(
            getattr(response, "text", "") or ""
        ).strip()

        if not response_text:
            return jsonify({
                "error": "Gemini devolvió una respuesta vacía."
            }), 502

        return jsonify({
            "response": response_text
        }), 200

    except RuntimeError as error:
        print("Error de configuración:", error)

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:
        print("Error de Gemini:", repr(error))

        error_text = str(error)

        if (
            "invalid authentication credentials" in error_text.lower()
            or "unauthenticated" in error_text.lower()
            or "access token" in error_text.lower()
        ):
            return jsonify({
                "error": (
                    "Google rechazó la API key. "
                    "Crea una clave nueva en Google AI Studio y "
                    "reemplázala en el archivo .env."
                )
            }), 401

        return jsonify({
            "error": error_text or "Ocurrió un error al consultar Gemini."
        }), 500


if __name__ == "__main__":
    print("API key cargada:", bool(GEMINI_API_KEY))
    print("Modelo:", GEMINI_MODEL)

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )