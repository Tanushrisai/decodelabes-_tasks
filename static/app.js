// JavaScript Controller for Rule-Based AI Chatbot

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatHistory = document.getElementById("chat-history");
    const suggestChips = document.querySelectorAll(".suggest-chip");
    const exitBtnTop = document.getElementById("exit-btn-top");
    const exitOverlay = document.getElementById("exit-overlay");
    const restartBtn = document.getElementById("restart-btn");
    const statusIndicator = document.querySelector(".status-indicator");
    const statusText = document.querySelector(".status-text");

    let isSessionActive = true;

    // Scroll chat history to the bottom
    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Format current time as short timestamp
    function getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Append a message to the chat history
    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", `${sender}-message`);

        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("avatar");
        avatarDiv.innerHTML = sender === "bot" 
            ? '<i class="fa-solid fa-robot"></i>' 
            : '<i class="fa-solid fa-user"></i>';

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("message-content-wrapper");

        const content = document.createElement("div");
        content.classList.add("message-content");
        
        // Handle bold markdown formatting (**text**)
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Handle newlines
        formattedText = formattedText.replace(/\n/g, '<br>');
        content.innerHTML = formattedText;

        const timestamp = document.createElement("span");
        timestamp.classList.add("timestamp");
        timestamp.textContent = getFormattedTime();

        contentWrapper.appendChild(content);
        contentWrapper.appendChild(timestamp);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentWrapper);
        chatHistory.appendChild(messageDiv);

        scrollToBottom();
    }

    // Send a message to the Flask backend
    async function sendMessage(messageText) {
        if (!messageText.trim() || !isSessionActive) return;

        // Display user message in UI
        appendMessage("user", messageText);
        
        // Disable input while loading
        chatInput.disabled = true;

        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                throw new Error("Server communication error");
            }

            const data = await response.json();
            
            // Artificial delay to simulate a quick "thought" process and show micro-animation
            setTimeout(() => {
                appendMessage("bot", data.response);
                chatInput.disabled = false;
                chatInput.focus();

                if (data.end_session) {
                    terminateSession();
                }
            }, 300);

        } catch (error) {
            console.error("Error:", error);
            appendMessage("bot", "Oops! I ran into an error communicating with the backend logic gate. Please check the server status.");
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    // Terminate session and show overlay
    function terminateSession() {
        isSessionActive = false;
        statusIndicator.className = "status-indicator offline";
        statusText.textContent = "Session Terminated";
        chatInput.disabled = true;
        
        setTimeout(() => {
            exitOverlay.style.display = "flex";
        }, 1200);
    }

    // Restart session and reset UI
    function restartSession() {
        // Reset chat history to initial message
        chatHistory.innerHTML = `
            <div class="message bot-message">
                <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="message-content-wrapper">
                    <div class="message-content">
                        Hello! I am a Rule-Based Chatbot. I match your queries directly against my knowledge base with 100% precision. 
                        <br><br>
                        Try using one of the suggestion chips below or ask me a question!
                    </div>
                    <span class="timestamp">Just now</span>
                </div>
            </div>
        `;

        isSessionActive = true;
        chatInput.disabled = false;
        chatInput.value = "";
        statusIndicator.className = "status-indicator online";
        statusText.textContent = "Active Session";
        exitOverlay.style.display = "none";
        chatInput.focus();
    }

    // Form submission listener
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatInput.value;
        chatInput.value = "";
        sendMessage(text);
    });

    // Suggestion chips listeners
    suggestChips.forEach(chip => {
        chip.addEventListener("click", () => {
            if (isSessionActive) {
                const intent = chip.getAttribute("data-intent");
                sendMessage(intent);
            }
        });
    });

    // Top Exit Button listener
    exitBtnTop.addEventListener("click", () => {
        if (isSessionActive) {
            sendMessage("exit");
        }
    });

    // Restart Button listener in modal
    restartBtn.addEventListener("click", () => {
        restartSession();
    });

    // Initial focus
    chatInput.focus();
});
