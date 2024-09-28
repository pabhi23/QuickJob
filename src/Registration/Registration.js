import React, { useState } from 'react';
import './Registration.css';

const Registration = () => {
  const [userType, setUserType] = useState('employee'); // Default to employee

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("User Type:", userType);
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required />
        </div>
        <div className="form-group radio-group">
          <label>Register as:</label>
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                value="employee"
                checked={userType === 'employee'}
                onChange={handleUserTypeChange}
              />
              Employee
            </label>
            <label>
              <input
                type="radio"
                value="employer"
                checked={userType === 'employer'}
                onChange={handleUserTypeChange}
              />
              Employer
            </label>
          </div>
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Registration;
