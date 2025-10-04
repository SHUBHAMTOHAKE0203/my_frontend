import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Sparkles, Users, Newspaper, Calendar, LogOut, LayoutGrid, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              CareerPath
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-2">
                {/* Navigation Links */}
                <Link 
                  to="/services"
                  className="group px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 font-medium"
                >
                  <LayoutGrid className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  Services
                </Link>

                <Link 
                  to="/comp-exam"
                  className="group px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 font-medium"
                >
                  <Calendar className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  ExamAlert
                </Link>

                <Link 
                  to="/community"
                  className="group px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 font-medium"
                >
                  <Users className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  Community
                </Link>

                <Link 
                  to="/news"
                  className="group px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 font-medium"
                >
                  <Newspaper className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                  EduSnap
                </Link>

                {/* Divider */}
                <div className="w-px h-8 bg-white/10 mx-2"></div>

                {/* User Status & Dashboard */}
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-slate-950 animate-pulse"></span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-purple-300 transition-colors font-semibold"
                  >
                    {user.displayName || "Dashboard"}
                  </Link>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => signOut(auth)}
                  className="group px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {user && isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-2">
            <Link 
              to="/services"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              <LayoutGrid className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Services</span>
            </Link>

            <Link 
              to="/comp-exam"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span className="font-medium">ExamAlert</span>
            </Link>

            <Link 
              to="/community"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              <Users className="w-5 h-5 text-pink-400" />
              <span className="font-medium">Community</span>
            </Link>

            <Link 
              to="/news"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              <Newspaper className="w-5 h-5 text-green-400" />
              <span className="font-medium">EduSnap</span>
            </Link>

            <div className="border-t border-white/10 my-2"></div>

            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-slate-950"></span>
              </div>
              <span className="font-semibold">{user.displayName || "Dashboard"}</span>
            </Link>

            <button
              onClick={() => {
                signOut(auth);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/80 hover:bg-red-600 rounded-xl text-white font-semibold transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;