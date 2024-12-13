import React, { useState } from 'react';
import axios from 'axios';
import '../PersonalInfo/PersonalInfo.css'; // Reuse the same CSS file for consistent styling

const Experience = ({ nextStep, prevStep, handleChange, formData, userId }) => {
    const [experiences, setExperiences] = useState([]);
    const [currentExperience, setCurrentExperience] = useState({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        responsibilities: [],
    });

    const [responsibility, setResponsibility] = useState('');

    const addResponsibility = () => {
        if (responsibility) {
            setCurrentExperience((prev) => ({
                ...prev,
                responsibilities: [...prev.responsibilities, responsibility],
            }));
            setResponsibility(''); 
        }
    };

    const removeResponsibility = (index) => {
        setCurrentExperience((prev) => ({
            ...prev,
            responsibilities: prev.responsibilities.filter((_, i) => i !== index),
        }));
    };

    const addExperience = () => {
        const newExperiences = [...experiences, currentExperience];
        setExperiences(newExperiences);
        saveExperience({ ...currentExperience, userId });
        resetCurrentExperience();
    };

    const resetCurrentExperience = () => {
        setCurrentExperience({
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            responsibilities: [],
        });
        setResponsibility(''); 
    };

    const saveExperience = async (experienceData) => {
        const responsibilitiesString = experienceData.responsibilities.join(', ');
        const dataToSend = {
            ...experienceData,
            responsibilities: responsibilitiesString
        };

        try {
            const response = await axios.post('http://localhost:5000/api/experience', dataToSend);
            console.log(response.data);
        } catch (error) {
            console.error('Error saving experience data:', error);
        }
    };

    const handleNext = () => {
        handleChange('experience', experiences); // Pass the complete experiences array to the parent
        nextStep();
    };

    return (
        <>
            <head>
                <title>Professional Experience | Build Your Resume</title>
                <meta name="description" content="Add your professional experience details including company, position, responsibilities, and duration to build a comprehensive resume." />
                <meta name="keywords" content="professional experience, resume builder, work experience, job history, career details" />
                <meta name="robots" content="index, follow" />
            </head>
            <div className="form-wrapper">
                <div className="form-container" aria-label="Professional Experience Form">
                    <h2 className="heading">Professional Experience</h2>

                    <div className="input-row">
                        <label htmlFor="company" className="sr-only">Company Name</label>
                        <input
                            id="company"
                            className="personal-input"
                            type="text"
                            placeholder="Company Name"
                            value={currentExperience.company}
                            onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                        />
                        <label htmlFor="position" className="sr-only">Position</label>
                        <input
                            id="position"
                            className="personal-input"
                            type="text"
                            placeholder="Position"
                            value={currentExperience.position}
                            onChange={(e) => setCurrentExperience({ ...currentExperience, position: e.target.value })}
                        />
                    </div>

                    <div className="input-row">
                        <label htmlFor="startDate" className="sr-only">Start Date</label>
                        <input
                            id="startDate"
                            className="personal-input"
                            type="date"
                            placeholder="Start Date"
                            value={currentExperience.startDate}
                            onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                        />
                        <label htmlFor="endDate" className="sr-only">End Date</label>
                        <input
                            id="endDate"
                            className="personal-input"
                            type="date"
                            placeholder="End Date"
                            value={currentExperience.endDate}
                            onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                        />
                    </div>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={currentExperience.isCurrent}
                            onChange={(e) => setCurrentExperience({ ...currentExperience, isCurrent: e.target.checked })}
                        />
                        I am currently working here
                    </label>

                    <div className="input-row">
                        <label htmlFor="responsibility" className="sr-only">Add Responsibility</label>
                        <input
                            id="responsibility"
                            className="personal-input"
                            type="text"
                            placeholder="Add a responsibility"
                            value={responsibility}
                            onChange={(e) => setResponsibility(e.target.value)}
                        />
                        <button className="personal-input" onClick={addResponsibility} title="Add responsibility to the list">
                            Add Responsibility
                        </button>
                    </div>

                    <ul className="responsibilities-list">
                        {currentExperience.responsibilities.map((resp, index) => (
                            <li key={index} className="responsibility-item">
                                {resp}
                                <button 
                                    className="remove-btn" 
                                    onClick={() => removeResponsibility(index)}
                                    title="Remove responsibility">
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="input-row">
                        <button className="personal-input" onClick={addExperience} title="Add this experience">Add Experience</button>
                        <button className="personal-input" onClick={prevStep} title="Go to the previous step">Back</button>
                        <button className="personal-input" onClick={handleNext} title="Proceed to the next step">Next</button>
                    </div>

                    <h3>Added Experiences</h3>
                    <ul>
                        {experiences.map((exp, index) => (
                            <li key={index}>
                                {exp.company} - {exp.position} ({exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate})
                                <ul>
                                    {exp.responsibilities.map((resp, respIndex) => (
                                        <li key={respIndex}>{resp}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Experience;