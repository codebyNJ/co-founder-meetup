import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-page">
      <h1 className="login-title">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form className="login-form">
        <input type="email" placeholder="Email" className="input-field" required />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          required
        />
        <button type="submit" className="submit-button">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <div className="toggle-link">
        <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
