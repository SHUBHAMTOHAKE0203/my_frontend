// CareerPathSimulator.jsx
import React, { useState } from "react";
import axios from "axios";

export default function CareerPathSimulator() {
  const [skills, setSkills] = useState("");
  const [dreamRole, setDreamRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const generateCareerPath = async () => {
    if (!skills || !dreamRole) {
      alert("Please enter skills and dream role");
      return;
    }

    setLoading(true);
    setResult("");

    const prompt = `
You are an expert career coach AI.

User Skills: ${skills}
Target Role: ${dreamRole}

Generate a structured, friendly, and visually appealing career roadmap.
Include:
- missing_skills: skills the user should learn
- roadmap: months to learn each skill
- tools: tools to master
- certifications: relevant certifications
- estimated_salary: salary range

Format it in readable paragraphs with bullet points.
`;

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const content = response.data.choices[0].message.content;
      setResult(content);
    } catch (err) {
      console.error(err);
      alert("Failed to generate career path. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🚀 AI Career Path Simulator
          </h2>
          <p className="text-gray-400 text-lg">Map your journey from current skills to dream role</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Your Current Skills</label>
              <input
                placeholder="e.g., JavaScript, React, Python (comma separated)"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Dream Role</label>
              <input
                placeholder="e.g., Full Stack Developer, Data Scientist"
                value={dreamRole}
                onChange={e => setDreamRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              onClick={generateCareerPath}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </span>
              ) : "Generate Career Path"}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500"></div>
            
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Your Personalized Career Roadmap
            </h3>
            
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}