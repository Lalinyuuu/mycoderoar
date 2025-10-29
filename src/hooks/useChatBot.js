import { useState, useCallback } from 'react';

export const useChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "สวัสดีค่ะ! 😊 ยินดีต้อนรับสู่ MyCodeRoar! Kafra พร้อมช่วยเหลือคุณแล้วค่ะ มีอะไรให้ช่วยไหมคะ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const setTyping = useCallback((typing) => {
    setIsTyping(typing);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "สวัสดีค่ะ! 😊 ยินดีต้อนรับสู่ MyCodeRoar! Kafra พร้อมช่วยเหลือคุณแล้วค่ะ มีอะไรให้ช่วยไหมคะ?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, []);

  return {
    isOpen,
    isMinimized,
    messages,
    isTyping,
    toggleChat,
    toggleMinimize,
    addMessage,
    setTyping,
    clearMessages
  };
};
