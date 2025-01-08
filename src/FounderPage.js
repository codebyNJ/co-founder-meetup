import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './FounderPage.css';

const FounderPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Redirect the founder to their dashboard
      navigate("/founder-dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Failed to log in with Google. Please try again.");
    }
  };

  return (
    <div className="founder-page">
      <h1>Welcome Founders</h1>
      <p>Sign in to post your ideas and connect with developers.</p>
      {error && <p className="error-message">{error}</p>}
      <button className="google-login-button" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default FounderPage;
