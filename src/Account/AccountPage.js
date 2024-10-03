import React, { useState } from 'react';
import './Account.css'; 

const AccountPage = () => {
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');   
  const [contactNumber, setContactNumber] = useState(''); 
  const [email, setEmail] = useState('');   
  const [resume, setResume] = useState(null);  
  
  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log({
      firstName,
      lastName,
      contactNumber,
      email,
      resume,
    });
  };
  
  return (
    <div className="account-page">
      <div className="profile-container">
        <div className="profile-picture">
          {/* <img src="default-profile.png" alt="Profile" /> {} */}
        </div>
        <form className="account-form">
  <div className="form-group">
    <label htmlFor="firstName">First Name</label>
    <input
      type="text"
      id="firstName"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)} 
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="lastName">Last Name</label>
    <input
      type="text"
      id="lastName"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="contactNumber">Contact Number</label>
    <input
      type="tel"
      id="contactNumber"
      value={contactNumber}
      onChange={(e) => setContactNumber(e.target.value)} 
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)} 
      required
    />
  </div>
  <div className="form-group">
  <label htmlFor="resume">Resume</label>
  <input
    type="file"
    id="resume"
    onChange={(e) => setResume(e.target.files[0])} 
    accept=".pdf,.doc,.docx"  
  />
</div>
<button type="submit" className="update-button">Update</button>
</form>
      </div>
    </div>
  );
};

export default AccountPage;