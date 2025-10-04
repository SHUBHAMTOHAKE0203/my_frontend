import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, Chrome, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const snapshot = await get(ref(db, "users/" + user.uid));
      if (!snapshot.exists() || !snapshot.val().skills) navigate("/complete-profile");
      else navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const snapshot = await get(ref(db, "users/" + user.uid));
      if (!snapshot.exists()) {
        await set(ref(db, "users/" + user.uid), {
          name: user.displayName || "",
          email: user.email,
          skills: [],
          interests: [],
          education: { status: "", degree: "", year: "" },
        });
        navigate("/complete-profile");
      } else {
        const data = snapshot.val();
        if (!data.skills || data.skills.length === 0) navigate("/complete-profile");
        else navigate("/dashboard");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to continue your career journey</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button type="button" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              onClick={handleEmailLogin}
              className="group w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3.5 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-purple-900/40 to-cyan-900/40 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white/5 border border-white/10 text-white font-semibold py-3.5 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <Chrome className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              Login with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-8">
          By signing in, you agree to our{" "}
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            Terms of Service
          </button>{" "}
          and{" "}
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;