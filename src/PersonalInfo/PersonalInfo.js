import React from 'react';
import axios from 'axios';

const PersonalInfo = ({ nextStep, handleChange, formData }) => {
    const { firstName, lastName, address, jobTitle, linkedinId, phone, email, summary } = formData;

    const handleNext = async () => {
        try {
            await axios.post('http://localhost:5000/api/resumebuilder', {
                firstName,
                lastName,
                address,
                jobTitle,
                linkedinId,
                phone,
                email,
                summary,
            });
            nextStep();
        } catch (error) {
            console.error('Error saving data:', error.response ? error.response.data : error.message);
            alert('Failed to save user data. Please try again.');
        }
    };

    return (
        <div>
            <h2>Personal Information</h2>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
            <input type="text" placeholder="Address" value={address} onChange={(e) => handleChange('address', e.target.value)} />
            <input type="text" placeholder="Desired Job Title" value={jobTitle} onChange={(e) => handleChange('jobTitle', e.target.value)} />
            <input type="text" placeholder="LinkedIn ID" value={linkedinId} onChange={(e) => handleChange('linkedinId', e.target.value)} />
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => handleChange('phone', e.target.value)} />
            <input type="text" placeholder="Email" value={email} onChange={(e) => handleChange('email', e.target.value)} />
            <textarea 
                placeholder="Summary" 
                value={summary} 
                onChange={(e) => handleChange('summary', e.target.value)}
                rows="4"
            />
            <button onClick={handleNext}>Next</button>
        </div>
    );
};

export default PersonalInfo;
