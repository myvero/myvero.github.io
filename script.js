document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const fileUpload = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name');
    
    let selectedFile = null;
    
    // Handle file selection
    fileUpload.addEventListener('change', function(e) {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            fileNameDisplay.textContent = selectedFile.name;
        } else {
            fileNameDisplay.textContent = '';
        }
    });
    
    // Handle sending messages
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (!messageText && !selectedFile) return;
        
        // Add user message to chat
        if (messageText) {
            addMessage(messageText, 'user');
            messageInput.value = '';
        }
        
        // Handle file if selected
        if (selectedFile) {
            addFileMessage(selectedFile);
            fileNameDisplay.textContent = '';
            selectedFile = null;
            fileUpload.value = '';
        }
        
        // Process with AI
        processWithAI(messageText, selectedFile);
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = text;
        
        messageContent.appendChild(messageParagraph);
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function addFileMessage(file) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const fileInfo = document.createElement('p');
        fileInfo.textContent = `File uploaded: ${file.name}`;
        
        messageContent.appendChild(fileInfo);
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // =============================================
    // GEMINI AI INTEGRATION SECTION
    // =============================================
    
    function processWithAI(messageText, file) {
        // Show loading message
        addMessage('Processing your request...', 'ai');
        
        // Simulate AI processing delay
        setTimeout(() => {
            // Remove loading message
            messagesContainer.removeChild(messagesContainer.lastChild);
            
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
            let aiResponse = '';
            
            if (file) {
                aiResponse = `I've analyzed the file "${file.name}". This is a placeholder response. Replace this with actual Gemini AI fact-checking results.`;
            } else {
                aiResponse = `Based on my fact-checking: "${messageText}" - This is a placeholder response. Replace this with actual Gemini AI fact-checking results.`;
            }
            
            addMessage(aiResponse, 'ai');
        }, 1500);
    }
});
