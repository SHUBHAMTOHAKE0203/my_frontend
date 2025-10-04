import React, { useState } from "react";
import axios from "axios";
import { Search, Play, GraduationCap, Sparkles, Youtube, ExternalLink } from "lucide-react";

const SkillTutorials = () => {
  const [skills, setSkills] = useState("");
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchYouTubeTutorials = async () => {
    if (!skills) return;
    setLoading(true);
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: `${skills} tutorial`,
            maxResults: 6,
            key: import.meta.env.VITE_YT_API_KEY, // 🔑 replace with your real API key
            type: "video"
          }
        }
      );

      setTutorials(response.data.items);
    } catch (err) {
      console.error("YouTube API Error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Skill-Based YouTube Tutorials
          </h2>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Master any skill with curated video tutorials
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                What would you like to learn?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your skills (e.g. React, Python, ML, Web Design)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-lg"
                />
              </div>
            </div>

            <button
              onClick={fetchYouTubeTutorials}
              className="group w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Youtube className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Search Tutorials
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-400">Finding the best tutorials for you...</p>
          </div>
        )}

        {/* Tutorials Grid */}
        {!loading && tutorials.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Play className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold">Recommended Tutorials</h3>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm">
                {tutorials.length} videos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((video) => (
                <a
                  key={video.id.videoId}
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  {/* Thumbnail Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                    {/* Duration Badge (if available) */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs font-semibold">
                      Video
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors leading-tight">
                      {video.snippet.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-gray-400 flex items-center gap-1">
                        <Youtube className="w-4 h-4 text-red-500" />
                        {video.snippet.channelTitle}
                      </p>
                      <ExternalLink className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && tutorials.length === 0 && skills && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Youtube className="w-10 h-10 text-purple-400" />
            </div>
            <p className="text-xl text-gray-400">No tutorials found. Try a different skill!</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && tutorials.length === 0 && !skills && (
          <div className="text-center py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              {['React', 'Python', 'Machine Learning', 'Web Design'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    setSkills(skill);
                    fetchYouTubeTutorials();
                  }}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all text-sm font-semibold"
                >
                  {skill}
                </button>
              ))}
            </div>
            <p className="text-gray-400">Search for any skill or try a popular topic above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTutorials;