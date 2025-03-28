import os
from flask import Flask, request, jsonify
from openai import AzureOpenAI, OpenAI
from flask_cors import CORS
from dotenv import load_dotenv
import traceback
import tiktoken

load_dotenv()

app = Flask(__name__)
CORS(app)

# Azure OpenAI config (for /ask)
azure_endpoint = os.getenv("ENDPOINT_URL")
azure_deployment = os.getenv("DEPLOYMENT_NAME")
azure_api_key = os.getenv("AZURE_OPENAI_API_KEY")

azure_client = AzureOpenAI(
    api_key=azure_api_key,
    api_version="2024-05-01-preview",
    azure_endpoint=azure_endpoint,
)

# OpenAI config (for /review-code)
openai_key = os.getenv("OPENAI_API_KEY")
openai_client = OpenAI(api_key=openai_key)

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        question = data.get("question", "")
        answer = data.get("answer", "")

        if not question or not answer:
            return jsonify({"error": "Both question and answer are required"}), 400

        system_prompt = {
            "role": "system",
            "content": (
                "You are a strict MAANG technical interviewer. "
                "Ask one DSA question at a time. When the user answers, give feedback, then ask the next question. "
                "Focus on data structures and algorithms like arrays, trees, graphs, DP, and time complexity."
            )
        }

        final_messages = [
            system_prompt,
            {"role": "assistant", "content": question},
            {"role": "user", "content": answer}
        ]

        response = azure_client.chat.completions.create(
            model=azure_deployment,
            messages=final_messages,
            max_tokens=800,
            temperature=0.7,
            top_p=0.95,
        )

        return jsonify(response.choices[0].message.dict())

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/review-code", methods=["POST"])
def review_code():
    try:
        data = request.get_json()
        code = data.get("code", "")
        language = data.get("language", "plaintext")

        if not code:
            return jsonify({"error": "No code provided"}), 400

        prompt = f"""
            You are a senior developer and expert in reviewing code.

            Please analyze the following {language.upper()} code:

            ```
            {code}
            ```

            Provide detailed feedback including:

            - Syntax or logical errors
            - Code optimization tips
            - Best practices
            - Suggestions for cleaner structure

            Use markdown formatting and bullet points.
            """

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=800
        )

        return jsonify({'content': response.choices[0].message.content})

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)
