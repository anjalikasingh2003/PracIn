import threading
import subprocess

def run_backend(folder):
    subprocess.run(["python3", f"{folder}/app.py"])

if __name__ == "__main__":
    backends = ["backend", "dbBackend", "codeRunBackend"]  
    threads = []

    for backend in backends:
        thread = threading.Thread(target=run_backend, args=(backend,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()
