from flask import Flask, request, jsonify
import requests
 
app = Flask(__name__)
 
GEMINI_API_KEY = "AQ.Ab8RN6Ixf-wQ0IpnQnCnadgfFtGPrnVoh-Nj9jXhprGJrr3rSw"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"



@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    payload = {
        'contents': [{
            'parts': [{
                'text': prompt
            }]
        }]
    }
    try:
        response = requests.post(GEMINI_URL, json=payload, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        result = response.json()
        text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
        return jsonify({'response': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
if __name__ == '__main__':
    app.run(debug=True)
 