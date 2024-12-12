import React, { useState } from 'react';
import '../PersonalInfo/PersonalInfo.css'; // Reuse the same CSS file

const Education = ({ nextStep, prevStep, handleChange, formData }) => {
    const [education, setEducation] = useState({
        degree: '',
        institution: '',
        graduationYear: '',
    });

    const addEducation = () => {
        handleChange('education', [...formData.education, education]);
        setEducation({
            degree: '',
            institution: '',
            graduationYear: '',
        });
        nextStep();
    };

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <h2 className="heading">Education</h2>

                <div className="input-row">
                    <input
                        className="personal-input"
                        type="text"
                        placeholder="Degree"
                        value={education.degree}
                        onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                    />
                    <input
                        className="personal-input"
                        type="text"
                        placeholder="Institution"
                        value={education.institution}
                        onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                    />
                </div>

                <div className="input-row">
                    <input
                        className="personal-input"
                        type="text"
                        placeholder="Graduation Year"
                        value={education.graduationYear}
                        onChange={(e) => setEducation({ ...education, graduationYear: e.target.value })}
                    />
                </div>

                <div className="input-row">
                    <button className="personal-input" onClick={prevStep}>Back</button>
                    <button className="personal-input" onClick={addEducation}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Education;
