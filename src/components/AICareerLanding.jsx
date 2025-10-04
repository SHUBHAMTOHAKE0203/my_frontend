import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, Target, CheckCircle, ArrowRight, Zap, Brain, Rocket, Star } from 'lucide-react';
import MotivationQuotes from './MotivationQuotes';
import BookRecommender from './BookRecommender';
import { Link } from 'react-router-dom';
export default function AICareerLanding() {
  const [activeCareer, setActiveCareer] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const careers = [
    { name: 'AI Engineer', skills: ['Python', 'TensorFlow', 'Deep Learning'], growth: 95 },
    { name: 'Data Scientist', skills: ['Statistics', 'ML', 'Python'], growth: 88 },
    { name: 'ML Engineer', skills: ['PyTorch', 'MLOps', 'Cloud'], growth: 92 },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized career paths based on your skills, interests, and market demand.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Skill Assessment',
      description: 'Identify your strengths and gaps with our intelligent assessment system.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'AI Interview Bot',
      description: 'Connect with industry experts who guide you through your career journey.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'AI powered Job Finder Near You',
      description: 'AI matches you with opportunities that perfectly align with your profile.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sherin Thomas',
      role: 'ML Engineer at Google',
      image: 'ST',
      text: 'This platform helped me transition from web development to machine learning in just 8 months. The roadmap was spot-on!',
      rating: 5
    },
    {
      name: 'Shubham Tohake',
      role: 'Data Scientist at Microsoft',
      image: 'ST',
      text: 'The AI recommendations were incredibly accurate. I found my dream job within 3 months of starting my journey.',
      rating: 5
    },
    {
      name: 'Sarvesh Shiralkar',
      role: 'AI Researcher at Stanford',
      image: 'SS',
      text: 'The mentorship program connected me with amazing professionals who shaped my career path.',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCareer((prev) => (prev + 1) % careers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8 backdrop-blur-sm">
            <Rocket className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Powered by Advanced AI and more.</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Discover Your Future,
            </span>
            <br />
            <span className="text-white">Powered by AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get crystal-clear career guidance with AI-driven insights, personalized roadmaps, and smart mentorship that adapts to your unique journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Explore Careers
            </button>
          </div>

          {/* Interactive Career Path Visualization */}
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Your AI-Matched Career Path</h3>
              <div className="flex gap-2">
                {careers.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === activeCareer ? 'bg-cyan-400 w-8' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="text-left">
                  <h4 className="text-3xl font-bold text-cyan-400 mb-2">
                    {careers[activeCareer].name}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {careers[activeCareer].skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Market Growth</span>
                    <span className="font-bold text-green-400">{careers[activeCareer].growth}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {['Assessment', 'Skill Building', 'Portfolio', 'Job Ready'].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-semibold">{step}</span>
                    <div className="ml-auto">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(idx + 1) * 25}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">CareerAI</span>
            </h2>
            <p className="text-xl text-gray-400">Intelligent features designed for your success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{ transform: hoveredFeature === idx ? 'translateY(-8px)' : 'translateY(0)' }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  
                  {hoveredFeature === idx && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl -z-10 blur-xl" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-24 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-400">Join thousands who found their dream careers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MotivationQuotes/>
      {/* Stats Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50K+', label: 'Active Users' },
              { number: '95%', label: 'Success Rate' },
              { number: '500+', label: 'Partner Companies' },
              { number: '4.9/5', label: 'User Rating' }
            ].map((stat, idx) => (
              <div key={idx} className="p-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl border border-purple-500/30">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Try Our New Feature About AI Powered Book Recommender
            </p>
              <Link to="/get-books">
            <button className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
          
              Try New Feature
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 CareerAI. Empowering careers through artificial intelligence.</p>
          <p> BY SHUBHAM TOHAKE - TEAM : SOLO SYNERGY</p>
        </div>
      </footer>
    </div>
  );
}