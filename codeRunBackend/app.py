from flask import Flask, request, jsonify
from flask_cors import CORS
from run_code import run_cpp_code

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

@app.route("/run", methods=["POST"])
def run_code():
    data = request.get_json()
    code = data.get("code", "")
    language = data.get("language", "")

    if language != "cpp":
        return jsonify({"error": "Only C++ is supported"}), 400

    output = run_cpp_code(code)
    return jsonify({"output": output})

if __name__ == "__main__":
    app.run(debug=True)
