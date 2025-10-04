import React, { useState } from "react";
import axios from "axios";
import { Search, Briefcase, MapPin, Building2, ExternalLink, Sparkles, TrendingUp } from "lucide-react";

export default function JobSearch() {
  const [query, setQuery] = useState("React Developer");
  const [location, setLocation] = useState("Pune");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
const API = import.meta.env.VITE_API_URL;
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API}/jobs`, {
        params: { query, location },
      });

      setJobs(resp.data.jobs_results || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      alert("Failed to fetch jobs. Check console.");
    } finally {
      setLoading(false);
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Search Jobs Near You
          </h2>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Find your dream job with AI-powered search
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Job Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Job Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. React Developer, Data Scientist"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Location Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pune, Mumbai, Remote"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="group w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Search Jobs
              </>
            )}
          </button>
        </div>

        {/* Results Header */}
        {jobs.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Available Positions
            </h3>
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-semibold">
              {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
            </span>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-3xl border border-purple-500/20">
            <Briefcase className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or location</p>
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs.map((job, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="p-6">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Building2 className="w-4 h-4" />
                        <span className="font-semibold">{job.company_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                {job.description && (
                  <div className="mb-4 text-gray-300 leading-relaxed">
                    <div 
                      className="line-clamp-3 prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    ></div>
                  </div>
                )}

                {/* Apply Button */}
                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Gradient Border Effect on Hover */}
              <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}