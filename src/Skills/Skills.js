import React, { useState } from 'react';

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
        <div>
            <h2>Skills</h2>
            <input 
                type="text" 
                placeholder="Skill" 
                value={skill} 
                onChange={(e) => setSkill(e.target.value)} 
            />
            <button onClick={addSkill}>Add Skill</button>
            <ul>
                {formData.skills.map((s, index) => (
                    <li key={index}>{s}</li>
                ))}
            </ul>
            <button onClick={prevStep}>Back</button>
            <button onClick={handleSubmitWithDownload}>Submit</button>
        </div>
    );
};

export default Skills;

