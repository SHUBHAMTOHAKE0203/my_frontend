import React, { useState } from "react";
import axios from "axios";
import { BookOpen, Sparkles, Search, Star, ExternalLink } from "lucide-react";

const BookRecommender = () => {
  const [interests, setInterests] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  const handleRecommend = async () => {
    if (!interests.trim()) {
      alert("Please enter your interests!");
      return;
    }

    setLoading(true);
    setRecommendations([]);

    const prompt = `
You are a friendly AI librarian. Suggest 5 books that match the user's interests.
For each book, include:
- "title"
- "author"
- "summary" (2-3 lines)
- "why_recommended" (1 line)

User interests: ${interests}

Respond ONLY as a JSON array like this:
[
  {
    "title": "Book Name",
    "author": "Author Name",
    "summary": "Brief summary...",
    "why_recommended": "Why it fits user's interests"
  }
]
`;

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = res.data.choices?.[0]?.message?.content || "[]";
      const parsed = JSON.parse(aiResponse);
      setRecommendations(parsed);
    } catch (err) {
      console.error(err);
      alert("Error getting book suggestions. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Book Recommender
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Discover your next favorite book with AI-powered suggestions
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl mb-8">
          <label className="block text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-400" />
            Enter your interests or goals:
          </label>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none mb-6"
            rows={5}
            placeholder="e.g., personal growth, AI, leadership, fiction, science fiction, mystery, self-help, business strategy..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />

          <button
            onClick={handleRecommend}
            disabled={loading}
            className="group w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Fetching recommendations...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Get AI Book Suggestions
              </>
            )}
          </button>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-purple-400" />
                Recommended Books
              </h2>
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-semibold">
                {recommendations.length} Books
              </span>
            </div>

            <div className="space-y-6">
              {recommendations.map((book, idx) => (
                <div
                  key={idx}
                  className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                >
                  <div className="p-6">
                    {/* Book Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-xl">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-purple-300 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-gray-400 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          by {book.author}
                        </p>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-sm font-semibold text-purple-400 mb-2">Summary:</p>
                      <p className="text-gray-300 leading-relaxed">{book.summary}</p>
                    </div>

                    {/* Why Recommended */}
                    <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20">
                      <p className="text-sm font-semibold text-cyan-400 mb-2">Why this book:</p>
                      <p className="text-gray-300 leading-relaxed">{book.why_recommended}</p>
                    </div>

                    {/* Search Button */}
                    <div className="mt-4">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author + ' book')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                      >
                        <Search className="w-4 h-4" />
                        Find This Book
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Gradient Border Effect on Hover */}
                  <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        {!recommendations.length && !loading && (
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Tips for better recommendations:
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Be specific about your interests (e.g., "startup entrepreneurship" vs "business")</li>
              <li>• Mention genres you enjoy (fiction, non-fiction, sci-fi, fantasy, etc.)</li>
              <li>• Include your goals (learning, entertainment, personal development)</li>
              <li>• Try different combinations to discover new books</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRecommender;