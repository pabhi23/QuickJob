import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobPostings.css";

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    job_title: "",
    job_description: "",
    job_category: "",
    location: "",
    salary_range: "",
    requirements: "",
  });
  const [filters, setFilters] = useState({ category: "", location: "" });
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentInput, setCurrentInput] = useState(null);

  const employerId = sessionStorage.getItem("employerId");

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        params: { ...filters },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/jobs", {
        employer_id: employerId,
        ...newJob,
      });
      fetchJobs();
      setNewJob({
        job_title: "",
        job_description: "",
        job_category: "",
        location: "",
        salary_range: "",
        requirements: "",
      });
      setAccordionOpen(false);
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const startListening = (field) => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentInput(field);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setNewJob((prev) => ({
        ...prev,
        [field]: speechResult,
      }));
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="job-postings-container">
      <main className="content">
        <div className="accordion">
          <button
            className="accordion-header"
            onClick={() => setAccordionOpen(!accordionOpen)}
          >
            {accordionOpen ? "Close Create Job Form" : "Open Create Job Form"}
          </button>
          {accordionOpen && (
            <div className="accordion-content">
              <form className="job-form" onSubmit={handleCreateJob}>
                {[
                  { name: "job_title", placeholder: "Job Title" },
                  { name: "job_description", placeholder: "Job Description", type: "textarea" },
                  { name: "job_category", placeholder: "Category" },
                  { name: "location", placeholder: "Location" },
                  { name: "salary_range", placeholder: "Salary Range" },
                  { name: "requirements", placeholder: "Requirements", type: "textarea" },
                ].map((field, index) => (
                  <div className="input-group" key={index}>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        value={newJob[field.name]}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <input
                        name={field.name}
                        placeholder={field.placeholder}
                        value={newJob[field.name]}
                        onChange={handleInputChange}
                        required
                      />
                    )}
                    <button
                      type="button"
                      className="mic-button"
                      onClick={() => startListening(field.name)}
                    >
                      🎤
                    </button>
                  </div>
                ))}
                <button type="submit" className="create-job-button">
                  Create Job
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="list-section">
          <h2>Job Postings</h2>
          <form className="filters">
            <input
              id="categoryInput"
              type="text"
              placeholder="Search by Category"
              defaultValue={filters.category}
            />
            <input
              id="locationInput"
              type="text"
              placeholder="Search by Location"
              defaultValue={filters.location}
            />
            <button type="submit" onClick={fetchJobs}>
              Search
            </button>
          </form>
          <table className="job-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.job_id}>
                  <td>{job.job_title}</td>
                  <td>{job.job_category}</td>
                  <td>{job.location}</td>
                  <td>{job.salary_range}</td>
                  <td>
                    <button className="btn">Edit</button>
                    <button className="btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default JobPostings;
