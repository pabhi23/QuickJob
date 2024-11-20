import React, { useState, useEffect } from "react";
import axios from "axios";
import "./JobAlertsPage.css";

const JobAlertsPage = () => {
  const [jobAlerts, setJobAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    keywords: "",
    location: "",
    category: "",
  });
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    fetchJobAlerts();
  }, []);

  const fetchJobAlerts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/job-alerts", {
        params: { user_id: userId },
      });
      setJobAlerts(response.data);
    } catch (error) {
      console.error("Error fetching job alerts:", error);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/job-alerts",
        {
          user_id: userId,
          ...newAlert,
        }
      );
      fetchJobAlerts();
      setNewAlert({ keywords: "", location: "", category: "" });
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating job alert:", error);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await axios.delete(`http://localhost:5000/api/job-alerts/${alertId}`);
      fetchJobAlerts();
    } catch (error) {
      console.error("Error deleting job alert:", error);
    }
  };

  return (
    <div className="job-alerts-page">
      <h2>My Job Alerts</h2>

      <form className="job-alert-form" onSubmit={handleCreateAlert}>
        <input
          type="text"
          placeholder="Keywords"
          value={newAlert.keywords}
          onChange={(e) =>
            setNewAlert({ ...newAlert, keywords: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={newAlert.location}
          onChange={(e) =>
            setNewAlert({ ...newAlert, location: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={newAlert.category}
          onChange={(e) =>
            setNewAlert({ ...newAlert, category: e.target.value })
          }
          required
        />
        <button type="submit">Create Alert</button>
      </form>

      <table className="job-alerts-table">
        <thead>
          <tr>
            <th>Keywords</th>
            <th>Location</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobAlerts.length > 0 ? (
            jobAlerts.map((alert) => (
              <tr key={alert.alert_id}>
                <td>{alert.keywords}</td>
                <td>{alert.location}</td>
                <td>{alert.category}</td>
                <td>
                  <button
                    onClick={() => handleDeleteAlert(alert.alert_id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No job alerts found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobAlertsPage;
