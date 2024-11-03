import React, { useState } from 'react';
import axios from 'axios';

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
            setResponsibility(''); // Clear the input after adding
        }
    };

    const removeResponsibility = (index) => {
        // Remove responsibility from the current experience's responsibilities
        setCurrentExperience((prev) => ({
            ...prev,
            responsibilities: prev.responsibilities.filter((_, i) => i !== index),
        }));
    };

    const addExperience = () => {
        const newExperiences = [...experiences, currentExperience];
        setExperiences(newExperiences);
        saveExperience({ ...currentExperience, userId }); // Include userId when saving experience
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
        setResponsibility(''); // Clear the responsibility input
    };

    const saveExperience = async (experienceData) => {
        // Convert responsibilities array to a string (e.g., comma-separated)
        const responsibilitiesString = experienceData.responsibilities.join(', ');
        const dataToSend = {
            ...experienceData,
            responsibilities: responsibilitiesString // Include responsibilities as a string
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
        <div>
            <h2>Professional Experience</h2>
            <input 
                type="text" 
                placeholder="Company Name" 
                value={currentExperience.company} 
                onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })} 
            />
            <input 
                type="text" 
                placeholder="Position" 
                value={currentExperience.position} 
                onChange={(e) => setCurrentExperience({ ...currentExperience, position: e.target.value })} 
            />
            <input 
                type="date" 
                placeholder="Start Date" 
                value={currentExperience.startDate} 
                onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })} 
            />
            <input 
                type="date" 
                placeholder="End Date" 
                value={currentExperience.endDate} 
                onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })} 
            />
            <label>
                <input 
                    type="checkbox" 
                    checked={currentExperience.isCurrent} 
                    onChange={(e) => setCurrentExperience({ ...currentExperience, isCurrent: e.target.checked })} 
                />
                I am currently working here
            </label>

            {/* Responsibilities section */}
            <div>
                <h4>Responsibilities</h4>
                <input 
                    type="text" 
                    placeholder="Add a responsibility" 
                    value={responsibility} 
                    onChange={(e) => setResponsibility(e.target.value)} 
                />
                <button onClick={addResponsibility}>Add Responsibility</button>
                <ul>
                    {currentExperience.responsibilities.map((resp, index) => (
                        <li key={index}>
                            {resp}
                            <button onClick={() => removeResponsibility(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={addExperience}>Add Experience</button>
            <button onClick={prevStep}>Back</button>
            <button onClick={handleNext}>Next</button>

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
    );
};

export default Experience;
