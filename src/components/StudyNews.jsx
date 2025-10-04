import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Newspaper, Clock, ExternalLink, Sparkles, TrendingUp } from "lucide-react";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY; 

export default function StudyNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("education");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(
        `https://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
      );
      setNews(resp.data.articles);
    } catch (err) {
      console.error("Failed to fetch news:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
            <Newspaper className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Study / Education News
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Stay updated with the latest education trends
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Search topic... (e.g., AI, technology, science)"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <button
              onClick={fetchNews}
              className="group px-8 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-400">Loading news...</p>
          </div>
        )}

        {/* No Results */}
        {news.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-purple-400" />
            </div>
            <p className="text-xl text-gray-400">No news found. Try a different topic!</p>
          </div>
        )}

        {/* News Grid */}
        <div className="grid gap-6">
          {news.map((article, i) => (
            <div
              key={i}
              className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                {/* Image */}
                {article.urlToImage && (
                  <div className="sm:w-64 h-48 sm:h-auto overflow-hidden">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Newspaper className="w-4 h-4" />
                      <span className="font-semibold">{article.source.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(article.publishedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>

                  {/* Read More Link */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors group/link"
                  >
                    Read full article
                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}