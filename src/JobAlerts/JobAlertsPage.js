import React, { useState } from "react";
import "./JobAlertsPage.css";

const JobAlertsPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJobAlertSubscription = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      // API call would go here
      alert(`Job alerts turned on for: ${email}`);
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to job alerts:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="job-alerts-container">
      <form
        className="job-alert-subscription"
        onSubmit={handleJobAlertSubscription}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for job alerts"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="subscribe-button"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe to Job Alerts"}
        </button>
      </form>
    </div>
  );
};

export default JobAlertsPage;
