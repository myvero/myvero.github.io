document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")
  const htmlElement = document.documentElement

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    htmlElement.className = savedTheme
  } else {
    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    htmlElement.className = prefersDark ? "dark" : "light"
  }

  // Theme toggle button functionality
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.className
      const newTheme = currentTheme === "light" ? "dark" : "light"

      htmlElement.className = newTheme
      localStorage.setItem("theme", newTheme)
    })
  }

  // Chat functionality
  const chatForm = document.getElementById("chat-form")
  const chatInput = document.getElementById("chat-input")
  const chatMessages = document.getElementById("chat-messages")
  const chatWelcome = document.getElementById("chat-welcome")
  const sendButton = document.getElementById("send-button")

  // Suggestion buttons
  const suggestionButtons = document.querySelectorAll(".suggestion-btn")

  if (suggestionButtons) {
    suggestionButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const suggestion = this.getAttribute("data-suggestion")
        if (chatInput) {
          chatInput.value = suggestion
          chatInput.focus()
        }
      })
    })
  }

  // Sample suggestions for quick testing
  const sampleQuestions = [
    "Is drinking alkaline water healthier than regular water?",
    "Did NASA spend millions developing a pen that works in space?",
    "Is it true that we only use 10% of our brains?",
    "Does vitamin C prevent colds?",
  ]

  // Gemini API integration
  async function queryGemini(userQuery) {
    try {
      const apiKey = "AIzaSyBvzJ174bqIUaDtJoyrXl0BGWJEO2vXeGI"
      const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"

      const prompt = `
      You are Vero, an AI fact-checking assistant. Your task is to verify the factual accuracy of the following claim or question:
      
      "${userQuery}"
      
      Analyze this claim and provide a verification response with the following structure:
      
      1. Verification Status: Choose one of the following:
         - "Verified" (if the claim is accurate and supported by evidence)
         - "Partially Verified" (if the claim contains some truth but requires important context or qualifications)
         - "Not Verified" (if the claim is inaccurate, misleading, or lacks sufficient evidence)
      
      2. Explanation: Provide a concise, evidence-based explanation of your verification (2-4 sentences).
      
      3. Sources: List 2-3 credible sources that support your verification. These should be specific publications, journals, or institutions.
      
      Format your response as a JSON object with the following structure:
      {
        "status": "Verification status here",
        "content": "Your explanation here",
        "sources": ["Source 1", "Source 2", "Source 3"]
      }
      
      Only return the JSON object, nothing else.
    `

      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Extract the text response from Gemini
      const textResponse = data.candidates[0].content.parts[0].text

      // Parse the JSON response
      try {
        // Find JSON object in the response (in case there's any extra text)
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No valid JSON found in response")
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        // Fallback response if JSON parsing fails
        return {
          status: "Not Verified",
          content:
            "I encountered an issue while processing this claim. Please try rephrasing your question or try again later.",
          sources: ["Unable to retrieve sources at this time"],
        }
      }
    } catch (error) {
      console.error("Error querying Gemini API:", error)
      return {
        status: "Error",
        content: "I encountered an error while fact-checking this claim. Please try again later.",
        sources: ["Error connecting to verification service"],
      }
    }
  }

  // Handle chat form submission
  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const message = chatInput.value.trim()
      if (!message) return

      // Disable input and button while processing
      chatInput.disabled = true
      sendButton.disabled = true

      // Hide welcome screen if visible
      if (chatWelcome && chatWelcome.style.display !== "none") {
        chatWelcome.style.display = "none"
      }

      // Add user message
      addMessage("user", message)

      // Clear input
      chatInput.value = ""

      // Simulate typing indicator
      const typingIndicator = document.createElement("div")
      typingIndicator.className = "chat-message ai"
      typingIndicator.innerHTML = `
      <div class="chat-bubble ai">
        <p>Verifying information...</p>
      </div>
    `
      chatMessages.appendChild(typingIndicator)

      // Scroll to bottom
      scrollToBottom()

      try {
        // Query Gemini API
        const response = await queryGemini(message)

        // Remove typing indicator
        chatMessages.removeChild(typingIndicator)

        // Add AI response
        addAIResponse(response.status, response.content, response.sources)

        // Scroll to bottom
        scrollToBottom()
      } catch (error) {
        console.error("Error processing request:", error)

        // Remove typing indicator
        chatMessages.removeChild(typingIndicator)

        // Add error message
        addAIResponse("Error", "I encountered an error while processing your request. Please try again later.", [
          "Error connecting to verification service",
        ])

        // Scroll to bottom
        scrollToBottom()
      } finally {
        // Re-enable input and button
        chatInput.disabled = false
        sendButton.disabled = false
        chatInput.focus()
      }
    })
  }

  // Function to add a message to the chat
  function addMessage(role, content) {
    const messageElement = document.createElement("div")
    messageElement.className = `chat-message ${role}`

    if (role === "user") {
      messageElement.innerHTML = `
      <div class="chat-bubble user">
        <p>${escapeHTML(content)}</p>
      </div>
    `
    } else {
      messageElement.innerHTML = `
      <div class="chat-bubble ai">
        <p>${escapeHTML(content)}</p>
      </div>
    `
    }

    chatMessages.appendChild(messageElement)
    scrollToBottom()
  }

  // Function to add an AI response with verification status
  function addAIResponse(status, content, sources) {
    const messageElement = document.createElement("div")
    messageElement.className = "chat-message ai"

    let statusIcon = ""
    let statusColor = ""

    if (status === "Verified") {
      statusIcon = "lucide-check"
      statusColor = "var(--primary)"
    } else if (status === "Partially Verified") {
      statusIcon = "lucide-alert-circle"
      statusColor = "var(--primary)"
    } else if (status === "Error") {
      statusIcon = "lucide-alert-triangle"
      statusColor = "#f43f5e" // Red color for errors
    } else {
      statusIcon = "lucide-x"
      statusColor = "var(--primary)"
    }

    messageElement.innerHTML = `
    <div class="chat-bubble ai">
      <div class="chat-verification">
        <div class="chat-verification-badge">
          <i class="${statusIcon}" style="color: ${statusColor};" aria-hidden="true"></i>
          <span>${status}</span>
        </div>
        <p>${escapeHTML(content)}</p>
      </div>
      <div class="chat-sources">
        <div class="chat-sources-title">Sources:</div>
        <ul class="chat-sources-list">
          ${sources
            .map(
              (source) => `
            <li class="chat-sources-item">
              <i class="lucide-external-link" aria-hidden="true"></i>
              ${escapeHTML(source)}
            </li>
          \`  aria-hidden="true"></i>
              ${escapeHTML(source)}
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
    </div>
  `

    chatMessages.appendChild(messageElement)
  }

  // Helper function to escape HTML
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  // Function to scroll chat to bottom
  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }

  // Handle info button tooltip
  const infoButton = document.getElementById("info-button")
  if (infoButton) {
    infoButton.addEventListener("mouseenter", function () {
      const tooltip = this.querySelector(".tooltip-text")
      if (tooltip) {
        tooltip.style.visibility = "visible"
        tooltip.style.opacity = "1"
      }
    })

    infoButton.addEventListener("mouseleave", function () {
      const tooltip = this.querySelector(".tooltip-text")
      if (tooltip) {
        tooltip.style.visibility = "hidden"
        tooltip.style.opacity = "0"
      }
    })
  }
})
