const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const router = express.Router();
const sendEmail = require("../utils/emailService");
const connection = require("../config/db");

// Admin dashboard data - fetch job details, applicants, and application statuses
router.get("/admin/dashboard", (req, res) => {
  const query = `
SELECT 
    jobs.job_id, 
    jobs.job_title, 
    jobs.posted_at AS posting_date, 
    COUNT(applications.application_id) AS applicants_count, 
    GROUP_CONCAT(applicants.status ORDER BY applicants.reviewed_at) AS applicant_statuses
FROM 
    jobs
LEFT JOIN applications ON jobs.job_id = applications.job_id
LEFT JOIN applicants ON jobs.job_id = applicants.job_id
GROUP BY 
    jobs.job_id;



    `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching admin dashboard data:", err);
      return res.status(500).send("Error fetching dashboard data");
    }
    res.status(200).json(result); // Return the combined data for the dashboard
  });
});

module.exports = router;
