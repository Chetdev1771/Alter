import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      // Send token to backend for verification
      const response = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        toast.success("Login successful!");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Authentication failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    toast.info("Logged out successfully");
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      {user ? (
        <div>
          <h3>Welcome, {user.name}</h3>
          <img src={user.picture} alt="Profile" width="50" />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Auth;
