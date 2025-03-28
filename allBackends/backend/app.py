import os
from flask import Flask, request, jsonify
from openai import AzureOpenAI
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load config
endpoint = os.getenv("ENDPOINT_URL")
deployment = os.getenv("DEPLOYMENT_NAME")
api_key = os.getenv("AZURE_OPENAI_API_KEY")

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_key=api_key,
    api_version="2024-05-01-preview",
    azure_endpoint=endpoint,
)

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        messages = data.get("messages", [])

        if not messages:
            return jsonify({"error": "No messages provided"}), 400

        # General ChatBot Response
        response = client.chat.completions.create(
            model=deployment,
            messages=messages,
            max_tokens=800,
            temperature=0.7,
            top_p=0.95,
        )

        return jsonify(response.choices[0].message.dict())

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/review-code", methods=["POST"])
def review_code():
    try:
        data = request.get_json()
        code = data.get("code", "")
        language = data.get("language", "cpp")

        if not code:
            return jsonify({"error": "No code provided"}), 400

        prompt = f"""
You are a senior developer and expert in reviewing code.

Please analyze the following {language.upper()} code:

{code}

Give detailed feedback including:
1. Syntax or logical errors
2. Code optimization tips
3. Best practices
4. Suggestions for cleaner structure

Use markdown formatting and bullets where necessary.
"""

        response = client.chat.completions.create(
            model=deployment,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.7,
            top_p=0.95,
        )

        return jsonify(response.choices[0].message.dict())

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5002)