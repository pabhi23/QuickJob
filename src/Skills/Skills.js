import React, { useState } from 'react';
import '../PersonalInfo/PersonalInfo.css'; // Reuse the same CSS file for styling

const Skills = ({ prevStep, handleChange, formData, handleSubmit }) => {
    const [skill, setSkill] = useState('');

    const addSkill = () => {
        if (skill.trim()) {
            handleChange('skills', [...formData.skills, skill]);
            setSkill(''); // Clear input after adding
        }
    };

    const handleSubmitWithDownload = () => {
        addSkill(); // Add the last skill before submitting
        handleSubmit(); // Call the submit handler
    };

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <h2 className="heading">Skills</h2>

                <div className="input-row">
                    <input
                        className="personal-input"
                        type="text"
                        placeholder="Add a skill"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                    />
                    <button className="personal-input" onClick={addSkill}>Add Skill</button>
                </div>

                <ul className="skills-list">
                    {formData.skills.map((s, index) => (
                        <li key={index} className="skill-item">{s}</li>
                    ))}
                </ul>

                <div className="input-row">
                    <button className="personal-input" onClick={prevStep}>Back</button>
                    <button className="personal-input" onClick={handleSubmitWithDownload}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default Skills;