import React, { useState } from "react";
import { auth, db } from "../firebase";
import { ref, update } from "firebase/database";
import { useNavigate } from "react-router-dom";

// Predefined options
const predefinedSkills = [
  "JavaScript", "React", "Node.js", "Python", "Java", "C++", 
  "HTML", "CSS", "SQL", "Git", "Docker", "AWS", "Other"
];

const predefinedInterests = [
  "Web Development", "Mobile Development", "Data Science", 
  "AI/ML", "Cybersecurity", "DevOps", "Other"
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState("");
  const [education, setEducation] = useState({
    status: "",
    degree: "",
    year: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (skills.length === 0 || interests.length === 0 || !education.status || !education.degree || !education.year) {
      alert("Please complete all fields!");
      return;
    }

    const user = auth.currentUser;
    if (!user) return alert("User not logged in!");

    try {
      await update(ref(db, "users/" + user.uid), {
        skills,
        interests,
        education
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error updating profile!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>

        {/* Skills */}
        <div className="mb-3">
          <label className="font-semibold">Select Skills:</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {predefinedSkills.map((skill) => (
              <label key={skill} className="bg-gray-200 px-2 py-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={skills.includes(skill)}
                  onChange={() => {
                    if (skills.includes(skill)) {
                      setSkills(skills.filter((s) => s !== skill));
                    } else {
                      setSkills([...skills, skill]);
                    }
                  }}
                />
                {skill}
              </label>
            ))}
          </div>
          {skills.includes("Other") && (
            <input
              type="text"
              placeholder="Enter your custom skill"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              className="w-full border p-2 rounded mt-2"
              onBlur={() => {
                if (customSkill && !skills.includes(customSkill)) {
                  setSkills(skills.filter(s => s !== "Other").concat(customSkill));
                  setCustomSkill("");
                }
              }}
            />
          )}
        </div>

        {/* Interests */}
        <div className="mb-3">
          <label className="font-semibold">Select Interests:</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {predefinedInterests.map((i) => (
              <label key={i} className="bg-gray-200 px-2 py-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={interests.includes(i)}
                  onChange={() => {
                    if (interests.includes(i)) {
                      setInterests(interests.filter((s) => s !== i));
                    } else {
                      setInterests([...interests, i]);
                    }
                  }}
                />
                {i}
              </label>
            ))}
          </div>
          {interests.includes("Other") && (
            <input
              type="text"
              placeholder="Enter your custom interest"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              className="w-full border p-2 rounded mt-2"
              onBlur={() => {
                if (customInterest && !interests.includes(customInterest)) {
                  setInterests(interests.filter(s => s !== "Other").concat(customInterest));
                  setCustomInterest("");
                }
              }}
            />
          )}
        </div>

        {/* Education */}
        <div className="mb-3">
          <label className="font-semibold">Education:</label>
          <select
            className="w-full border p-2 rounded mb-2"
            value={education.status}
            onChange={(e) => setEducation({ ...education, status: e.target.value })}
            required
          >
            <option value="">Select Status</option>
            <option value="Completed">Completed</option>
            <option value="Pursuing">Pursuing</option>
          </select>

          <input
            type="text"
            placeholder="Degree Name"
            className="w-full border p-2 rounded mb-2"
            value={education.degree}
            onChange={(e) => setEducation({ ...education, degree: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Year of Completion"
            className="w-full border p-2 rounded"
            value={education.year}
            onChange={(e) => setEducation({ ...education, year: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded mt-4">
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
