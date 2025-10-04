import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles, Quote, Heart, Zap } from "lucide-react";

const quotes = [
  "Success is not final; failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "It always seems impossible until it's done. – Nelson Mandela",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Push yourself, because no one else is going to do it for you.",
  "Dream it. Wish it. Do it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Great things never come from comfort zones.",
  "Wake up with determination. Go to bed with satisfaction."
];

const MotivationQuotes = () => {
  const [index, setIndex] = useState(0);

  const handleNextQuote = () => {
    setIndex((prev) => (prev + 1) % quotes.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextQuote();
    }, 5000); // auto switch every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating Icons */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-purple-400" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-32"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          <Heart className="w-8 h-8 text-pink-400" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-20"
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
        >
          <Zap className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mb-6 shadow-2xl shadow-purple-500/50"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Quote className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Daily Motivation
          </h1>
          <p className="text-gray-400 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Fuel your journey with inspiring words
          </p>
        </div>

        {/* Quote Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-500/30 shadow-2xl mb-8">
          <div className="relative">
            {/* Opening Quote Mark */}
            <Quote className="absolute -top-6 -left-4 w-16 h-16 text-purple-500/30" />
            
            {/* Quote Text */}
            <div className="min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-relaxed drop-shadow-lg text-center relative z-10 px-8"
                >
                  {quotes[index]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Closing Quote Mark */}
            <Quote className="absolute -bottom-6 -right-4 w-16 h-16 text-cyan-500/30 rotate-180" />
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {quotes.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === index ? 'w-12 bg-gradient-to-r from-purple-500 to-cyan-500' : 'w-1.5 bg-white/20'
                }`}
                animate={idx === index ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleNextQuote}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Next Quote
          </button>

          <button
            onClick={() => setIndex(Math.floor(Math.random() * quotes.length))}
            className="group px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Random
          </button>
        </div>

        {/* Quote Counter */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Quote <span className="text-purple-400 font-bold">{index + 1}</span> of <span className="text-cyan-400 font-bold">{quotes.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationQuotes;