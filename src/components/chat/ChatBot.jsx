import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatBot } from '@/hooks/useChatBot';
import { chatBotService } from '@/services/chatBotService';
import { geminiService } from '@/services/geminiService';

const ChatBot = () => {
  const {
    isOpen,
    isMinimized,
    messages,
    isTyping,
    toggleChat,
    toggleMinimize,
    addMessage,
    setTyping
  } = useChatBot();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputValue('');
    setTyping(true);

    try {
      // Prepare conversation history for OpenAI
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Check if we need to wait due to rate limiting
      const now = Date.now();
      const timeSinceLastRequest = now - chatBotService.lastRequestTime;
      if (timeSinceLastRequest < chatBotService.minRequestInterval) {
        const waitTime = chatBotService.minRequestInterval - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      // Check if request is already in progress
      if (chatBotService.isRequestInProgress) {
        const fallbackResponse = chatBotService.getFallbackResponse(inputValue);
        const botMessage = {
          id: Date.now() + 1,
          text: fallbackResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        addMessage(botMessage);
        return;
      }

      // Get bot response using service (now async)
      const botResponse = await chatBotService.getResponse(inputValue, conversationHistory);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      addMessage(botMessage);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "ขออภัยค่ะ เกิดข้อผิดพลาดในการตอบกลับ 😅 ลองถามใหม่ได้ไหมคะ?",
        sender: 'bot',
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setTyping(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-6 to-purple-7 hover:from-purple-7 hover:to-purple-8 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 group"
          >
            <Bot className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-5 rounded-full animate-pulse border-2 border-white"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-6 right-6 bg-white rounded-3xl shadow-2xl border border-gray-2 z-50 ${
              isMinimized ? 'w-80 h-16' : 'w-[420px] h-[600px]'
            } transition-all duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-2 bg-gradient-to-r from-purple-6 to-purple-7 text-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/kafra/kafra avatar Medium.png" 
                    alt="Kafra" 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <Bot className="w-5 h-5" style={{ display: 'none' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Kafra</h3>
                  <p className="text-xs text-purple-1">
                    {geminiService.isConfigured() ? 'Gemini AI 🤖' : 'Online'}
                    {chatBotService.isRequestInProgress && ' • Processing...'}
                    {chatBotService.getErrorStatus().isOpenAIDisabled && ' • Fallback Mode'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {chatBotService.getErrorStatus().isOpenAIDisabled && (
                  <button
                    onClick={() => chatBotService.resetErrorCount()}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Reset AI Connection"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={toggleMinimize}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 h-[450px]">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-9 h-9 flex items-center justify-center overflow-hidden ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-purple-6 to-purple-7 text-white' 
                            : 'bg-gray-2 text-gray-7'
                        }`} style={{ 
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          minWidth: '36px',
                          minHeight: '36px'
                        }}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <>
                              <img 
                                src="/images/kafra/kafra avatar Medium.png" 
                                alt="Kafra" 
                                style={{ 
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                  display: 'block'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <Bot className="w-4 h-4" style={{ display: 'none' }} />
                            </>
                          )}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-6 to-purple-7 text-white rounded-br-md'
                            : 'bg-gray-1 text-gray-8 rounded-bl-md'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-purple-1' : 'text-gray-5'
                          }`}>
                            {message.timestamp.toLocaleTimeString('th-TH', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-gray-2 text-gray-7 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-1 text-gray-8 px-4 py-2 rounded-2xl rounded-bl-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-5 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-5 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-5 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-2 bg-gray-1">
                  <div className="flex items-center gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="พิมพ์ข้อความ..."
                      className="flex-1 px-4 py-3 border border-gray-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-5 focus:border-transparent text-sm bg-white shadow-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="p-3 bg-gradient-to-r from-purple-6 to-purple-7 hover:from-purple-7 hover:to-purple-8 disabled:from-gray-3 disabled:to-gray-4 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
