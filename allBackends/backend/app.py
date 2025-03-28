import os
from flask import Flask, request, jsonify
from openai import AzureOpenAI, OpenAI
from flask_cors import CORS
from dotenv import load_dotenv
import traceback
import tiktoken
import requests
from transformers import pipeline
import torch


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

code_review_pipeline = pipeline("text-generation", model="tiiuae/falcon-7b-instruct")  # or similar


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
You are a helpful code reviewer. Analyze the following {language.upper()} code and provide constructive feedback.

CODE:
{code}

Focus on:
- Syntax or logical errors
- Best practices
- Optimization suggestions
- Readability improvements

Your feedback:
"""

        # Generate feedback
        response = code_review_pipeline(
            prompt,
            max_new_tokens=250,
            temperature=0.7,
            top_k=50,
            top_p=0.95,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id  # only if needed
        )   
        print("Pipeline raw response:", response)
        generated_text = response[0]["generated_text"]
        print(generated_text)
        # Clean output (optional)
        feedback = generated_text.replace(prompt, "").strip()
        print(feedback)

        return jsonify({"content": feedback})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5002)
