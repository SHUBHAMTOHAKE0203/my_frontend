import React, { useState, useEffect } from "react";
import axios from "axios";
import { ref, get } from "firebase/database";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const CareerSuggestions = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snapshot = await get(ref(db, "users/" + user.uid));
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        } else {
          alert("User profile not found in DB!");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGetSuggestions = async () => {
    if (!userProfile) return;
    setLoading(true);

    const prompt = `
You are an AI career advisor. Suggest 3–5 career paths for the user below.
User Profile:
Skills: ${userProfile.skills.join(", ")}
Interests: ${userProfile.interests.join(", ")}
Education: ${userProfile.education.status} in ${userProfile.education.degree}, year: ${userProfile.education.year}

Respond in JSON format:
[
  {
    "career": "Career Name",
    "description": "Brief description",
    "roadmap": ["Step 1", "Step 2", ...],
    "skillsToLearn": ["Skill1", "Skill2", ...],
    "tools": ["Tool1", "Tool2", ...]
  }
]
`;

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4.1-mini",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const raw = res.data.choices[0].message.content;
      const parsed = JSON.parse(raw);
      setResults(parsed);
    } catch (err) {
      console.error("AI Suggestion Error:", err);
      alert("Error generating AI suggestions");
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-300 text-xl">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Career Suggestions
          </h1>
          <p className="text-gray-400 text-lg">Personalized career paths based on your profile</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-400 mb-1">Name</p>
              <p className="text-white text-xl font-semibold">{userProfile.name}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Education</p>
              <p className="text-white text-xl font-semibold">
                {userProfile.education.status} in {userProfile.education.degree} ({userProfile.education.year})
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-cyan-300 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-400 mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest, idx) => (
                <span key={idx} className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-purple-300 font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGetSuggestions} 
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating...
              </span>
            ) : "Get Career Suggestions"}
          </button>
        </div>

        <div className="space-y-6">
          {results.map((career, idx) => (
            <div key={idx} className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/50 shadow-2xl p-8 hover:scale-105 transition-all relative overflow-hidden">
              <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {career.career}
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">{career.description}</p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">🗺️</span> Roadmap
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-gray-300">
                    {career.roadmap.map((step, i) => (
                      <React.Fragment key={i}>
                        <span className="px-3 py-1 bg-white/5 rounded-lg">{step}</span>
                        {i < career.roadmap.length - 1 && <span className="text-cyan-400">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">📚</span> Skills to Learn
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {career.skillsToLearn.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">🛠️</span> Tools
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {career.tools.map((tool, i) => (
                      <span key={i} className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerSuggestions;