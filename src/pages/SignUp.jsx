import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await set(ref(db, "users/" + user.uid), {
        name: "",
        email,
        skills: [],
        interests: [],
        education: { status: "", degree: "", year: "" },
      });
      navigate("/complete-profile");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const snapshot = await ref(db, "users/" + user.uid);
      await set(snapshot, {
        name: user.displayName || "",
        email: user.email,
        skills: [],
        interests: [],
        education: { status: "", degree: "", year: "" },
      });
      navigate("/complete-profile");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded mb-3" required />
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded mb-3">Signup</button>
        <button type="button" onClick={handleGoogleSignup} className="bg-red-500 text-white w-full py-2 rounded">Signup with Google</button>
      </form>
    </div>
  );
};

export default Signup;
