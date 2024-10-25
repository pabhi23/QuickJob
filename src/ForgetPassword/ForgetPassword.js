import React, { useState } from "react";
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await fetch("http://localhost:5000/api/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setEmail(""); 
        setNewPassword("");
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="forget-password-page">
      <div className="forget-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleUpdatePassword}>
          <div className="input-group">
            <label htmlFor="email">Email Id:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
