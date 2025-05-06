import { useState, useRef, useEffect } from 'react'
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const CHAT_MESSAGES_KEY = 'chatMessages';
const CONVERSATION_ID_KEY = 'difyConversationId';

const ChatAI = () => {
  const { userProfile } = useAuth()
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem(CHAT_MESSAGES_KEY);
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        console.error("Error parsing saved messages from session storage", e);
        // Fallback to the initial greeting if parsing fails or no messages
      }
    }
    return [
      {
        id: 'initial-ai-greeting',
        content: "Hello! I'm LawLink's AI assistant, now powered by Dify. How can I help you today?",
        sender: 'ai'
      }
    ];
  });
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(() => sessionStorage.getItem(CONVERSATION_ID_KEY) || null);
  
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (messages && messages.length > 0) { 
        try {
            sessionStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
        } catch (e) {
            console.error("Error saving messages to session storage", e);
        }
    } else if (messages && messages.length === 0) { // If messages array becomes empty, clear storage
        sessionStorage.removeItem(CHAT_MESSAGES_KEY);
    }
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      sessionStorage.setItem(CONVERSATION_ID_KEY, conversationId);
    } else {
      sessionStorage.removeItem(CONVERSATION_ID_KEY);
    }
  }, [conversationId]);
  
  const handleSend = async (e) => {
    e.preventDefault()
    
    if (!input.trim()) return; 

    const userMessage = {
      id: Date.now().toString(), 
      content: input,
      sender: 'user'
    }
    
    // Update messages immediately, then handle API call
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const DIFY_API_KEY = 'app-nl0rffPEWU2pO4kDvuHMRS7p'; 
    const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

    // AI placeholder message ID, generated before API call
    const currentAiMessageId = Date.now().toString() + '-ai';
    // Add AI placeholder immediately after user message
    setMessages(prev => [...prev, { id: currentAiMessageId, content: '...', sender: 'ai' }]);

    try {
      const response = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {}, 
          query: currentInput,
          user: userProfile?.id || 'anonymous-user', 
          response_mode: 'streaming', 
          conversation_id: conversationId || undefined 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Dify API Error: ${response.status} ${errorData.message || ''}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponseContent = '';
        
        // Update existing placeholder instead of adding a new message
        const updateAIMessageContent = (content) => {
            setMessages(prev => prev.map(msg => 
                msg.id === currentAiMessageId ? { ...msg, content } : msg
            ));
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(line.substring(5));
                if (jsonData.answer) {
                  aiResponseContent += jsonData.answer;
                  updateAIMessageContent(aiResponseContent);
                }
                if (jsonData.conversation_id) {
                  setConversationId(jsonData.conversation_id);
                }
              } catch (parseError) {
                // console.error('Error parsing Dify stream data:', parseError, "Line:", line);
              }
            }
          }
        }
        if (aiResponseContent === '') { 
            updateAIMessageContent("Sorry, I received an empty response.");
        }
      } else {
         throw new Error('Response body is null');
      }

    } catch (error) {
      console.error('Error calling Dify API:', error);
      const errorMessageContent = `Sorry, I couldn't connect to the AI assistant. ${error.message}`;
      setMessages(prev => prev.map(msg => 
          msg.id === currentAiMessageId ? { ...msg, content: errorMessageContent } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-16 bg-neutral-50 dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md overflow-hidden h-[70vh] flex flex-col">
            <div className="bg-primary-500 text-white py-4 px-6">
              <h1 className="text-xl font-bold">LawLink AI Assistant</h1>
              <p className="text-sm text-white/80">
                Get quick answers to your legal questions<br />
                Powered by Dify
              </p>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-white'
                    }`}
                  >
                    <div className="flex items-start">
                      {message.sender === 'ai' && (
                        <div className="mr-2 mt-1 bg-white dark:bg-neutral-600 p-1 rounded-full">
                          <FiMessageSquare className="w-4 h-4 text-primary-500 dark:text-white" />
                        </div>
                      )}
                      <div>
                        {message.content}
                      </div>
                      {message.sender === 'user' && (
                        <div className="ml-2 mt-1 bg-white dark:bg-neutral-600 p-1 rounded-full">
                          <FiUser className="w-4 h-4 text-primary-500 dark:text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg px-4 py-3 text-neutral-800 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
              <form onSubmit={handleSend} className="flex items-center space-x-2">
                <input 
                  type="text" 
                  className="flex-grow px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:text-white"
                  placeholder="Type your legal question..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || !userProfile?.id} 
                />
                <button 
                  type="submit" 
                  className="bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !userProfile?.id} 
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </form>
              {!userProfile?.id && (
                <p className="mt-2 text-sm text-error-500 text-center">
                  Please sign in to use the chat feature
                </p>
              )}
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Note: This AI assistant provides general information only. For legal advice, please consult with a qualified lawyer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatAI