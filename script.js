class Chatbot {
    constructor(userName = 'Guest') {
        this.userName = userName;
        this.messagesContainer = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.emojiBtn = document.getElementById('emojiBtn');
        this.attachmentBtn = document.getElementById('attachmentBtn');
        this.clearChatBtn = document.getElementById('clearChatBtn');

        // Configuration - Update these URLs as needed
        this.config = {
            apiUrl: 'http://localhost:5001/query', 
            headers: {
                'Content-Type': 'application/json',
            }
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Send button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Clear chat button click
        this.clearChatBtn.addEventListener('click', () => this.clearChat());

        // Input focus/blur events
        this.messageInput.addEventListener('focus', () => {
            this.messageInput.parentElement.style.boxShadow = '0 0 0 3px rgba(75, 0, 130, 0.1)';
        });

        this.messageInput.addEventListener('blur', () => {
            this.messageInput.parentElement.style.boxShadow = 'none';
        });

        // Placeholder functionality for emoji and attachment buttons
        this.emojiBtn.addEventListener('click', () => {
            alert('Emoji functionality is not implemented yet.');
        });

        this.attachmentBtn.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const message = `Attached file: ${file.name}`;
                this.addUserMessage(message);
                // Here you would typically handle the file upload
            }
        });
    }

    clearChat() {
        this.messagesContainer.innerHTML = '';
        this.showWelcomeMessage();
    }

    showWelcomeMessage() {
        const welcomeMessages = [
            { text: `Hello ${this.userName}! 👋\nHow can I help you today?`, time: 0 }
        ];

        this.messagesContainer.innerHTML = ''; // Clear existing messages

        welcomeMessages.forEach(msg => {
            setTimeout(() => {
                const messageElement = this.createMessageElement(msg.text, 'bot');
                this.messagesContainer.appendChild(messageElement);
                this.scrollToBottom();
            }, msg.time);
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Clear input
        this.messageInput.value = '';

        // Add user message to chat
        this.addUserMessage(message);

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Make API call to backend
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: this.config.headers,
                body: JSON.stringify({
                    query: message
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Remove typing indicator
            this.removeTypingIndicator();

            // Add bot response
            this.addBotMessage(data.response || data.message || 'Sorry, I didn\'t understand that.');

        } catch (error) {
            console.error('Error sending message:', error);

            // Remove typing indicator
            this.removeTypingIndicator();

            // Show error message
            this.addBotMessage('Sorry, I\'m having trouble connecting right now. Please try again later.');
        }
    }

    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }


        addBotMessage(message) {
        const messageElement = this.createMessageElement(this.formatMessage(message), 'bot');
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    formatMessage(message) {
        return {
            type: 'complex',
            content: message
        };
    }    createMessageElement(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';

        if (type === 'bot') {
            avatar.innerHTML = `
                <div class="bot-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="4" width="20" height="16" rx="3" fill="#4B0082"/>
                        <circle cx="9" cy="10" r="1.5" fill="white"/>
                        <circle cx="15" cy="10" r="1.5" fill="white"/>
                        <path d="M7 14.5C7 14.5 9.5 16 12 16C14.5 16 17 14.5 17 14.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
            `;
        }

        const content = document.createElement('div');
        content.className = 'message-content';

        const text = document.createElement('div');
        text.className = 'message-text';

        if (typeof message === 'object' && message.type === 'complex') {
            const messageText = message.content;
            if (messageText.includes('```')) {
                const parts = messageText.split(/```(?:\w+)?\n/);
                parts.forEach((part, index) => {
                    if (index % 2 === 0) {
                        // Regular text
                        if (part.trim()) {
                            const textPart = document.createElement('div');
                            textPart.className = 'text-part';
                            const formattedText = part.trim().replace(/\n/g, '<br>');
                            textPart.innerHTML = formattedText;
                            text.appendChild(textPart);
                        }
                    } else {
                        // Code block
                        const codeBlock = document.createElement('pre');
                        const code = document.createElement('code');
                        code.textContent = part.trim();
                        codeBlock.appendChild(code);
                        text.appendChild(codeBlock);
                    }
                });
            } else {
                const formattedText = messageText.replace(/\n/g, '<br>');
                text.innerHTML = formattedText;
            }
        } else {
            const formattedText = message.replace(/\n/g, '<br>');
            text.innerHTML = formattedText;
        }

        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        content.appendChild(text);
        content.appendChild(time);
        
        if (type === 'bot') {
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
        } else {
            messageDiv.appendChild(content);
            messageDiv.appendChild(avatar);
        }

        return messageDiv;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        // Remove existing typing indicator just in case
        this.removeTypingIndicator();

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message typing-message';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = `
            <div class="bot-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="3" fill="#4B0082"/>
                    <circle cx="9" cy="10" r="1.5" fill="white"/>
                    <circle cx="15" cy="10" r="1.5" fill="white"/>
                    <path d="M7 14.5C7 14.5 9.5 16 12 16C14.5 16 17 14.5 17 14.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'message-content';

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        content.appendChild(indicator);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingMessage = this.messagesContainer.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    generateSessionId() {
        // Simple session ID generator (for demonstration purposes)
        const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
        return sessionId;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotInstance = new Chatbot('Aamir');
    window.chatbotInstance.showWelcomeMessage();
});

// Optional: Add some utility functions for customization
window.ChatbotUtils = {
    // Update API configuration
    updateConfig: (newConfig) => {
        if (window.chatbotInstance) {
            Object.assign(window.chatbotInstance.config, newConfig);
        }
    },

    // Add custom message
    addCustomMessage: (message, type = 'bot') => {
        if (window.chatbotInstance) {
            if (type === 'bot') {
                window.chatbotInstance.addBotMessage(message);
            } else {
                window.chatbotInstance.addUserMessage(message);
            }
        }
    },

    // Clear chat history
    clearChat: () => {
        if (window.chatbotInstance) {
            window.chatbotInstance.messagesContainer.innerHTML = '';
            window.chatbotInstance.showWelcomeMessage();
        }
    }
};