import { useState } from 'react';
import axios from 'axios';

const PARSE_API_URL = `${import.meta.env.VITE_API_URL}/api/parse-resume`;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY; // store in .env for production

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setParsedData(null);
    setAiSuggestions(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file.');

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resumeFile', file);

    try {
      // 1️⃣ Parse resume
      const parseResp = await axios.post(PARSE_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setParsedData(parseResp.data);

      // 2️⃣ Generate AI suggestions based on parsed JSON
      const prompt = `
      You are an expert career coach. Here is a candidate's resume:
      ${JSON.stringify(parseResp.data)}

      Provide actionable improvement suggestions for skills, experience, education, and summary.
      Respond with a JSON object:
      {
        "skillsSuggestions": ["..."],
        "experienceSuggestions": ["..."],
        "summarySuggestions": ["..."],
        "educationSuggestions": ["..."]
      }
      `;

      const aiResp = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: 'You are a helpful AI career coach.' },
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiText = aiResp.data?.choices?.[0]?.message?.content || '{}';
      let suggestions = {};
      try {
        suggestions = JSON.parse(aiText);
      } catch {
        suggestions = { error: 'Failed to parse AI suggestions', raw: aiText };
      }

      setAiSuggestions(suggestions);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Unexpected error.');
      setParsedData(null);
      setAiSuggestions(null);
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

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            📄 Resume Analyzer + AI Suggestions
          </h1>
          <p className="text-gray-400 text-lg">Upload your resume and get AI-powered insights</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-3 font-semibold text-lg">Upload Resume (PDF or DOCX)</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf,.docx" 
                  onChange={handleFileChange} 
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-cyan-600 file:text-white file:font-semibold hover:file:scale-105 file:transition-all cursor-pointer focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              {file && (
                <p className="mt-2 text-cyan-400 text-sm">Selected: {file.name}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </span>
              ) : 'Parse & Suggest'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 backdrop-blur-xl">
            <p className="text-red-400 text-lg font-semibold">{error}</p>
          </div>
        )}

        {parsedData && (
          <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ✅ Parsed Data
            </h2>
            <pre className="bg-black/30 rounded-xl p-6 overflow-x-auto text-gray-300 text-sm leading-relaxed border border-purple-500/20">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}

        {aiSuggestions && (
          <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500"></div>
            
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              💡 AI Suggestions
            </h2>
            <pre className="bg-black/30 rounded-xl p-6 overflow-x-auto text-gray-300 text-sm leading-relaxed border border-cyan-500/20">
              {JSON.stringify(aiSuggestions, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;