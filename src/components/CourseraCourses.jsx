import React, { useState } from "react";

const CourseraCourses = () => {
  const [skill, setSkill] = useState("");
  const [courses, setCourses] = useState([]);

  const fetchCourses = () => {
    if (!skill.trim()) return;

    // Hardcoded course suggestions using Coursera search
    const courseList = [
      {
        name: `${skill} for Beginners`,
        url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
      },
      {
        name: `Advanced ${skill} Techniques`,
        url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
      },
      {
        name: `${skill} Projects and Practice`,
        url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
      },
      {
        name: `${skill} Certification Preparation`,
        url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
      },
    ];

    setCourses(courseList);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 relative overflow-hidden flex items-center justify-center">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl p-8">
          <h2 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🎓 Certification & Courses Suggestor
          </h2>
          <p className="text-gray-400 text-center mb-8">Discover learning paths tailored to your skills</p>

          <input
            type="text"
            placeholder="Enter skill (e.g., React, Python)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 mb-6"
          />

          <button
            onClick={fetchCourses}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all mb-6"
          >
            Show Courses
          </button>

          {courses.length > 0 && (
            <div className="space-y-3">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-500/50 p-5 hover:scale-105 transition-all relative overflow-hidden"
                >
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors block"
                  >
                    {course.name}
                  </a>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseraCourses;