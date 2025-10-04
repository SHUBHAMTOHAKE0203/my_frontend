import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  TrendingUp, 
  Lightbulb, 
  BookOpen, 
  Github, 
  Brain, 
  GraduationCap,
  Sparkles,
  Target,
  Award,
  Clock,
  ArrowRight,
  Zap,
  Code,
  Star
} from "lucide-react";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");

    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, "users/" + user.uid));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (!userData) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-xl">Loading your dashboard...</p>
      </div>
    </div>
  );

  const features = [
    {
      icon: TrendingUp,
      title: "Career Path Simulator",
      description: "Visualize your career journey with AI-powered predictions",
      path: "/car-sti",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-900/20 to-pink-900/20",
      iconBg: "from-purple-500 to-pink-500",
      stats: "98% Accuracy"
    },
    {
      icon: Lightbulb,
      title: "Career Suggestions",
      description: "Get personalized career recommendations based on your profile",
      path: "/car-sug",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-900/20 to-cyan-900/20",
      iconBg: "from-blue-500 to-cyan-500",
      stats: "500+ Careers"
    },
    {
      icon: BookOpen,
      title: "Courses & Learning",
      description: "Discover curated courses tailored to your career goals",
      path: "/course-fetch",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-900/20 to-emerald-900/20",
      iconBg: "from-green-500 to-emerald-500",
      stats: "1000+ Courses"
    },
    {
      icon: Github,
      title: "GitHub Explorer",
      description: "AI-recommended repositories and projects for your growth",
      path: "/git-sug",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-900/20 to-red-900/20",
      iconBg: "from-orange-500 to-red-500",
      stats: "Smart Suggestions"
    },
    {
      icon: Brain,
      title: "Skill Quiz Test",
      description: "Assess your abilities with intelligent skill evaluations",
      path: "/take-quiz",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-900/20 to-purple-900/20",
      iconBg: "from-violet-500 to-purple-500",
      stats: "Instant Results"
    },
    {
      icon: GraduationCap,
      title: "Skill Tutorials",
      description: "Master new skills with step-by-step guided tutorials",
      path: "/skill-learn",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-900/20 to-orange-900/20",
      iconBg: "from-yellow-500 to-orange-500",
      stats: "Interactive"
    }
  ];

  const quickStats = [
    { label: "Skills Mastered", value: userData.skills?.length || 0, icon: Award, color: "purple" },
    { label: "Interests", value: userData.interests?.length || 0, icon: Star, color: "cyan" },
    { label: "Learning Hours", value: "24", icon: Clock, color: "green" },
    { label: "Progress", value: "78%", icon: Target, color: "pink" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-8 pb-24">
        {/* Welcome Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                    {userData.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-1">Welcome back, {userData.name}!</h1>
                    <p className="text-purple-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Your AI-powered career dashboard
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="font-semibold text-cyan-400">{userData.email}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Education</p>
                    <p className="font-semibold text-purple-400">
                      {userData.education?.degree} ({userData.education?.year})
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className="font-semibold text-green-400">{userData.education?.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <Icon className={`w-8 h-8 text-${stat.color}-400 mb-3`} />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Your Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-medium hover:bg-purple-500/30 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold">Your Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.interests?.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm font-medium hover:bg-cyan-500/30 transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Explore Your Career Tools</h2>
            <p className="text-gray-400">AI-powered features to accelerate your career growth</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group relative cursor-pointer"
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(feature.path)}
                  style={{ 
                    transform: hoveredCard === idx ? 'translateY(-8px)' : 'translateY(0)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className={`bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 h-full`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">
                        {feature.stats}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-3 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {hoveredCard === idx && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-2xl -z-10 blur-xl`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => navigate("/car-coach")}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 group"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
        
        {/* Tooltip */}
        <div className="absolute right-20 bg-slate-900 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-purple-500/30">
          Chat with AI Assistant
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 border-r border-b border-purple-500/30"></div>
        </div>
      </button>
    </div>
  );
};

export default Dashboard;