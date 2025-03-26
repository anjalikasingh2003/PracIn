import subprocess
import uuid
import os

def run_cpp_code(code):
    filename = f"/tmp/{uuid.uuid4().hex}.cpp"
    with open(filename, "w") as f:
        f.write(code)

    exe_file = filename.replace(".cpp", "")

    try:
        # Compile the C++ code
        compile_result = subprocess.run(
            ["g++", filename, "-o", exe_file],
            stderr=subprocess.PIPE,
            text=True,
            timeout=5
        )

        if compile_result.returncode != 0:
            return compile_result.stderr

        # Run the compiled executable
        run_result = subprocess.run(
            [exe_file],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=5
        )

        return run_result.stdout + run_result.stderr

    except subprocess.TimeoutExpired:
        return "Error: Execution timed out."
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        # Cleanup
        if os.path.exists(filename): os.remove(filename)
        if os.path.exists(exe_file): os.remove(exe_file)
