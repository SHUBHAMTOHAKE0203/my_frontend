import React, { useEffect, useState } from "react";
import { fetchSkillsAndGenerateQuiz } from "../api/quizService";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, get } from "firebase/database";
import jsPDF from "jspdf";
import { Brain, Sparkles, Download, RefreshCw, CheckCircle, XCircle, Trophy, Target } from "lucide-react";

const SkillQuiz = () => {
  const [user] = useAuthState(auth);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch skills from Firebase
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!user) return;
      const snapshot = await get(ref(db, `users/${user.uid}/skills`));
      if (snapshot.exists()) {
        const val = snapshot.val();
        const skillList = Array.isArray(val)
          ? val
          : typeof val === "object"
          ? Object.values(val)
          : val.split(",").map((s) => s.trim());
        setSkills(skillList);
      }
    };
    fetchUserSkills();
  }, [user]);

  // Generate quiz
  const generateQuiz = async (skill) => {
    setLoading(true);
    setScore(null);
    setAnswers({});
    try {
      const quizData = await fetchSkillsAndGenerateQuiz(skill);
      setQuiz(quizData[0]); // Only first block for selected skill
      setSelectedSkill(skill);
    } catch (err) {
      console.error("Quiz error:", err);
      alert("Failed to load quiz. Try again.");
    }
    setLoading(false);
  };

  // Handle answer selection
  const handleAnswer = (qIdx, option) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  // Evaluate quiz
  const evaluateQuiz = () => {
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.options[q.correctAnswerIndex ?? 0]) correct++;
    });
    const finalScore = Math.round((correct / quiz.questions.length) * 100);
    setScore(finalScore);
  };

  // Generate PDF Report
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${selectedSkill} Quiz Report`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Score: ${score}%`, 20, 30);

    quiz.questions.forEach((q, idx) => {
      doc.text(`${idx + 1}. ${q.question}`, 20, 40 + idx * 20);
      q.options.forEach((opt, oIdx) => {
        let prefix = "";
        if (q.correctAnswerIndex === oIdx) prefix = "(Correct) ";
        if (answers[idx] === opt && q.correctAnswerIndex !== oIdx) prefix = "(Your Answer) ";
        doc.text(`   - ${prefix}${opt}`, 25, 47 + idx * 20 + oIdx * 6);
      });
    });

    doc.save(`${selectedSkill}_Quiz_Report.pdf`);
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
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Skill Quizzes
          </h2>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Test your knowledge and track your progress
          </p>
        </div>

        {/* Skill Selection */}
        {!quiz && (
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold">Select a skill to take quiz:</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => generateQuiz(skill)}
                  className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">{skill}</span>
                    <Brain className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm text-gray-400 text-left">Take {skill} Quiz</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-400">Generating your quiz...</p>
          </div>
        )}

        {/* Quiz Section */}
        {quiz && !score && (
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">{selectedSkill} Quiz</h3>
              <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-semibold">
                {quiz.questions.length} Questions
              </div>
            </div>

            <div className="space-y-8">
              {quiz.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  <p className="text-xl font-semibold mb-4 flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{q.question}</span>
                  </p>

                  <div className="space-y-3 ml-11">
                    {q.options.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          answers[idx] === opt
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${idx}`}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswer(idx, opt)}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                        />
                        <span className="ml-3 text-lg">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={evaluateQuiz}
              className="group mt-8 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Submit Quiz
            </button>
          </div>
        )}

        {/* Results Section */}
        {score !== null && (
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mb-6 shadow-2xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-4">
                Your Score: <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{score}%</span>
              </h3>
              <p className="text-gray-400 mb-6">
                {score >= 80 ? "Outstanding! 🎉" : score >= 60 ? "Great job! 👏" : "Keep practicing! 💪"}
              </p>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="w-full bg-white/10 h-6 rounded-full overflow-hidden border border-white/20">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-6 rounded-full transition-all duration-1000 flex items-center justify-center text-sm font-bold"
                    style={{ width: `${score}%` }}
                  >
                    {score}%
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="mb-8 space-y-4">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Detailed Results
              </h4>
              {quiz.questions.map((q, idx) => {
                const isCorrect = answers[idx] === q.options[q.correctAnswerIndex ?? 0];
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      isCorrect
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold mb-2">{q.question}</p>
                        <p className="text-sm text-gray-400">
                          Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{answers[idx]}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-400 mt-1">
                            Correct answer: {q.options[q.correctAnswerIndex ?? 0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={downloadReport}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Download Report
              </button>
              <button
                onClick={() => {
                  setQuiz(null);
                  setScore(null);
                  setSelectedSkill(null);
                }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Generate New Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillQuiz;