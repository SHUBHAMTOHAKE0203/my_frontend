// src/components/OpenCommunity.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { MessageSquare, Send, Users, Sparkles, Clock, AlertCircle } from "lucide-react";

export default function OpenCommunity() {
  const [user, setUser] = useState(null);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);

  // Track authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({
          uid: u.uid,
          name: u.displayName || "Anonymous",
          email: u.email,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch posts from Firebase
  useEffect(() => {
    const postsRef = ref(db, "communityPosts");
    return onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedPosts = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          .sort((a, b) => b.timestamp - a.timestamp); // latest first
        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
    });
  }, []);

  const handlePost = async () => {
    if (!postText.trim()) return alert("Post cannot be empty!");
    if (!user) return alert("You must be logged in to post.");

    try {
      const postsRef = ref(db, "communityPosts");
      await push(postsRef, {
        username: user.name,
        uid: user.uid,
        content: postText,
        timestamp: Date.now(),
      });
      setPostText("");
    } catch (err) {
      console.error("Failed to post:", err);
      alert("Failed to post. Check console.");
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

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🌐 Open Community
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Share ideas, connect with peers, and grow together
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-sm text-gray-400">Total Posts</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold">{user ? "Online" : "Offline"}</p>
                <p className="text-sm text-gray-400">Your Status</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">Live</p>
                <p className="text-sm text-gray-400">Real-time Updates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Warning */}
        {!user && (
          <div className="mb-8 bg-gradient-to-r from-red-900/40 to-orange-900/40 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Login Required</h3>
              <p className="text-gray-300">You must be logged in to post in the community.</p>
            </div>
          </div>
        )}

        {/* Post Creation Section */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 shadow-2xl mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center font-bold text-lg">
              {user ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <h3 className="font-bold">{user ? user.name : "Guest"}</h3>
              <p className="text-sm text-gray-400">Share your thoughts...</p>
            </div>
          </div>

          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind? Share your ideas, questions, or insights..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            rows="4"
          />

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-400">
              {postText.length} characters
            </p>
            <button
              onClick={handlePost}
              disabled={!user}
              className={`group px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 ${
                user
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Post
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            Recent Posts
          </h2>
          <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-semibold">
            {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
          </span>
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-3xl border border-purple-500/20">
            <MessageSquare className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No posts yet</h3>
            <p className="text-gray-400">Be the first to share something with the community!</p>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((p) => (
            <div
              key={p.id}
              className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Post Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {p.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{p.username}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {new Date(p.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap ml-16">
                {p.content}
              </p>

              {/* Post Footer */}
              <div className="mt-4 ml-16 flex items-center gap-4 text-sm">
                <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}