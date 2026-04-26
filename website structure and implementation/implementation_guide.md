# D'Tee & Gee Kitchen Website Implementation Guide

This guide provides step-by-step instructions on how to set up and run the D'Tee & Gee Kitchen e-commerce website on your local machine using VS Code. Follow these instructions carefully to ensure a smooth setup process.

## 1. Prerequisites

Before you begin, ensure you have the following software installed on your system:

*   **Visual Studio Code (VS Code):** A powerful and free code editor. Download from [https://code.visualstudio.com/](https://code.visualstudio.com/)
*   **Python 3.8+:** For the Flask backend. Download from [https://www.python.org/downloads/](https://www.python.org/downloads/)
*   **Node.js and npm (or Yarn):** For managing frontend dependencies (though for this project, we're using pure HTML/CSS/JS, npm is useful for general web development tools). Download from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
*   **Git:** For version control (optional, but good practice for managing code). Download from [https://git-scm.com/downloads](https://git-scm.com/downloads)

## 2. Get the Source Code

First, you need to get the website's source code onto your machine. You can do this by either cloning a Git repository (if you have one) or by manually copying the provided source code files.

### Option A: Using Git (Recommended)

If you have the project in a Git repository, open your terminal or VS Code's integrated terminal (`Ctrl+\`` or `Cmd+\``) and run:

```bash
git clone <your-repository-url>
cd dtee-gee-kitchen
```

Replace `<your-repository-url>` with the actual URL of your Git repository.

### Option B: Manual Copy

If you received the source code as a zipped file or individual files, create a new folder on your computer (e.g., `dtee-gee-kitchen`) and extract/copy all the provided files into this folder.

## 3. Open the Project in VS Code

1.  Open VS Code.
2.  Go to `File > Open Folder...` (or `Cmd+Shift+O` on macOS).
3.  Navigate to the `dtee-gee-kitchen` folder you created/cloned and click `Open`.

## 4. Backend Setup (Python Flask)

The backend is built with Python Flask and uses SQLite as its database. We'll set up a virtual environment to manage dependencies.

1.  **Open a new terminal in VS Code:** Go to `Terminal > New Terminal`.
2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
3.  **Create a Python virtual environment:**
    ```bash
    python3 -m venv venv
    ```
    *   If `python3` doesn't work, try `python`.
4.  **Activate the virtual environment:**
    *   **On macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
    *   **On Windows (Command Prompt):**
        ```bash
        venv\Scripts\activate.bat
        ```
    *   **On Windows (PowerShell):**
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```
    You should see `(venv)` at the beginning of your terminal prompt, indicating the virtual environment is active.
5.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *   If `requirements.txt` is not provided, you will need to install the necessary libraries manually:
        ```bash
        pip install Flask Flask-SQLAlchemy Flask-CORS Werkzeug
        ```
6.  **Initialize the database and seed data:**
    The project uses a SQLite database (`app.db`) which will be created automatically. The `seed_data.py` script populates it with initial categories and products.
    ```bash
    python seed_data.py
    ```
    *   If you encounter an error about the database already existing, you might need to delete the old `app.db` file first (located in `backend/src/database/`).
        ```bash
        rm src/database/app.db  # On macOS/Linux
        del src\database\app.db # On Windows
        python seed_data.py
        ```
7.  **Run the Flask backend server:**
    ```bash
    python src/main.py
    ```
    You should see output indicating the Flask app is running, typically on `http://127.0.0.1:5000` or `http://localhost:5000`.

    *Leave this terminal open and running. The backend server needs to be active for the frontend to work.*

## 5. Frontend Setup (HTML, CSS, JavaScript)

The frontend is a static website served by a simple Python HTTP server. This allows for easy local testing.

1.  **Open a *new* terminal in VS Code:** Go to `Terminal > New Terminal` (do not close the backend terminal).
2.  **Navigate to the project root directory:**
    ```bash
    cd /home/ubuntu/dtee-gee-kitchen
    ```
    (If you are already in the root, you don't need to `cd`.)
3.  **Run the frontend server:**
    ```bash
    python serve_frontend.py 3000
    ```
    This will start a simple HTTP server serving the `frontend` directory on port `3000`.

    *Leave this terminal open and running.*

## 6. Access the Website

Once both the backend and frontend servers are running, open your web browser and navigate to:

[http://localhost:3000](http://localhost:3000)

You should see the D'Tee & Gee Kitchen website loading. If you see a loading screen, it might take a moment for the content to appear as it fetches data from the backend.

## 7. Important Notes & Troubleshooting

*   **Backend Port:** The backend runs on port `5000`. The frontend will communicate with it on this port. If you change the backend port, you'll need to update `frontend/js/api.js` to reflect the new port.
*   **Frontend Port:** The frontend runs on port `3000`. If this port is in use, the `serve_frontend.py` script might fail. You can try a different port by running `python serve_frontend.py <new_port_number>`.
*   **CORS Issues:** If you encounter 

