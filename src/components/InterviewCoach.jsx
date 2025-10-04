// InterviewCoach.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Mic, MicOff, Play, RotateCcw, Sparkles, Trophy, Target, TrendingUp, AlertCircle, Volume2, CheckCircle, XCircle } from "lucide-react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;
const synth = window.speechSynthesis || null;

const safeSpeak = (text, callback) => {
  if (!synth) return callback?.();
  const ut = new SpeechSynthesisUtterance(text);
  ut.rate = 1;
  ut.pitch = 1;
  ut.onend = () => callback?.();
  synth.cancel();
  synth.speak(ut);
};

export default function InterviewCoach() {
  const [skill, setSkill] = useState("React");
  const [level, setLevel] = useState("junior");
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [state, setState] = useState("idle"); // idle | asking | listening | evaluating | finished
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
const API = import.meta.env.VITE_API_URL;
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }
    const r = new SpeechRecognition();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;

    r.onresult = (event) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setTranscript(text);
    };

    r.onerror = (e) => console.error("Speech recognition error:", e);
    r.onend = () => {
      if (state === "listening") {
        if (transcript.trim() === "") {
          alert("Didn't catch your answer. Please speak clearly.");
          askQuestion(qIndex); // repeat question
        } else {
          setState("evaluating");
        }
      }
    };

    recognitionRef.current = r;
  }, [state, qIndex, transcript]);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const resp = await axios.post(`${API}/api/generate-questions`, {
        skill,
        level,
        count: 8,
      });
      setQuestions(resp.data.questions || []);
      setQIndex(0);
      setResults([]);
    } catch (err) {
      console.error("Failed to fetch questions:", err.response?.data || err.message);
      alert("Failed to fetch questions. Check console.");
    }
    setLoadingQuestions(false);
  };

  const startInterview = async () => {
    if (!questions.length) await fetchQuestions();
    setState("asking");
    setTranscript("");
    askQuestion(0);
  };

  const askQuestion = (index) => {
    if (!questions[index]) {
      setState("finished");
      safeSpeak("Interview complete. Good job!");
      return;
    }
    setQIndex(index);
    setTranscript("");
    setState("asking");

    safeSpeak(questions[index], () => {
      // Start listening after speaking
      setState("listening");
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn("Recognition start error:", err.message);
        setState("evaluating");
      }
    });
  };

  // Evaluate answer
  useEffect(() => {
    if (state !== "evaluating") return;
    (async () => {
      const question = questions[qIndex];
      const answer = transcript || "";
      try {
        const resp = await axios.post(`${API}/api/evaluate`, {
          question,
          answer,
          skill,
        });
        const evaluation = resp.data;
        setResults((r) => [...r, { question, answer, evaluation }]);
      } catch (err) {
        console.error("Evaluation error:", err.response?.data || err.message);
        setResults((r) => [
          ...r,
          {
            question,
            answer,
            evaluation: {
              score: 0,
              summary: "Evaluation failed",
              strengths: [],
              improvements: [],
              suggested_resources: [],
            },
          },
        ]);
      } finally {
        setTimeout(() => {
          const next = qIndex + 1;
          if (next >= questions.length) {
            setState("finished");
            safeSpeak("Interview finished. Check your feedback.");
          } else {
            askQuestion(next);
          }
        }, 500);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const stopListeningManually = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setState("evaluating");
  };

  const replayQuestion = (index) => {
    safeSpeak(questions[index], () => {
      setState("listening");
      try {
        recognitionRef.current?.start();
      } catch {}
    });
  };

  const getStatusColor = () => {
    switch(state) {
      case "idle": return "gray";
      case "asking": return "blue";
      case "listening": return "green";
      case "evaluating": return "yellow";
      case "finished": return "purple";
      default: return "gray";
    }
  };

  const getStatusIcon = () => {
    switch(state) {
      case "listening": return <Mic className="w-5 h-5 animate-pulse" />;
      case "asking": return <Volume2 className="w-5 h-5 animate-pulse" />;
      case "evaluating": return <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />;
      case "finished": return <Trophy className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Voice Interview Coach
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Practice interviews with real-time AI feedback
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Skill Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Skill
              </label>
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g., React, Python"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Level Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              >
                <option value="junior" className="bg-slate-900">Junior</option>
                <option value="mid" className="bg-slate-900">Mid</option>
                <option value="senior" className="bg-slate-900">Senior</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Status
              </label>
              <div className={`flex items-center gap-3 px-4 py-3.5 bg-${getStatusColor()}-500/20 border border-${getStatusColor()}-500/30 rounded-xl`}>
                {getStatusIcon()}
                <span className="font-semibold capitalize">{state}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={startInterview}
              disabled={loadingQuestions}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingQuestions ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Start Interview
                </>
              )}
            </button>

            <button
              onClick={() => {
                setState("idle");
                setQuestions([]);
                setResults([]);
                setTranscript("");
              }}
              className="group px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Interview Panel */}
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mic className="w-6 h-6 text-purple-400" />
              Live Interview
            </h3>

            {/* Current Question */}
            <div className="mb-6 p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm text-gray-400 mb-2 font-semibold">Question {qIndex + 1}:</p>
              <p className="text-lg leading-relaxed">{questions[qIndex] || "—"}</p>
            </div>

            {/* Your Answer */}
            <div className="mb-6 p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm text-gray-400 mb-2 font-semibold">Your Answer:</p>
              <p className="text-lg leading-relaxed min-h-[60px]">
                {transcript || <span className="text-gray-500 italic">(waiting for your speech)</span>}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {state === "listening" && (
                <button
                  onClick={stopListeningManually}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <MicOff className="w-5 h-5" />
                  Stop & Evaluate
                </button>
              )}
              <button
                onClick={() => replayQuestion(qIndex)}
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                Replay Question
              </button>
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Past Feedback
              </span>
              {results.length > 0 && (
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm">
                  {results.length} Answered
                </span>
              )}
            </h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No feedback yet. Start the interview!</p>
                </div>
              ) : (
                results.map((r, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all"
                  >
                    {/* Question Number & Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <span className="font-bold">Question {i + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-cyan-400">{r.evaluation?.score}</span>
                        <span className="text-gray-400">/10</span>
                      </div>
                    </div>

                    {/* Question */}
                    <p className="text-sm text-gray-300 mb-3">
                      <span className="font-semibold text-purple-400">Q:</span> {r.question}
                    </p>

                    {/* Answer */}
                    <p className="text-sm text-gray-300 mb-3">
                      <span className="font-semibold text-cyan-400">A:</span> {r.answer || <span className="italic">(no transcript)</span>}
                    </p>

                    {/* Summary */}
                    <p className="text-sm text-gray-400 mb-3 italic">{r.evaluation?.summary}</p>

                    {/* Strengths */}
                    {r.evaluation?.strengths?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-green-400 mb-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Strengths:
                        </p>
                        <p className="text-sm text-gray-300 ml-5">{r.evaluation.strengths.join("; ")}</p>
                      </div>
                    )}

                    {/* Improvements */}
                    {r.evaluation?.improvements?.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-orange-400 mb-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Improvements:
                        </p>
                        <p className="text-sm text-gray-300 ml-5">{r.evaluation.improvements.join("; ")}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}