import React, { useState } from 'react';
import './Registration.css';

const Registration = () => {
  const [userType, setUserType] = useState('employee');

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, userType }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      e.target.reset();
      setUserType('employee');
    } else {
      alert(data.error);
    }
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
          <label>Register As:</label>
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
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Registration;
