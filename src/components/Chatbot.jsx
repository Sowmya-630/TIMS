import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function Chatbot() {
  const { state, dispatch } = useApp();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your TIMS AI assistant. I can help you with inventory management, product information, and supplier details. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputText('');
  };

  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('stock') || lowerInput.includes('inventory')) {
      return 'I can help you check stock levels. Currently, you have 45 Fiber Optic Routers, 150 CAT6 cables, and 12 5G Base Station modules in stock. Would you like details on any specific product?';
    }
    
    if (lowerInput.includes('supplier') || lowerInput.includes('vendor')) {
      return 'You have 5 suppliers in your system. TechCorp Solutions and FiberNet Corp are your most active suppliers. Would you like me to show you supplier contact details or performance metrics?';
    }
    
    if (lowerInput.includes('alert') || lowerInput.includes('notification')) {
      return 'You have 2 unread notifications: Network Switch 24-Port is running low on stock (8 units), and TechCorp Solutions updated their catalog. Should I mark these as read?';
    }
    
    if (lowerInput.includes('report') || lowerInput.includes('analytics')) {
      return 'I can generate various reports for you: stock levels, supplier performance, daily activities, or custom reports. Which type would you like to see?';
    }
    
    return 'I understand you\'re asking about inventory management. I can help with stock checking, supplier information, generating reports, and managing notifications. Could you be more specific about what you need help with?';
  };

  if (!state.isChatbotOpen) {
    return (
      <button
        onClick={() => dispatch({ type: 'TOGGLE_CHATBOT' })}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-40"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-white/80">Online</p>
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_CHATBOT' })}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-xs ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                )}
              </div>
              <div
                className={`px-3 py-2 rounded-xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
          />
          <button
            onClick={handleSendMessage}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}