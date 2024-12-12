import React, { useState } from "react";
import PersonalInfo from "../PersonalInfo/PersonalInfo.js";
import Experience from "../Experience/Experience.js";
import Education from "../Education/Education.js";
import Skills from "../Skills/Skills.js";
import { jsPDF } from "jspdf";

const ResumeBuilder = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    jobTitle: "",
    linkedinId: "",
    phone: "",
    email: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (input, value) => {
    setFormData({ ...formData, [input]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resume saved:", data);
      generatePDF();
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("There was an error saving your resume. Please try again.");
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    pdf.setFont("Times", "Normal");

    let currentY = 20; // Starting Y position for text

    const addPageIfNeeded = () => {
      if (currentY > 280) {
        // Adjust this threshold if necessary
        pdf.addPage();
        currentY = 20; // Reset Y position for new page
      }
    };

    // Header Information
    pdf.setFontSize(16);
    pdf.text(`${formData.firstName} ${formData.lastName}`, 105, currentY, {
      align: "center",
    });
    currentY += 10;

    pdf.setFontSize(12);
    pdf.text(`Desired Job Title: ${formData.jobTitle}`, 105, currentY, {
      align: "center",
    });
    currentY += 10;
    pdf.text(`Address: ${formData.address}`, 105, currentY, {
      align: "center",
    });
    currentY += 5;
    pdf.text(`Phone: ${formData.phone || ""}`, 105, currentY, {
      align: "center",
    });
    currentY += 5;
    pdf.text(`Email: ${formData.email || ""}`, 105, currentY, {
      align: "center",
    });
    currentY += 15;

    // Summary Section
    pdf.setLineWidth(0.5);
    pdf.line(20, currentY, 190, currentY);
    currentY += 10;
    pdf.setFontSize(14);
    pdf.text("Summary", 20, currentY);
    currentY += 7;

    pdf.setFontSize(12);
    const summaryLines = pdf.splitTextToSize(formData.summary, 170);
    pdf.text(summaryLines, 20, currentY);
    currentY += summaryLines.length * 5 + 5;
    addPageIfNeeded();

    // Technical Skills Section
    pdf.setFontSize(14);
    pdf.text("Technical Skills", 20, currentY);
    currentY += 10;
    pdf.setFontSize(12);
    formData.skills.forEach((skill) => {
      pdf.text(`- ${skill}`, 20, currentY);
      currentY += 5;
      addPageIfNeeded();
    });
    currentY += 10;

    // Professional Experience Section
    pdf.setFontSize(14);
    pdf.text("Professional Experience", 20, currentY);
    currentY += 10;
    pdf.setFontSize(12);
    formData.experience.forEach((exp) => {
      pdf.text(
        `${exp.position} at ${exp.company} (${exp.startDate} - ${
          exp.endDate || "Present"
        })`,
        20,
        currentY
      );
      currentY += 5;
      addPageIfNeeded();

      exp.responsibilities.forEach((resp) => {
        const wrappedText = pdf.splitTextToSize(resp, 160);

        wrappedText.forEach((line) => {
          pdf.circle(18, currentY, 0.5); // Bullet point
          pdf.text(line, 22, currentY);
          currentY += 5;
          addPageIfNeeded();
        });

        currentY += 3;
      });

      currentY += 10;
    });

    // Education Section
    pdf.setFontSize(14);
    pdf.text("Education", 20, currentY);
    currentY += 10;
    pdf.setFontSize(12);
    formData.education.forEach((edu) => {
      pdf.text(
        `${edu.degree} from ${edu.institution} (${edu.graduationYear})`,
        20,
        currentY
      );
      currentY += 10;
      addPageIfNeeded();
    });

    // Save PDF
    pdf.save("resume.pdf");
  };

  return (
    <div>
      {step === 1 && (
        <PersonalInfo
          nextStep={nextStep}
          handleChange={handleChange}
          formData={formData}
        />
      )}
      {step === 2 && (
        <Experience
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          formData={formData}
        />
      )}
      {step === 3 && (
        <Education
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          formData={formData}
        />
      )}
      {step === 4 && (
        <Skills
          prevStep={prevStep}
          handleChange={handleChange}
          formData={formData}
          handleSubmit={handleSubmit}
        />
      )}
      {step === 5 && <button onClick={handleSubmit}>Submit Resume</button>}
    </div>
  );
};

export default ResumeBuilder;
