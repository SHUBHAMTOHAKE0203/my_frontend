import { useState } from "react";
import axios from "axios";

function GitHubExplorer() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [contributions, setContributions] = useState(null);
  const [error, setError] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_API_KEY; 
  const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY; 

  const fetchData = async () => {
    try {
      setError("");
      setProfile(null);
      setRepos([]);
      setContributions(null);
      setAiSuggestions("");

      // 1️⃣ Profile
      const profileRes = await axios.get(
        `https://api.github.com/users/${username}`
      );
      setProfile(profileRes.data);

      // 2️⃣ Repositories
      const repoRes = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=10&sort=updated`
      );
      setRepos(repoRes.data);

      // 3️⃣ Contributions (GraphQL needs token)
      const graphqlRes = await axios.post(
        "https://api.github.com/graphql",
        {
          query: `
            query {
              user(login: "${username}") {
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                      }
                    }
                  }
                }
              }
            }
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );

      setContributions(
        graphqlRes.data.data.user.contributionsCollection.contributionCalendar
      );

      // 4️⃣ AI Suggestions via OpenRouter
      setLoadingAI(true);
      const messages = [
        {
          role: "system",
          content:
            "You are an expert software developer assistant. Analyze a GitHub profile and give useful suggestions to improve the profile, repos, contributions, and skills."
        },
        {
          role: "user",
          content: `
GitHub profile info: ${JSON.stringify(profileRes.data)}
Top 10 repositories info: ${JSON.stringify(repoRes.data)}
Contribution stats: ${JSON.stringify(
            graphqlRes.data.data.user.contributionsCollection.contributionCalendar
          )}

Give concise AI suggestions for the user to improve their GitHub presence, open source contributions, and project quality. Return as a numbered list.
`
        }
      ];

      const aiResp = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-4.1-mini",
          messages,
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiText = aiResp.data?.choices?.[0]?.message?.content || "";
      setAiSuggestions(aiText);
      setLoadingAI(false);

    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch data. Check username or API limits.");
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🔍 GitHub Explorer + AI Suggestions
          </h1>
          <p className="text-gray-400 text-lg">Discover profiles, analyze repos, and get AI-powered insights</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl p-8 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            />
            <button
              onClick={fetchData}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-center text-lg mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 relative z-10">{error}</p>}

      {profile && (
        <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 mb-8 relative z-10">
          <div className="flex items-center gap-6">
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-purple-500/50 shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{profile.name || profile.login}</h2>
              <p className="text-gray-300 mb-3">{profile.bio}</p>
              <div className="flex gap-6 text-gray-400">
                <p>
                  <span className="text-purple-400 font-semibold">Followers:</span> {profile.followers}
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">Following:</span> {profile.following}
                </p>
                <p>
                  <span className="text-pink-400 font-semibold">Public Repos:</span> {profile.public_repos}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 mb-8 relative z-10">
          <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Repositories
          </h3>
          <div className="space-y-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="group bg-gradient-to-br from-purple-900/10 to-cyan-900/10 backdrop-blur-sm rounded-xl border border-purple-500/10 hover:border-purple-500/50 p-5 hover:scale-105 transition-all relative overflow-hidden"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors"
                >
                  {repo.name}
                </a>
                <div className="flex gap-6 mt-2 text-gray-400">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contributions && (
        <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 mb-8 relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Contributions
          </h3>
          <p className="text-gray-300 text-lg mb-6">
            <span className="text-purple-400 font-semibold">Total:</span> {contributions.totalContributions}
          </p>
          <div className="grid grid-cols-12 gap-1">
            {contributions.weeks.flatMap((w) =>
              w.contributionDays.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date} - ${day.contributionCount} contributions`}
                  className={`w-3 h-3 rounded-sm transition-colors ${
                    day.contributionCount > 0 ? "bg-purple-500 hover:bg-purple-400" : "bg-white/10 hover:bg-white/20"
                  }`}
                />
              ))
            )}
          </div>
        </div>
      )}

      {loadingAI && (
        <div className="text-center py-8 relative z-10">
          <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 mt-4 text-lg">Generating AI suggestions...</p>
        </div>
      )}
      {aiSuggestions && (
        <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 mb-8 relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🤖 AI Suggestions
            </span>
          </h3>
          <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">{aiSuggestions}</pre>
        </div>
      )}
    </div>
  );
}

export default GitHubExplorer;