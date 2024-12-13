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
                {/* Primary Meta Tags */}
                <title>Upload Your Resume | QuickJob Portal</title>
                <meta name="description" content="Easily upload your resume to QuickJob and land your dream job! Securely upload PDF, DOC, and DOCX files and apply to top hiring companies effortlessly." />
                <meta name="keywords" content="resume upload, job portal, secure file upload, PDF upload, DOC upload, job application, QuickJob" />
                <meta name="author" content="QuickJob Team" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                {/* Open Graph / Facebook */}
                <meta property="og:title" content="Upload Your Resume | QuickJob Portal" />
                <meta property="og:description" content="Securely upload your resume in PDF, DOC, or DOCX formats to QuickJob and apply for top opportunities today." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.quickjob.com/upload" />
                <meta property="og:image" content="https://www.quickjob.com/assets/quickjob-resume-upload.png" />
                <meta property="og:site_name" content="QuickJob" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Upload Your Resume | QuickJob Portal" />
                <meta name="twitter:description" content="Easily upload your resume in PDF, DOC, or DOCX formats to QuickJob and start applying for your dream job today." />
                <meta name="twitter:image" content="https://www.quickjob.com/assets/quickjob-resume-upload.png" />
                <meta name="twitter:site" content="@QuickJob" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://www.quickjob.com/upload" />
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
