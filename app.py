from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Knowledge Base (Hash Map) with 5+ intents for O(1) constant time lookup
KNOWLEDGE_BASE = {
    "hello": "Hello! Welcome to the White Box AI Chatbot. How can I assist you today?",
    "help": "Here are some topics you can ask me about: **about**, **features**, **contact**, or type **exit** to close the session.",
    "about": "I am a deterministic, Rule-Based AI Chatbot. I operate on hard-coded logic gates, ensuring 100% predictability and 0% hallucination risk.",
    "features": "My key features include: O(1) constant-time dictionary lookup, client-server architecture using Flask, robust input sanitization, and session control.",
    "contact": "You can reach Decode Labs at info@decodelabs.ai or visit our website for more information.",
    "exit": "Thank you for chatting! The session has been terminated. You can click 'Restart Session' to start over."
}

# Fallback response for any unknown queries
FALLBACK_RESPONSE = "I'm sorry, I don't recognize that request. Please try asking for **hello**, **help**, **about**, **features**, or **contact**."

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_input = data.get("message", "")
    
    # Sanitization: normalize user input by converting to lowercase and stripping whitespace
    sanitized_input = user_input.strip().lower()
    
    # Atomic Logic: Use the .get() method to match user input to a response with a fallback
    response = KNOWLEDGE_BASE.get(sanitized_input, FALLBACK_RESPONSE)
    
    # If the user typed exit, we can signal the frontend to end the session
    end_session = (sanitized_input in ["exit", "bye", "quit"])
    
    return jsonify({
        "response": response,
        "end_session": end_session
    })

if __name__ == "__main__":
    app.run(debug=True)
