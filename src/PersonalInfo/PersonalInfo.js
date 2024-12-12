import React from 'react';
import axios from 'axios';
import '../PersonalInfo/PersonalInfo.css';

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
        <div className="form-wrapper">
            <div className="form-container">
                <h1 className='heading'>Build Your Resume</h1>
                <h2 className='tag-line'>Create Professional Resumes Effortlessly with our customizable Resume Builder</h2>
                <div className="input-row">
                    <input className="personal-input" type="text" placeholder="First Name" value={firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                    <input className="personal-input" type="text" placeholder="Last Name" value={lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                </div>

                <div className="input-row">
                    <input className="personal-input" type="text" placeholder="Address" value={address} onChange={(e) => handleChange('address', e.target.value)} />
                    <input className="personal-input" type="text" placeholder="Desired Job Title" value={jobTitle} onChange={(e) => handleChange('jobTitle', e.target.value)} />
                </div>

                <div className="input-row">
                    <input className="personal-input" type="text" placeholder="LinkedIn ID" value={linkedinId} onChange={(e) => handleChange('linkedinId', e.target.value)} />
                    <input className="personal-input" type="text" placeholder="Phone" value={phone} onChange={(e) => handleChange('phone', e.target.value)} />
                </div>

                <div className="input-row">
                    <input className="personal-input" type="text" placeholder="Email" value={email} onChange={(e) => handleChange('email', e.target.value)} />
                    <textarea
                        className="personal-input"
                        placeholder="Summary"
                        value={summary}
                        onChange={(e) => handleChange('summary', e.target.value)}
                        rows="4"
                    />
                </div>
                <div className="input-row">
                    <button className="personal-input" onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;
