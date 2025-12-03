import React, { useState, useRef, useEffect } from "react";
import ChatBotHome from "./ChatBotHome";

// Import the GoogleGenerativeAI module from the SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API key and the generative AI instance
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI("AIzaSyC4v7-Bj1mV1vtORfr8u41uGyxC0GKb0rU");

// Get the generative model instance
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Define the generation configuration
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

function ChatBot() {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (message, sender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender },
    ]);
  };

  // Updated handleAiresponse function using the GoogleGenerativeAI SDK
  const handleAiresponse = async (x) => {
    setIsThinking(true); // Show "thinking" animation

    try {
      // Start a new chat session using the model and generation config
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      // Build a user prompt with clear instructions
      const userPrompt = `You are Chef Cosmo, an AI chef who generates high-quality recipes.
You can take various ingredients from the user and create a recipe based on them.
Additionally, if the user provides the name of a recipe, you should generate a complete recipe along with calorie information.
Please note: ONLY respond to recipe-related queries, and present the response in proper paragraph form using <br> tags.

User Question: ${x}`;

      // Send the message to the chat session
      const result = await chatSession.sendMessage(userPrompt);
      const responseText = result.response.text();

      setIsThinking(false); // Hide "thinking" animation
      return responseText;
    } catch (error) {
      console.error("Error:", error);
      setIsThinking(false);
      return "There was an error fetching data.";
    }
  };

  async function handleClick() {
    if (!userMessage.trim()) return;

    const element = document.getElementById("homeInfo");
    if (element) element.style.display = "none";

    if (textAreaRef.current) textAreaRef.current.innerText = "";

    const userEnteredText = userMessage; // Store the user-entered text before clearing the state
    addMessage(userEnteredText, "You");
    setUserMessage("");

    // Call the AI response function
    const gptResponse = await handleAiresponse(userEnteredText);

    // Add the AI response to the messages state
    addMessage(gptResponse, "Chef Cosmo");
  }

  function handleChange(e) {
    // Replace line breaks (\n) with <br> tags before updating userMessage state
    const newText = e.target.innerText.replace(/\n/g, "<br>");
    setUserMessage(newText);
  }

  // Handle Enter key for submission
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div id="homeInfo" className="flex justify-center items-center h-screen">
        <div className="flex justify-center items-center w-full px-4 sm:px-0 sm:w-5/6 md:w-4/6 lg:w-3/6">
          <ChatBotHome />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 sm:pb-28">
        <div className="chat-window w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 sm:mb-6 flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] sm:max-w-[80%] ${message.sender === "You" ? "order-2" : "order-1"}`}>
                  <div className={`text-xs sm:text-sm font-semibold mb-1 ${message.sender === "You" ? "text-right" : "text-left"}`}>
                    {message.sender === "You" ? "You" : (
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-600 flex items-center justify-center text-white mr-2">
                          <span className="text-xs">👨‍🍳</span>
                        </div>
                        Chef Cosmo
                      </div>
                    )}
                  </div>
                  <div 
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                      message.sender === "You" 
                        ? "bg-green-600 text-white" 
                        : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                    }`}
                  >
                    <div 
                      className="whitespace-pre-wrap text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm sm:text-base px-4 text-center">
              Send a message to start chatting with Chef Cosmo
            </div>
          )}
          
          {isThinking && (
            <div className="flex justify-start mb-4 sm:mb-6">
              <div className="max-w-[85%] sm:max-w-[80%]">
                <div className="text-xs sm:text-sm font-semibold mb-1">
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-600 flex items-center justify-center text-white mr-2">
                      <span className="text-xs">👨‍🍳</span>
                    </div>
                    Chef Cosmo
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto px-3 sm:px-4">
          <div className="flex items-center bg-white rounded-full shadow-lg pr-1 sm:pr-2">
            <div
              ref={textAreaRef}
              id="textArea"
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 outline-none max-h-16 sm:max-h-20 overflow-y-auto text-sm sm:text-base"
              contentEditable={true}
              placeholder="Ask Chef Cosmo about any recipe..."
              onInput={handleChange}
              onKeyDown={handleKeyDown}
              data-placeholder="Ask Chef Cosmo about any recipe..."
              style={{
                minHeight: "40px",
              }}
            ></div>
            <button
              onClick={handleClick}
              disabled={isThinking || !userMessage.trim()}
              className={`p-2 rounded-full ${
                isThinking || !userMessage.trim() 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-green-600 text-white hover:bg-green-700"
              } transition-colors ml-1 sm:ml-2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <div className="text-center text-gray-400 text-xs mt-1 sm:mt-2">
            <p>AI can make mistakes. Consider checking important information</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        #textArea:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
}

export default ChatBot;