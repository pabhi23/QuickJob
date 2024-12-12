// Experience.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Experience.css';

const Experience = ({ nextStep, prevStep, handleChange, userId }) => {
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
        if (responsibility.trim()) {
            setCurrentExperience((prev) => ({
                ...prev,
                responsibilities: [...prev.responsibilities, responsibility.trim()],
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
        if (currentExperience.company && currentExperience.position) {
            const newExperiences = [...experiences, currentExperience];
            setExperiences(newExperiences);
            saveExperience({ ...currentExperience, userId });
            resetCurrentExperience();
        }
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
            responsibilities: responsibilitiesString,
        };

        try {
            await axios.post('http://localhost:5000/api/experience', dataToSend);
        } catch (error) {
            console.error('Error saving experience data:', error);
        }
    };

    const handleNext = () => {
        handleChange('experience', experiences);
        nextStep();
    };

    return (
        <div className="experience-wrapper">
            <h1 className="experience-heading">Professional Experience</h1>

            <div className="experience-form">
                <label className="form-label">Company Name</label>
                <input
                    type="text"
                    placeholder="Enter company name"
                    value={currentExperience.company}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                    className="experience-input"
                />

                <label className="form-label">Position</label>
                <input
                    type="text"
                    placeholder="Enter your position"
                    value={currentExperience.position}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, position: e.target.value })}
                    className="experience-input"
                />

                <div className="date-inputs">
                    <div className="date-group">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            value={currentExperience.startDate}
                            onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                            className="experience-input"
                        />
                    </div>

                    <div className="date-group">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            value={currentExperience.endDate}
                            onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                            className="experience-input"
                            disabled={currentExperience.isCurrent}
                        />
                    </div>
                </div>

                <div className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        checked={currentExperience.isCurrent}
                        onChange={(e) => setCurrentExperience({ ...currentExperience, isCurrent: e.target.checked })}
                    />
                    <label>I am currently working here</label>
                </div>

                <label className="form-label">Responsibilities</label>
                <div className="responsibilities-section">
                    <input
                        type="text"
                        placeholder="Add a responsibility"
                        value={responsibility}
                        onChange={(e) => setResponsibility(e.target.value)}
                        className="experience-input"
                    />
                    <button onClick={addResponsibility} className="add-responsibility-btn">Add</button>
                </div>

                <ul className="responsibilities-list">
                    {currentExperience.responsibilities.map((resp, index) => (
                        <li key={index} className="responsibility-item">
                            {resp}
                            <button onClick={() => removeResponsibility(index)} className="remove-btn">remove</button>
                        </li>
                    ))}
                </ul>

                <div className="experience-actions">
                    <button onClick={addExperience} className="action-btn">Add Experience</button>
                    <button onClick={prevStep} className="action-btn">Back</button>
                    <button onClick={handleNext} className="action-btn">Next</button>
                </div>

                <h2 className="added-experiences-heading">Added Experiences</h2>
                <ul className="experience-list">
                    {experiences.map((exp, index) => (
                        <li key={index} className="experience-item">
                            <strong>{exp.company}</strong> - {exp.position} ({exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate})
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
    );
};

export default Experience;