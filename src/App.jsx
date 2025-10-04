// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./components/SignUp"
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CompleteProfile from "./components/CompleteProfile";
import CareerSuggestions from "./components/CareerSuggestions";
import SkillQuiz from "./components/SkillQuiz"
import GitHubExplorer from "./components/GitHubExplorer";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import CareerCoach from "./components/AICareerCoach";
import ResumeBuilder from "./components/ResumeBuilder";
import SkillTutorials from "./components/SkillTutorials";
import InterviewCoach from "./components/InterviewCoach";
import CareerPathSimulator from "./components/CareerPathSimulator";
import AICareerLanding from "./components/AICareerLanding";
import CourseraCourses from "./components/CourseraCourses";
import CompetitiveExams from "./components/CompetitiveExams";
import StudyNews from "./components/StudyNews";
import JobSearch from "./components/JobSearch";
import SkillCentersMap from "./components/SkillCentersMap";
import OpenCommunity from "./components/OpenCommunity";
import Services from "./components/Services";
import Scheduler from "./components/Scheduler";
import BookRecommender from "./components/BookRecommender";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<AICareerLanding/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/car-sug" element={<CareerSuggestions/>}/>
        <Route path="/car-sti" element={<CareerPathSimulator/>}/>
        <Route path="/car-coach" element={<CareerCoach/>}/>
        <Route path="/comp-exam" element={<CompetitiveExams/>}/>
        <Route path="/course-fetch" element={<CourseraCourses/>}/>
        <Route path="/git-sug" element={<GitHubExplorer/>}/>
        <Route path="/interview" element={<InterviewCoach/>}/>
        <Route path="/job" element={<JobSearch/>}/>
        <Route path="/community" element={<OpenCommunity/>}/>
        <Route path="/analyse" element={<ResumeAnalyzer/>}/>
        <Route path="/build" element={<ResumeBuilder/>}/>
        <Route path="/nearby-skill" element={<SkillCentersMap/>}/>
        <Route path="/take-quiz" element={<SkillQuiz/>}/>
        <Route path="/skill-learn" element={<SkillTutorials/>}/>
        <Route path="/news" element={<StudyNews/>}/>
        <Route path="/schedule" element={<Scheduler/>}/>
        <Route path="/get-books" element={<BookRecommender/>}/>
      </Routes>
    </Router>
  );
}

export default App;
