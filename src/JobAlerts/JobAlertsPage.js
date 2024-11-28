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
  const [isListening, setIsListening] = useState(false);
  const [currentInput, setCurrentInput] = useState(null);

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

  const startListening = (field) => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

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
      setNewAlert((prev) => ({
        ...prev,
        [field]: speechResult,
      }));
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="job-alerts-page">
      <h2>My Job Alerts</h2>
      <div className="job-alerts-container">
        <div className="form-container">
          <form className="job-alert-form" onSubmit={handleCreateAlert}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Keywords"
                value={newAlert.keywords}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, keywords: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => startListening("keywords")}
                className="mic-button"
              >
                🎤
              </button>
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Location"
                value={newAlert.location}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, location: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => startListening("location")}
                className="mic-button"
              >
                🎤
              </button>
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Category"
                value={newAlert.category}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, category: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => startListening("category")}
                className="mic-button"
              >
                🎤
              </button>
            </div>
            <button type="submit" className="create-alert-button">
              Create Alert
            </button>
          </form>
        </div>
        <div className="table-container">
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
      </div>
    </div>
  );
};

export default JobAlertsPage;
