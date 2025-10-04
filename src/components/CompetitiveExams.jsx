import React, { useState, useEffect } from "react";
import { Clock, Calendar, BookOpen, ExternalLink } from "lucide-react";

// Hardcoded exam data
const EXAMS = [
  {
    exam: "GATE 2026",
    date: "2026-02-01",
    link: "https://gate.iitb.ac.in/",
    skills_required: ["Engineering", "Data Science"],
  },
  {
    exam: "CAT 2026",
    date: "2026-11-28",
    link: "https://iimcat.ac.in/",
    skills_required: ["Management", "Logical Reasoning"],
  },
  {
    exam: "UPSC Civil Services 2026",
    date: "2026-05-15",
    link: "https://www.upsc.gov.in/",
    skills_required: ["General Knowledge", "Current Affairs"],
  },
  {
    exam: "JEE Advanced 2026",
    date: "2026-06-10",
    link: "https://jeeadv.ac.in/",
    skills_required: ["Physics", "Chemistry", "Math"],
  },
  {
    exam: "NEET 2026",
    date: "2026-05-03",
    link: "https://neet.nta.nic.in/",
    skills_required: ["Biology", "Chemistry", "Physics"],
  },
  {
    exam: "GRE 2026",
    date: "2026-08-15",
    link: "https://www.ets.org/gre",
    skills_required: ["Verbal Reasoning", "Quantitative Reasoning", "Analytical Writing"],
  },
  {
    exam: "GMAT 2026",
    date: "2026-09-20",
    link: "https://www.mba.com/exams/gmat",
    skills_required: ["Management", "Quantitative Reasoning", "Verbal Reasoning"],
  },
  {
    exam: "SSC CGL 2026",
    date: "2026-07-10",
    link: "https://ssc.nic.in/",
    skills_required: ["General Knowledge", "Quantitative Aptitude", "English"],
  },
  {
    exam: "IBPS PO 2026",
    date: "2026-10-05",
    link: "https://www.ibps.in/",
    skills_required: ["Banking", "Reasoning", "Quantitative Aptitude"],
  },
  {
    exam: "NDA 2026",
    date: "2026-04-18",
    link: "https://www.upsc.gov.in/",
    skills_required: ["Mathematics", "General Knowledge", "Defense"],
  },
  {
    exam: "CLAT 2026",
    date: "2026-05-24",
    link: "https://consortiumofnlus.ac.in/",
    skills_required: ["Law", "Legal Reasoning", "Logical Reasoning"],
  },
  {
    exam: "AIIMS 2026",
    date: "2026-05-26",
    link: "https://www.aiimsexams.ac.in/",
    skills_required: ["Biology", "Chemistry", "Physics", "Medical"],
  },
  {
    exam: "BITSAT 2026",
    date: "2026-05-18",
    link: "https://www.bitsadmission.com/",
    skills_required: ["Physics", "Chemistry", "Math", "English"],
  },
  {
    exam: "CTET 2026",
    date: "2026-12-20",
    link: "https://ctet.nic.in/",
    skills_required: ["Teaching", "Child Development", "Pedagogy"],
  },
  {
    exam: "NET/JRF 2026",
    date: "2026-06-28",
    link: "https://ugcnet.nta.nic.in/",
    skills_required: ["Research", "Teaching", "Higher Education"],
  },
];

function getCountdown(targetDate) {
  const now = new Date();
  const diff = new Date(targetDate) - now;
  if (diff <= 0) return "Exam date passed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function CompetitiveExams() {
  const [skill, setSkill] = useState("");
  const [filteredExams, setFilteredExams] = useState(EXAMS);
  const [timer, setTimer] = useState(0); // For countdown updates

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const handleFilter = () => {
    if (!skill) {
      setFilteredExams(EXAMS);
      return;
    }
    const filtered = EXAMS.filter((e) =>
      e.skills_required.some((s) =>
        s.toLowerCase().includes(skill.toLowerCase())
      )
    );
    setFilteredExams(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            📚 Competitive Exams Notifications
          </h1>
          <p className="text-gray-400 text-lg">Enter your skill/interest to filter relevant exams</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl p-8 mb-8">
          <div className="flex gap-4">
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Skill or interest (e.g., Data Science)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            />
            <button
              onClick={handleFilter}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              Filter
            </button>
          </div>
        </div>

        {filteredExams.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 text-center">
            <p className="text-gray-300 text-lg">No exams found for "{skill}"</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredExams.map((e, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/50 shadow-2xl p-6 hover:scale-105 transition-all relative overflow-hidden"
              >
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  {e.exam}
                </h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span><strong className="text-purple-400">Date:</strong> {e.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-pink-400" />
                    <span><strong className="text-purple-400">Countdown:</strong> {getCountdown(e.date)}</span>
                  </div>
                  
                  <div className="flex items-start gap-3 text-gray-300">
                    <BookOpen className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-purple-400">Skills:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {e.skills_required.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-cyan-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={e.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Link
                </a>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}