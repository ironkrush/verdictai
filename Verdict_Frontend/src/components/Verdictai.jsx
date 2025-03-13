// New Code
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

export default function VerdictAI() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [orbs, setOrbs] = useState([]);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);


  const searchOptions = ["GRS", "Drafting", "Legal Query"];
  const [searchTextIndex, setSearchTextIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    // Get stored email from localStorage when component mounts
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const newOrbs = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 150 + 50,
      speed: Math.random() * 20 + 10,
      color: getRandomBlueColor(),
    }));
    setOrbs(newOrbs);

    if (window.innerWidth > 768 && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 1000);
    }
  }, []);

  useEffect(() => {
    const animationId = requestAnimationFrame(() => {
      setOrbs((prevOrbs) =>
        prevOrbs.map((orb) => ({
          ...orb,
          x: (orb.x + Math.sin(orb.speed / 100)) % 100,
          y: (orb.y + Math.cos(orb.speed / 100)) % 100,
        }))
      );
    });
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSearchTextIndex((prevIndex) => (prevIndex + 1) % searchOptions.length);
    }, 4000); // Slowed down animation
    return () => clearInterval(interval);
  }, []);

  const getRandomBlueColor = () => {
    const hue = 200 + Math.floor(Math.random() * 40);
    const saturation = 70 + Math.floor(Math.random() * 30);
    const lightness = 50 + Math.floor(Math.random() * 20);
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setMessages((prev) => [...prev, { type: "user", content: input }]);
    setIsProcessing(true);
    setShowPlaceholder(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const { response: aiResponse, category, confidence } = data || {}; // Ensuring data exists

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: aiResponse || "No response received.",
          category: category || "unknown",
          confidence: confidence || 0,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          category: "error",
        },
      ]);
    } finally {
      setIsProcessing(false);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "user@example.com";
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
    setUserEmail("");

    toast.success("Logged out successfully!", { position: "top-right" });

    // Force a UI re-render by updating state
    window.dispatchEvent(new Event("storage"));

    // Optionally, reload the page to fully reset the UI
    window.location.reload();
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent("Anagh Patel")}&background=0D8ABC&color=ffffff&size=200`;

  const token = localStorage.getItem("token");

  if (!token) return null; // Only render if token exists

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: orb.color,
              transition: "left 4s ease-in-out, top 4s ease-in-out",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex h-screen flex-col">
        <header className="flex items-center justify-between p-16">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-2xl font-medium tracking-wider text-blue-300">Verdict.ai</span>
          </div>
          <div className="relative">
            {/* Profile Icon */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="h-12 w-12 rounded-full border border-gray-300 overflow-hidden shadow-lg cursor-pointer"
            >
              <img src={avatarUrl} alt="User Avatar" className="h-full w-full object-cover" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-black text-white shadow-lg rounded-lg border border-gray-700">
                {/* User Email */}
                <div className="px-4 py-2 text-sm border-b border-gray-700 text-silver">
                  {userEmail}
                </div>
                {/* Logout Button */}
                <button
                  className="w-full px-4 py-2 text-left text-silver hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="rounded-full bg-gray-900/50 p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 flex flex-col justify-end overflow-hidden px-4 pb-24 pt-10">
          <div className="space-y-6 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-800/70 text-gray-100"}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex space-x-2 rounded-2xl bg-gray-800/70 px-5 py-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent pb-8 pt-20">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-end space-x-2 px-4">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-900 text-white p-4 rounded-2xl"
              placeholder="Type your query..."
            />
            <button type="submit" className="h-14 w-14 bg-blue-600 rounded-full text-white flex justify-center items-center">
              <ArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
