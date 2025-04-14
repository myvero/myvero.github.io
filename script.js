document.addEventListener("DOMContentLoaded", () => {
  const messagesContainer = document.getElementById("messages")
  const messageInput = document.getElementById("message-input")
  const sendButton = document.getElementById("send-button")
  const fileUpload = document.getElementById("file-upload")
  const fileNameDisplay = document.getElementById("file-name")

  let selectedFile = null

  // Auto-resize textarea as user types
  messageInput.addEventListener("input", function () {
    this.style.height = "auto"
    this.style.height = this.scrollHeight + "px"
  })

  // Handle file selection
  fileUpload.addEventListener("change", (e) => {
    selectedFile = e.target.files[0]
    if (selectedFile) {
      fileNameDisplay.textContent = selectedFile.name
    } else {
      fileNameDisplay.textContent = ""
    }
  })

  // Handle sending messages
  sendButton.addEventListener("click", sendMessage)
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  })

  function sendMessage() {
    const messageText = messageInput.value.trim()

    if (!messageText && !selectedFile) return

    // Add user message to chat
    if (messageText) {
      addMessage(messageText, "user")
      messageInput.value = ""
      messageInput.style.height = "24px"
    }

    // Handle file if selected
    if (selectedFile) {
      addFileMessage(selectedFile)
      fileNameDisplay.textContent = ""
      selectedFile = null
      fileUpload.value = ""
    }

    // Process with AI
    processWithAI(messageText, selectedFile)
  }

  function addMessage(text, sender) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}-message`

    // Add avatar
    const avatarDiv = document.createElement("div")
    if (sender === "ai") {
      avatarDiv.className = "ai-avatar"
      avatarDiv.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" fill="#8ab4f8" stroke="#8ab4f8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 22V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20 6L12 12L4 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `
    } else {
      avatarDiv.className = "user-avatar"
      avatarDiv.textContent = "U"
    }
    messageDiv.appendChild(avatarDiv)

    const messageContent = document.createElement("div")
    messageContent.className = "message-content"

    const messageParagraph = document.createElement("p")
    messageParagraph.textContent = text

    messageContent.appendChild(messageParagraph)
    messageDiv.appendChild(messageContent)
    messagesContainer.appendChild(messageDiv)

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function addFileMessage(file) {
    const messageDiv = document.createElement("div")
    messageDiv.className = "message user-message"

    // Add avatar
    const avatarDiv = document.createElement("div")
    avatarDiv.className = "user-avatar"
    avatarDiv.textContent = "U"
    messageDiv.appendChild(avatarDiv)

    const messageContent = document.createElement("div")
    messageContent.className = "message-content"

    const fileInfo = document.createElement("p")
    fileInfo.textContent = `File uploaded: ${file.name}`

    messageContent.appendChild(fileInfo)
    messageDiv.appendChild(messageContent)
    messagesContainer.appendChild(messageDiv)

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  // =============================================
  // GEMINI AI INTEGRATION SECTION
  // =============================================

  function processWithAI(messageText, file) {
    // Show typing indicator
    const typingDiv = document.createElement("div")
    typingDiv.className = "message ai-message typing-indicator"

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "ai-avatar"
    avatarDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" fill="#8ab4f8" stroke="#8ab4f8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 22V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 6L12 12L4 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `
    typingDiv.appendChild(avatarDiv)

    const typingContent = document.createElement("div")
    typingContent.className = "message-content"
    typingContent.innerHTML = "<p>Thinking...</p>"
    typingDiv.appendChild(typingContent)

    messagesContainer.appendChild(typingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight

    // Simulate AI processing delay
    setTimeout(() => {
      // Remove typing indicator
      messagesContainer.removeChild(typingDiv)

      // REPLACE THIS SECTION WITH ACTUAL GEMINI AI INTEGRATION
      // =============================================
      // This is where you would integrate the Gemini AI API
      // Example integration code:
      /*
            // 1. Set up your API key
            const API_KEY = 'YOUR_GEMINI_API_KEY';
            
            // 2. Prepare the request data
            const requestData = {
                text: messageText,
                file: file
            };
            
            // 3. Make the API request
            fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: messageText
                        }]
                    }]
                })
            })
            .then(response => response.json())
            .then(data => {
                // 4. Process the response
                const aiResponse = data.candidates[0].content.parts[0].text;
                addMessage(aiResponse, 'ai');
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('Sorry, I encountered an error processing your request.', 'ai');
            });
            */
      // =============================================

      // For now, we'll use a placeholder response
      let aiResponse = ""

      if (file) {
        aiResponse = `I've analyzed the file "${file.name}" and here are my findings:
                
                ✓ The content appears to be factually accurate based on my knowledge base.
                
                ✓ I've cross-referenced the key claims with reliable sources.
                
                ⚠️ There are a few statements that would benefit from additional context.
                
                Would you like me to provide a more detailed analysis of any specific part?`
      } else if (messageText) {
        aiResponse = `Based on my fact-checking of "${messageText}":
                
                ✓ This statement is generally accurate according to current information.
                
                ✓ The main claims are supported by reliable sources.
                
                ⚠️ Some nuance might be missing from the original statement.
                
                Would you like me to elaborate on any specific aspect?`
      }

      addMessage(aiResponse, "ai")
    }, 1500)
  }
})
