import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobSearch.css";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", location: "" });
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState(new Set());
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    fetchAppliedJobs();
    fetchSavedJobs();
  }, [userId]);

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

  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/applications/${userId}`
      );
      setAppliedJobs(new Set(response.data));
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/saved-jobs/${userId}`
      );
      setSavedJobs(new Set(response.data.map((job) => job.job_id)));
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handleApply = async (jobId) => {
    if (appliedJobs.has(jobId)) {
      try {
        await axios.delete("http://localhost:5000/api/applications/applied", {
          data: { userId, jobId },
        });
        setAppliedJobs((prev) => {
          const updated = new Set(prev);
          updated.delete(jobId);
          return updated;
        });
      } catch (error) {
        console.error("Error unapplying for job:", error);
      }
    } else {
      try {
        await axios.post("http://localhost:5000/api/applications", {
          userId,
          jobId,
        });
        setAppliedJobs((prev) => new Set(prev).add(jobId));
      } catch (error) {
        console.error("Error applying for job:", error);
      }
    }
  };

  const handleSave = async (jobId) => {
    if (savedJobs.has(jobId)) {
      try {
        await axios.delete("http://localhost:5000/api/saved-jobs", {
          data: { userId, jobId },
        });
        setSavedJobs((prev) => {
          const updated = new Set(prev);
          updated.delete(jobId);
          return updated;
        });
      } catch (error) {
        console.error("Error unsaving job:", error);
      }
    } else {
      try {
        await axios.post("http://localhost:5000/api/saved-jobs", {
          userId,
          jobId,
        });
        setSavedJobs((prev) => new Set(prev).add(jobId));
      } catch (error) {
        console.error("Error saving job:", error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const categoryInput = document.getElementById("categoryInput").value.trim();
    const locationInput = document.getElementById("locationInput").value.trim();

    setFilters({
      category: categoryInput,
      location: locationInput,
    });
  };

  const handleClearFilters = () => {
    setFilters({ category: "", location: "" });
    document.getElementById("categoryInput").value = "";
    document.getElementById("locationInput").value = "";
  };

  const filteredJobs = jobs.filter((job) =>
    job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="job-postings-container">
      <main className="content">
        <div className="list-section">
          <h2>Job Search</h2>
          <form className="filters" onSubmit={handleSearch}>
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
            <button type="submit">Search</button>
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </form>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="job-cards-container">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div className="job-card" key={job.job_id}>
                  <h3 className="job-title">{job.job_title}</h3>
                  <p className="job-category">
                    <strong>Category:</strong> {job.job_category}
                  </p>
                  <p className="job-location">
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p className="job-salary">
                    <strong>Salary:</strong> {job.salary_range}
                  </p>
                  <button
                    className="apply-button"
                    onClick={() => handleApply(job.job_id)}
                  >
                    {appliedJobs.has(job.job_id) ? "Applied" : "Apply"}
                  </button>
                  <button
                    className="save-button"
                    onClick={() => handleSave(job.job_id)}
                  >
                    {savedJobs.has(job.job_id) ? "Saved" : "Save"}
                  </button>
                </div>
              ))
            ) : (
              <p>No jobs found matching your criteria.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSearch;
