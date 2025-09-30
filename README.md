# AI Chatbot Widget

> A modern, customizable chatbot widget built with pure HTML, CSS, and JavaScript.
>
> **Author:** Aamir Hussain

![AI Chatbot Widget Preview](./assets/chatbot-preview.png)

This project is a self-contained, front-end chatbot interface. It's designed to be easily integrated into any web page and connected to a backend AI or NLP service. It features a clean, modern design and supports rich message formatting, including code blocks.

## ✨ Features

*   **Modern UI:** Clean and responsive design that works on desktop and mobile.
*   **Dynamic Messaging:** Supports asynchronous communication with a backend service.
*   **Rich Content:** Renders multi-line text and formatted code blocks (using Markdown-like fences ```).
*   **Typing Indicator:** Provides user feedback while the bot is processing a response.
*   **Easy Configuration:** Simple to change the user name and API endpoint directly in `script.js`.
*   **Client-Side Utilities:** Includes a global `ChatbotUtils` object for runtime customizations like updating the API config or clearing the chat.
*   **Extensible:** Includes placeholder functionality for emojis and file attachments.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

1.  **A local web server:** Since the project uses `fetch` to communicate with an API, you need to serve the files from a web server to avoid CORS issues. You can use extensions like Live Server for VS Code or Python's built-in server:
    ```sh
    # Navigate to the project directory
    cd /path/to/Widget

    # Run a simple python web server
    python -m http.server
    ```

2.  **A backend API:** The chatbot needs a backend service to send queries to. The default endpoint is `http://localhost:5001/query`. This backend should expect a POST request with a JSON body like `{"query": "user message"}` and return a JSON response like `{"response": "bot answer"}`.

### Installation

1.  **Clone or download the repository.**

2.  **Configure the chatbot:**
    Open `script.js` and modify the configuration to match your setup.

    *   **Change the user's name:**
        ```javascript
        // In the 'DOMContentLoaded' event listener at the bottom of the file
        window.chatbotInstance = new Chatbot('Your Name');
        ```

    *   **Update the API endpoint:**
        ```javascript
        // Inside the Chatbot class constructor
        this.config = {
            apiUrl: 'http://your-backend-api.com/query', // <-- Update this URL
            headers: {
                'Content-Type': 'application/json',
            }
        };
        ```

3.  **Run the application:**
    Open `index.html` through your local web server (e.g., `http://localhost:8000`).

## 🔧 How to Use

*   Type a message in the input box and press Enter or click the send button.
*   The chatbot will show a typing indicator while waiting for the backend response.
*   Use the "Clear Chat" button in the header to reset the conversation.
*   The `window.ChatbotUtils` object can be used from the browser's developer console to interact with the chatbot instance programmatically.

    ```javascript
    // Example: Update the API URL at runtime
    ChatbotUtils.updateConfig({ apiUrl: 'http://new-api.com/query' });

    // Example: Add a custom message from the bot
    ChatbotUtils.addCustomMessage('This is a custom message!');
    ```

## 📂 Project Structure

```
Widget/
├── index.html      # The main HTML structure for the chatbot.
├── styles.css      # All styles for the chatbot UI.
└── script.js       # The core JavaScript logic and Chatbot class.
```
