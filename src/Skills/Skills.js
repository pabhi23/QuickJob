// Skills.js
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
        <>
            {/* SEO meta tags */}
            <head>
                <title>Skills Form | Add Your Expertise</title>
                <meta name="description" content="Add and manage your skills easily with our user-friendly skills input form." />
                <meta name="keywords" content="skills form, add skills, user skills, resume builder, form stepper" />
                <meta name="robots" content="index, follow" />
            </head>
            {/* Main Component */}
            <section className="form-wrapper">
                <div className="form-container" aria-label="Skills Input Form">
                    <h1 className="heading">Skills</h1>

                    <div className="input-row">
                        <label htmlFor="skill-input" className="sr-only">Add a new skill</label>
                        <input
                            id="skill-input"
                            className="personal-input"
                            type="text"
                            placeholder="Add a skill"
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            aria-label="Skill input box"
                        />
                        <button 
                            className="personal-input" 
                            onClick={addSkill} 
                            title="Add the entered skill to the list">
                            Add Skill
                        </button>
                    </div>

                    {/* Display added skills */}
                    <ul className="skills-list">
                        {formData.skills.map((s, index) => (
                            <li key={index} className="skill-item" aria-label={`Skill ${index + 1}: ${s}`}>{s}</li>
                        ))}
                    </ul>

                    {/* Navigation buttons */}
                    <div className="input-row">
                        <button 
                            className="personal-input" 
                            onClick={prevStep} 
                            title="Go back to the previous step">
                            Back
                        </button>
                        <button 
                            className="personal-input" 
                            onClick={handleSubmitWithDownload} 
                            title="Submit the form with added skills">
                            Submit
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Skills;