import React, { useState } from 'react';
import './Account.css'; 

const AccountPage = () => {
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');   
  const [contactNumber, setContactNumber] = useState(''); 
  const [email, setEmail] = useState('');   
  const [resume, setResume] = useState(null);  
  
  return (
    <div className="account-page">
      <div className="profile-container">
        <div className="profile-picture">
          <img src="default-profile.png" alt="Profile" /> {}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
