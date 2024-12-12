import React, { useState } from 'react';
import { Helmet } from 'react-helmet'; // Import Helmet for SEO
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
        <>
            {/* SEO Meta Tags */}
            <Helmet>
                <title>Upload Your Resume | QuickJob</title>
                <meta name="description" content="Upload your resume securely to QuickJob and apply for top job opportunities effortlessly. Accepted formats: PDF, DOC, DOCX." />
                <meta name="keywords" content="resume upload, job application, resume upload portal, PDF upload, DOC upload, QuickJob resume" />
                <meta name="author" content="QuickJob Team" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Upload Your Resume | QuickJob" />
                <meta property="og:description" content="Upload your resume securely to QuickJob and apply for top job opportunities effortlessly." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.quickjob.com/upload" />
                <meta property="og:image" content="https://www.quickjob.com/assets/resume-upload-preview.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>

            {/* Page Content */}
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
        </>
    );
};

export default ResumeUpload;
