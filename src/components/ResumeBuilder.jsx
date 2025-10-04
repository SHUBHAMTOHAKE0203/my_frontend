import React, { useState, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

// Replace with your OpenRouter API key
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const questions = [
  "What is your full name?",
  "Your email address?",
  "Phone number?",
  "LinkedIn URL (optional)?",
  "GitHub/Portfolio URL (optional)?",
  "Your location (City, State, Country)?",
  "Briefly describe your career goals or professional summary (2-4 lines).",
  "List your technical skills (programming languages, tools, software).",
  "List your soft skills (communication, leadership, teamwork, etc.).",
  "Education: Highest degree, institution, year?",
  "Other degrees or certifications (if any)?",
  "Any notable academic achievements or awards?",
  "Work experience: Company name, role, duration?",
  "Key responsibilities and achievements in this role?",
  "Previous work experiences (repeat if any)?",
  "Projects: Title?",
  "Project description (problem solved, technologies used)?",
  "Notable results or achievements in the project?",
  "Any awards, honors, competitions, recognitions?",
  "Hobbies or interests (optional)?",
  "Languages known?",
  "Volunteer experience or extracurricular activities?"
];

const ResumeBuilder = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [currentQ, setCurrentQ] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const resumeRef = useRef();

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = e.target.value;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const prevQuestion = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const generateResume = async () => {
    setGenerating(true);
    const userDetails = answers.map((ans, i) => `${questions[i]} ${ans}`).join("\n");

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates professional resumes."
            },
            {
              role: "user",
              content: `
Generate a professional, ATS-friendly resume using the following user information.
- Format it in proper resume style with sections: Name, Contact, Summary, Skills, Education, Work Experience, Projects, Achievements.
- Use bullet points for clarity.
- Avoid unnecessary symbols that may break ATS.

User Details:
${userDetails}
`
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const aiResume = response.data.choices[0].message.content;
      setResumeData(aiResume);
    } catch (err) {
      console.error(err);
      setResumeData("Error generating resume.");
    }
    setGenerating(false);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Parse resume sections
    const lines = resumeData.split("\n");
    
    lines.forEach((line) => {
      if (!line.trim()) {
        yPosition += 3;
        return;
      }

      // Section headers (ALL CAPS or ends with colon)
      if (line === line.toUpperCase() || line.match(/^[A-Z\s]+:?\s*$/)) {
        if (yPosition > margin + 10) yPosition += 5;
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.trim(), margin, yPosition);
        yPosition += 7;
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
        yPosition += 2;
      }
      // Bullet points
      else if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const text = line.trim().substring(1).trim();
        const splitText = pdf.splitTextToSize(text, maxWidth - 10);
        
        pdf.text("•", margin + 5, yPosition);
        pdf.text(splitText, margin + 10, yPosition);
        yPosition += splitText.length * 5;
      }
      // Regular text
      else {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const splitText = pdf.splitTextToSize(line.trim(), maxWidth);
        pdf.text(splitText, margin, yPosition);
        yPosition += splitText.length * 5;
      }

      // Add new page if needed
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    });

    pdf.save("Professional_Resume.pdf");
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Resume Builder
          </h1>
          <p className="text-gray-400 text-lg">Create your professional, ATS-friendly resume in minutes</p>
        </div>

        {!resumeData && (
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <label className="block text-gray-200 text-xl font-semibold mb-4">
                {questions[currentQ]}
              </label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 min-h-[120px] resize-none"
                value={answers[currentQ]}
                onChange={handleAnswerChange}
                placeholder="Type your answer here..."
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={prevQuestion}
                disabled={currentQ === 0}
                className="flex-1 bg-white/10 border border-white/20 text-white font-semibold px-6 py-4 rounded-xl hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {currentQ === questions.length - 1 ? (
                <button
                  onClick={generateResume}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating...
                    </span>
                  ) : "Generate Resume"}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {resumeData && (
          <div>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  setResumeData(null);
                  setCurrentQ(0);
                }}
                className="flex-1 bg-white/10 border border-white/20 text-white font-semibold px-6 py-4 rounded-xl hover:bg-white/20 transition-all"
              >
                Start Over
              </button>
              <button
                onClick={downloadPDF}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-6 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
              >
                Download PDF
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-t-2xl"></div>
              
              <div
                ref={resumeRef}
                className="bg-white rounded-xl p-12 shadow-lg"
                style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6, color: "#000" }}
              >
                {resumeData.split("\n").map((line, idx) => {
                  if (!line.trim()) return <div key={idx} className="h-3"></div>;
                  
                  // Section headers
                  if (line === line.toUpperCase() || line.match(/^[A-Z\s]+:?\s*$/)) {
                    return (
                      <div key={idx} className="mt-6 mb-2">
                        <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1">
                          {line.trim()}
                        </h2>
                      </div>
                    );
                  }
                  
                  // Bullet points
                  if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
                    return (
                      <div key={idx} className="ml-6 mb-1 flex">
                        <span className="mr-2">•</span>
                        <span>{line.trim().substring(1).trim()}</span>
                      </div>
                    );
                  }
                  
                  // Regular text
                  return (
                    <p key={idx} className="mb-2 text-gray-800">
                      {line.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;