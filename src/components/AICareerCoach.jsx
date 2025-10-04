// src/components/CareerCoach.jsx
import React, { useState } from "react";
import axios from "axios";

const CareerCoach = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI Career Coach. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  // Put your OpenRouter API key here
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    
    try {
      // Updated prompt injected for AI guidance
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            ...messages,
            {
              role: "user",
              content: `
You are an expert career coach with 10+ years of experience. 
Analyze the user's query and provide **actionable, step-by-step career guidance**. 
also answer in short not in paragrphs and if needed then ans the question stepwise,
Focus on practical advice, skills to learn, small projects, and next steps. 
Be concise, structured, and mentor-like in tone. 
Avoid long generic paragraphs. Give answers in bullet points or numbered steps if possible.
User said: "${input}"
              `
            }
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botReply = response.data.choices[0].message;
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong." }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 relative overflow-hidden flex items-center justify-center">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-purple-500/30 h-[700px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 p-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">AI Career Coach</h3>
              <p className="text-sm text-white/80">Get personalized career guidance</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-slate-950/50 to-purple-950/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-none shadow-lg"
                      : "bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl text-gray-200 rounded-bl-none border border-purple-500/30"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl border-t border-purple-500/30">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Ask me about careers, skills, or guidance..."
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCoach;