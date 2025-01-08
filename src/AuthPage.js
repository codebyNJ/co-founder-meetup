import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Import Firebase auth methods
import { useNavigate } from 'react-router-dom'; // Use this to navigate to the dashboard
import './AuthPage.css';  // Optional, you can style the page as needed

function AuthPage() {
  const [error, setError] = useState(null);  // For handling any errors
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Google sign-in handler
  const handleSignIn = async () => {
    const auth = getAuth(); // Initialize Firebase Auth
    const provider = new GoogleAuthProvider();  // Set up Google provider

    try {
      // Trigger the Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Get user info from the result
      console.log('User Info:', user); // You can store this information in your state or navigate
      
      // Redirect to the dashboard after login
      navigate('/dashboard');  // Navigate to the dashboard page
    } catch (error) {
      setError(error.message);  // Handle any errors
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">Sign In with Google</h1>
      {error && <p className="error-message">{error}</p>}
      <button className="google-login-button" onClick={handleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
}

export default AuthPage;
