import React, { useState } from "react";
import axios from "axios";
import { Calendar, Clock, Sparkles, Zap, Download, Copy } from "lucide-react";

const Scheduler = () => {
  const [tasks, setTasks] = useState("");
  const [timetable, setTimetable] = useState("");
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("8:00 AM");
  const [endTime, setEndTime] = useState("10:00 PM");

  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY; // put in .env

  const handleGenerate = async () => {
    if (!tasks.trim()) {
      alert("Please enter your tasks!");
      return;
    }

    setLoading(true);
    setTimetable("");

    const prompt = `
You are a professional productivity planner.
Create a well-structured daily timetable based on these tasks:

Tasks:
${tasks}

Preferred start time: ${startTime}
Preferred end time: ${endTime}

Give the output as a neat readable text schedule like:
08:00 AM - 09:00 AM: Task name
09:00 AM - 10:00 AM: Task name
... etc.

Ensure balance between productivity and rest.
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

      const aiText = res.data.choices?.[0]?.message?.content || "No response.";
      setTimetable(aiText);
    } catch (err) {
      console.error(err);
      alert("Error generating timetable");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(timetable);
    alert("Timetable copied to clipboard!");
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
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Daily Timetable Scheduler
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Let AI organize your day for maximum productivity
          </p>
        </div>

        {/* Main Input Section */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl mb-8">
          {/* Tasks Input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Your Tasks (comma or line separated):
            </label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              rows={6}
              placeholder="e.g., Study React, Exercise, Read book, College assignments, Team meeting, Prepare presentation"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>

          {/* Time Inputs */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                Start Time
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g., 8:00 AM"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                End Time
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g., 10:00 PM"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="group w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Your Perfect Schedule...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Generate Timetable
              </>
            )}
          </button>
        </div>

        {/* Timetable Output */}
        {timetable && (
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" />
                Your AI Timetable
              </h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group"
              >
                <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Copy
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-200">
                {timetable}
              </pre>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  const blob = new Blob([timetable], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'my-timetable.txt';
                  a.click();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download as Text
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Regenerate
              </button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {!timetable && !loading && (
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Pro Tips:
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Be specific with your tasks (e.g., "Study React Hooks" instead of just "Study")</li>
              <li>• Include breaks and meals for a balanced schedule</li>
              <li>• Set realistic time windows based on your energy levels</li>
              <li>• AI will optimize task order for maximum productivity</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scheduler;