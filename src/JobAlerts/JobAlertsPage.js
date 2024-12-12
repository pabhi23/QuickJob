import React, { useState, useEffect } from "react";
import { apiClient } from "../api/apiClient"; // Ensure this path is correct
import "./JobAlertsPage.css"; // Ensure the CSS file is correctly imported

const JobAlertsPage = () => {
  const [jobAlerts, setJobAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    keywords: "",
    location: "",
    category: "",
  });
  const [editingAlert, setEditingAlert] = useState(null); // Holds the alert being edited
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const userId = sessionStorage.getItem("user_id"); // Ensure this key is correct

  useEffect(() => {
    fetchJobAlerts();
  }, []);

  // Fetch job alerts from the backend
  const fetchJobAlerts = async () => {
    try {
      const response = await apiClient.get("/job-alerts", {
        params: { user_id: userId },
      });
      setJobAlerts(response.data);
    } catch (error) {
      console.error("Error fetching job alerts:", error);
      alert("Failed to fetch job alerts. Please try again later.");
    }
  };

  // Handle creating a new job alert
  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/job-alerts", {
        user_id: userId,
        ...newAlert,
      });
      fetchJobAlerts();
      setNewAlert({ keywords: "", location: "", category: "" });
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating job alert:", error);
      alert("Failed to create job alert. Please try again.");
    }
  };

  // Handle deleting a job alert
  const handleDeleteAlert = async (alertId) => {
    if (window.confirm("Are you sure you want to delete this alert?")) {
      try {
        await apiClient.delete(`/job-alerts/${alertId}`);
        fetchJobAlerts();
        alert("Job alert deleted successfully.");
      } catch (error) {
        console.error("Error deleting job alert:", error);
        alert("Failed to delete job alert. Please try again.");
      }
    }
  };

  // Handle initiating the edit process
  const handleEditAlert = (alert) => {
    console.log("Editing Alert:", alert); // Debugging line
    setEditingAlert(alert);
    setNewAlert({
      keywords: alert.keywords,
      location: alert.location,
      category: alert.category,
    });
    setShowModal(true);
  };

  // Handle updating the job alert
  const handleUpdateAlert = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.put(
        `/job-alerts/${editingAlert.alert_id}`,
        { ...newAlert }
      );
      fetchJobAlerts();
      setShowModal(false);
      setEditingAlert(null);
      setNewAlert({ keywords: "", location: "", category: "" });
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating job alert:", error);
      alert("Failed to update job alert. Please try again.");
    }
  };

  // Close the modal and reset states
  const closeModal = () => {
    setShowModal(false);
    setEditingAlert(null);
    setNewAlert({ keywords: "", location: "", category: "" });
  };

  return (
    <div className="job-alerts-page-container">
      <h2 className="page-title">Manage Your Job Alerts</h2>

      {/* Create Alert Form */}
      <form className="alert-form" onSubmit={handleCreateAlert}>
        <div className="form-group">
          <label htmlFor="keywords">Keywords</label>
          <input
            type="text"
            id="keywords"
            placeholder="Enter keywords"
            value={newAlert.keywords}
            onChange={(e) =>
              setNewAlert({ ...newAlert, keywords: e.target.value })
            }
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter location"
            value={newAlert.location}
            onChange={(e) =>
              setNewAlert({ ...newAlert, location: e.target.value })
            }
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            placeholder="Enter category"
            value={newAlert.category}
            onChange={(e) =>
              setNewAlert({ ...newAlert, category: e.target.value })
            }
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="create-alert-btn">
          Create Alert
        </button>
      </form>

      {/* Job Alerts List */}
      <div className="job-alerts-list">
        {jobAlerts.length > 0 ? (
          jobAlerts.map((alert) => (
            <div className="alert-card" key={alert.alert_id}>
              <h3 className="alert-keywords">{alert.keywords}</h3>
              <p className="alert-info">
                <strong>Location:</strong> {alert.location}
              </p>
              <p className="alert-info">
                <strong>Category:</strong> {alert.category}
              </p>
              <div className="alert-actions">
                <button
                  onClick={() => handleEditAlert(alert)}
                  className="edit-alert-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAlert(alert.alert_id)}
                  className="delete-alert-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-alerts">No job alerts available.</p>
        )}
      </div>

      {/* Modal Popup for Editing Alert */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h3>Edit Job Alert</h3>
            <form onSubmit={handleUpdateAlert} className="modal-form">
              <div className="form-group">
                <label htmlFor="edit-keywords">Keywords</label>
                <input
                  type="text"
                  id="edit-keywords"
                  placeholder="Enter keywords"
                  value={newAlert.keywords}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, keywords: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-location">Location</label>
                <input
                  type="text"
                  id="edit-location"
                  placeholder="Enter location"
                  value={newAlert.location}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, location: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <input
                  type="text"
                  id="edit-category"
                  placeholder="Enter category"
                  value={newAlert.category}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, category: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="update-alert-btn">
                  Update Alert
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAlertsPage;
