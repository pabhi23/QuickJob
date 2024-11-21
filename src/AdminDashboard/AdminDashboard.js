import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [jobList, setJobList] = useState([
    {
      job_id: 1,
      job_title: "Software Engineer",
      posting_date: "2024-11-15",
      skills: "JavaScript, React",
      applicants: 5,
      status: "Active",
    },
    {
      job_id: 2,
      job_title: "Product Manager",
      posting_date: "2024-11-10",
      skills: "Agile, Scrum",
      applicants: 8,
      status: "Closed",
    },
    {
      job_id: 3,
      job_title: "Full Stack Developer",
      posting_date: "2024-11-05",
      skills: "Node.js, React",
      applicants: 10,
      status: "Active",
    },
  ]); // Static data for jobs
  const navigate = useNavigate();

  useEffect(() => {
    const registerAs = sessionStorage.getItem("registerAs");

    if (registerAs !== "employer") {
      navigate("/");
    }
  }, [navigate]);

  const handleModify = (jobId) => {
    console.log(`Modify job with ID: ${jobId}`);
  };

  const handleStatusChange = (jobId) => {
    setJobList((prevList) =>
      prevList.map((job) =>
        job.job_id === jobId
          ? { ...job, status: job.status === "Active" ? "Closed" : "Active" }
          : job
      )
    );
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <table className="job-table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Job Posting Date</th>
            <th>Skills</th>
            <th>No. of Applicants</th>
            <th>Status</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {jobList.map((job) => (
            <tr key={job.job_id}>
              <td>{job.job_title || "N/A"}</td>
              <td>{job.posting_date || "N/A"}</td>
              <td>{job.skills || "N/A"}</td>
              <td>{job.applicants || 0}</td>
              <td>
                <button
                  className={`status-button ${
                    job.status === "Active" ? "active" : "closed"
                  }`}
                  onClick={() => handleStatusChange(job.job_id)}
                >
                  {job.status || "No Status"}
                </button>
              </td>
              <td>
                <button
                  className="modify-button"
                  onClick={() => handleModify(job.job_id)}
                >
                  Modify
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
