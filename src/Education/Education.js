import React, { useState } from 'react';

const Education = ({ nextStep, prevStep, handleChange, formData }) => {
    const [education, setEducation] = useState({
        degree: '',
        institution: '',
        graduationYear: '',
    });

    const addEducation = () => {
        handleChange('education', [...formData.education, education]);
        nextStep();
    };

    return (
        <div>
            <h2>Education</h2>
            <input type="text" placeholder="Degree" value={education.degree} onChange={(e) => setEducation({ ...education, degree: e.target.value })} />
            <input type="text" placeholder="Institution" value={education.institution} onChange={(e) => setEducation({ ...education, institution: e.target.value })} />
            <input type="text" placeholder="Graduation Year" value={education.graduationYear} onChange={(e) => setEducation({ ...education, graduationYear: e.target.value })} />
            <button onClick={prevStep}>Back</button>
            <button onClick={addEducation}>Next</button>
        </div>
    );
};

export default Education;
