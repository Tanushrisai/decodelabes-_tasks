# White Box AI Chatbot

A premium, highly interactive web application featuring a rule-based AI chatbot powered by a Flask backend. The chatbot logic uses a deterministic hash-map lookup with server-side input sanitization, guaranteeing 100% predictability and zero hallucination risk.

## Features
- **Deterministic Logic**: Matches user inputs against a hardcoded lookup dictionary with $O(1)$ constant-time complexity.
- **Robust Sanitization**: Automatically normalizes inputs by converting to lowercase and stripping excess whitespace before matching.
- **Continuous Session**: Handles multiple interactions without page refreshes, featuring active/inactive session control.
- **Glassmorphic Dark Mode UI**: A responsive and modern user interface built using vanilla HTML/CSS.

## Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Tanushrisai/decodelabes-_tasks.git
   cd decodelabes-_tasks
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:
   ```bash
   python app.py
   ```

4. **Access the application**:
   Open your browser and navigate to `http://127.0.0.1:5000/`.

## Tech Stack
- **Backend**: Python, Flask
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6)
- **Deployment Server**: Gunicorn (configured for production hosts like Render/Railway)
