import React, { useState } from 'react';
import axios from 'axios';
import '../ResumeUpload/ResumeUpload.css';

const ResumeUpload = ({ title }) => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setUploadStatus("Uploading...");
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setUploadStatus("Upload successful!");
            console.log("Uploaded file response:", response.data);
        } catch (error) {
            setUploadStatus("Upload failed. Please try again.");
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="upload-container">
            {title && <h2 className="heading">{title}</h2>}
            <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".pdf,.doc,.docx"
            />
            <button onClick={handleUpload} className="upload-button">Upload Resume</button>
            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>
    );
};

export default ResumeUpload;
