from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS

# === Config ===
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# === Gemini API Config ===
GEMINI_API_KEY = 'AIzaSyD7awi7Hi6W2KL6iMTr6J9QGKBj0YM_MTI'  # Replace with env var in production
GEMINI_API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemma-2-2B:generateContent?key={GEMINI_API_KEY}'

# === Helpers ===
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_audio_and_identify_species(audio_file_path):
    print(f"[DEBUG] analyze_audio_and_identify_species received: {audio_file_path}")

    # This is still a placeholder prompt — no audio is being sent yet
    prompt = "Identify the animal species from this audio file. (Note: The actual audio is not embedded — this is a placeholder call.)"

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    headers = {'Content-Type': 'application/json'}

    print(f"[DEBUG] Sending request to Gemini API with prompt: {prompt}")

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        gemini_output = response.json()

        print("[DEBUG] Gemini API response received.")
        if 'candidates' in gemini_output and gemini_output['candidates']:
            content = gemini_output['candidates'][0].get('content', {})
            parts = content.get('parts', [])
            for part in parts:
                if 'text' in part:
                    print(f"[DEBUG] Gemini response text: {part['text']}")
                    return part['text']
        return "No explanation found from Gemini."
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Error calling Gemini API: {e}")
        return f"Error calling Gemini API: {e}"

# === Routes ===
@app.route('/predict', methods=['POST'])
def upload_file():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file part in the request'}), 400

    file = request.files['audio']
    if file.filename == '':
        return jsonify({'error': 'No selected audio file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        print(f"[DEBUG] Received audio file: {filename}")
        print(f"[DEBUG] Saved at: {filepath}")
        print("[DEBUG] Passing file to AI model...")

        species_or_explanation = analyze_audio_and_identify_species(filepath)

        # Optional: keep file if you want to serve it from frontend
        os.remove(filepath)

        return jsonify({
            'gemini_response': species_or_explanation
        }), 200

    return jsonify({'error': 'Invalid file format'}), 400

# Optional: Serve uploaded files (if you want to preview from frontend)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# === Run the server ===
if __name__ == '__main__':
    app.run(debug=True)
