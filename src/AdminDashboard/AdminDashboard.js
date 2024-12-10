import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { apiClient } from "../api/apiClient";

const AdminDashboard = () => {
  const [jobList, setJobList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const registerAs = sessionStorage.getItem("registerAs");

    if (registerAs !== "employer") {
      navigate("/");
    }

    // Fetch job data from API
    const fetchJobList = async () => {
      try {
        const response = await apiClient.get("/admin/dashboard");
        if (!response) {
          throw new Error("Failed to fetch job listings");
        }
        const data = response.data;

        // Fetch and set initial status from localStorage for each job
        const updatedData = data.map((job) => {
          const storedStatus = localStorage.getItem(`job-status-${job.job_id}`);
          return {
            ...job,
            status: storedStatus ? storedStatus : job.status, // Use stored status or default job status
          };
        });

        setJobList(updatedData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobList();
  }, [navigate]);

  const handleStatusChange = async (jobId) => {
    try {
      // Toggle the job status between "Active" and "Closed"
      const updatedJobList = jobList.map((job) => {
        if (job.job_id === jobId) {
          const newStatus = job.status === "Active" ? "Closed" : "Active";

          // Update the status in localStorage for persistence
          localStorage.setItem(`job-status-${jobId}`, newStatus);

          // Update the status in jobList
          return { ...job, status: newStatus };
        }
        return job;
      });

      // Update state with the new job status
      setJobList(updatedJobList);
    } catch (error) {
      console.error("Error toggling job status:", error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <table className="job-table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Job Posting Date</th>
            <th>No. of Applicants</th>
            <th>Applicant Statuses</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobList.map((job) => (
            <tr key={job.job_id}>
              <td>{job.job_title || "N/A"}</td>
              <td>
                {new Date(job.posting_date).toLocaleDateString() || "N/A"}
              </td>
              <td>{job.applicants_count || 0}</td>
              <td>{job.applicant_statuses || "N/A"}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
