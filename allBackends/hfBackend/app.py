import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL = os.getenv("HF_MODEL")

HEADERS = {
    "Authorization": f"Bearer {HF_API_TOKEN}"
}

SYSTEM_PROMPT = (
    "You are a strict MAANG technical interviewer. "
    "Your job is to ask DSA questions, one at a time. "
    "Wait for the user's response and assess it. Then give constructive feedback, and ask the next question. "
    "The questions should cover arrays, strings, trees, graphs, dynamic programming, and time complexity."
)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    messages = data.get("messages", [])

    # Prepare prompt (instruction style)
    prompt = SYSTEM_PROMPT + "\n\n"
    for msg in messages:
        role = "User" if msg["role"] == "user" else "Interviewer"
        prompt += f"{role}: {msg['content']}\n"
    prompt += "Interviewer:"

    try:
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{HF_MODEL}",
            headers=HEADERS,
            json={"inputs": prompt}
        )

        if response.status_code != 200:
            print(response.text)
            return jsonify({"error": "Failed to get response from Hugging Face"}), 500

        output = response.json()
        generated = output[0]["generated_text"].split("Interviewer:")[-1].strip()

        return jsonify({"role": "assistant", "content": generated})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5002)
