import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { BsStars, BsSendFill } from 'react-icons/bs';
import { IoClose, IoChatbubbleEllipsesSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const AIChatAssistant = () => {
  const { backendUrl, currency } = useContext(ShopContext);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Namaste! 🙏 I am your Vashtralaya AI Fashion Assistant. What style or outfit can I help you find today?',
      products: []
    }
  ]);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [chatHistory, isOpen]);

  const quickPrompts = [
    "Festive outfit under ₹3000",
    "Winter jackets collection",
    "How do I choose my size?",
    "Show me bestsellers"
  ];

  const handleSendMessage = async (msgText) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setChatHistory((prev) => [...prev, userMsg]);
    if (!msgText) setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/ai/chat`, {
        message: textToSend
      });

      if (response.data.success) {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: response.data.reply,
            products: response.data.recommendedProducts || []
          }
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'ai', text: 'I am sorry, I could not process that request right now. Please try again!', products: [] }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: 'Connection issue. Please make sure the server is running.', products: [] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 bg-black text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 transition duration-300 group cursor-pointer border border-gray-800"
          title="Vashtralaya AI Stylist"
        >
          <BsStars className="text-xl text-amber-300 animate-spin-slow" />
          <span className="font-semibold text-xs tracking-wider uppercase hidden sm:inline">
            AI Fashion Assistant
          </span>
          {!isOpen && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          )}
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-300/40">
                <BsStars className="text-amber-300 text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  Vashtralaya AI Stylist
                  <span className="text-[10px] bg-amber-300 text-black px-1.5 py-0.5 rounded font-bold">
                    PRO
                  </span>
                </h3>
                <p className="text-[11px] text-gray-300">Intelligent Shopping & Outfit Advisor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition p-1"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-black text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-xs rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Product Recommendation Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 space-y-2 w-full">
                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                      ✨ Suggested Products:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.products.map((prod) => (
                        <Link
                          key={prod._id}
                          to={`/product/${prod._id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-200 hover:border-black transition group"
                        >
                          <img
                            src={Array.isArray(prod.image) ? prod.image[0] : prod.image}
                            alt={prod.name}
                            className="w-12 h-14 aspect-[3/4] object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate group-hover:text-black">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-gray-500 font-bold">
                              {currency}{prod.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                <BsStars className="animate-spin text-amber-500 text-sm" />
                <span>AI Stylist is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap text-[10px] bg-gray-100 hover:bg-black hover:text-white text-gray-700 px-2.5 py-1 rounded-full transition border font-medium cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask AI for style tips or products..."
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-full outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-black text-white p-2.5 rounded-full hover:bg-gray-800 transition disabled:opacity-40 cursor-pointer"
            >
              <BsSendFill className="text-xs" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
