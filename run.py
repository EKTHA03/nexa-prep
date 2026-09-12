#!/usr/bin/env python3
"""
Nexa Prep AI — Unified Run Script
Launches both FastAPI backend and Vite frontend development servers simultaneously.
"""

import sys
import os
import subprocess
import time
from pathlib import Path

# Force UTF-8 environment encoding on Windows
os.environ["PYTHONIOENCODING"] = "utf-8"
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def find_python_executable():
    venv_python = ROOT_DIR / "venv" / "Scripts" / "python.exe"
    if venv_python.exists():
        return str(venv_python)
    return sys.executable

def main():
    print("=" * 70)
    print("[+] Starting Nexa Prep AI Development Platform")
    print("=" * 70)

    python_bin = find_python_executable()
    print(f"[*] Python Executable : {python_bin}")
    print(f"[*] Root Directory     : {ROOT_DIR}")
    print(f"[*] Backend Directory  : {BACKEND_DIR}")
    print(f"[*] Frontend Directory : {FRONTEND_DIR}")
    print("-" * 70)

    processes = []

    try:
        # 1. Start FastAPI Backend Process
        print("[*] Starting FastAPI Backend Server on http://localhost:8080 ...")
        backend_cmd = [python_bin, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]
        backend_proc = subprocess.Popen(
            backend_cmd,
            cwd=str(BACKEND_DIR),
            shell=True if os.name == 'nt' else False
        )
        processes.append(backend_proc)

        time.sleep(2)

        # 2. Start Vite Frontend Process
        print("[*] Starting Vite Frontend Dev Server on http://localhost:5173 ...")
        npm_cmd = "npm.cmd" if os.name == 'nt' else "npm"
        frontend_proc = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=str(FRONTEND_DIR),
            shell=True if os.name == 'nt' else False
        )
        processes.append(frontend_proc)

        print("-" * 70)
        print("[+] Nexa Prep AI is running successfully!")
        print("  -> Frontend URL : http://localhost:5173")
        print("  -> Backend API   : http://localhost:8080")
        print("  -> Swagger Docs : http://localhost:8080/docs")
        print("-" * 70)
        print("Press Ctrl+C to stop all servers.")
        print("=" * 70)

        # Keep main thread alive and monitor subprocesses
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n[*] Stopping Nexa Prep AI servers...")
        for proc in processes:
            try:
                proc.terminate()
                proc.wait(timeout=3)
            except Exception:
                proc.kill()
        print("[+] All servers stopped. Goodbye!")

if __name__ == "__main__":
    main()
