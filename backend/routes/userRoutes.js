const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const router = express.Router();
const sendEmail = require("../utils/emailService");

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;
  console.log("Received data:", req.body);

  if (!firstName || !lastName || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Error hashing password" });
    }

    const sql =
      "INSERT INTO users (firstName, lastName, email, password, registerAs) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [firstName, lastName, email, hashedPassword, userType],
      (err, result) => {
        if (err) {
          console.error("Error saving user:", err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already registered" });
          }
          return res.status(500).json({ error: "Error saving user" });
        }
        console.log("User registered with ID:", result.insertId);
        return res.status(201).json({
          message: "User registered successfully!",
          user_id: result.insertId,
        });
      }
    );
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Server error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.status(200).json({
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        registerAs: user.registerAs,
      });
    }
  );
});

router.post("/forget-password", async (req, res) => {
  const { email, newPassword } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Email does not exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      db.query(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashedPassword, email],
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Server error" });
          }
          res.status(200).json({ message: "Password updated successfully" });
        }
      );
    }
  );
});
router.put("/jobs/:id", (req, res) => {
  const { id } = req.params; // Extract the job ID from the route parameter
  const {
    job_title,
    job_description,
    job_category,
    location,
    salary_range,
    requirements,
  } = req.body; // Extract updated job details from the request body

  // Validate required fields
  if (
    !job_title ||
    !job_description ||
    !job_category ||
    !location ||
    !salary_range ||
    !requirements
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const updateQuery = `
    UPDATE jobs 
    SET 
      job_title = ?, 
      job_description = ?, 
      job_category = ?, 
      location = ?, 
      salary_range = ?, 
      requirements = ?
    WHERE job_id = ?
  `;

  db.query(
    updateQuery,
    [
      job_title,
      job_description,
      job_category,
      location,
      salary_range,
      requirements,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating job:", err);
        return res.status(500).json({ error: "Error updating job" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.status(200).json({ message: "Job updated successfully" });
    }
  );
});

router.get("/jobs", (req, res) => {
  const { category, location } = req.query;

  const query = `
    SELECT * FROM jobs
    WHERE (job_category LIKE ? OR ? = '')
      AND (location LIKE ? OR ? = '');
  `;

  db.query(
    query,
    [`%${category}%`, category, `%${location}%`, location],
    (err, results) => {
      if (err) {
        console.error("Error fetching jobs:", err);
        return res.status(500).json({ error: "Error fetching jobs" });
      }
      res.json(results);
    }
  );
});

const fetchAllAlertsQuery = `
  SELECT * FROM job_alerts
`;
db.query(fetchAllAlertsQuery, (alertsErr, allAlerts) => {
  console.log("All User Alerts in Database:", allAlerts);
});

router.post("/jobs", (req, res) => {
  const {
    job_title,
    job_description,
    job_category,
    location,
    salary_range,
    requirements,
    employer_id,
  } = req.body;

  console.log("Received Job Data:", req.body);
  if (
    !job_title ||
    !job_description ||
    !job_category ||
    !location ||
    !salary_range ||
    !requirements ||
    !employer_id
  ) {
    console.error("Validation failed. Missing fields in job data.");
    return res.status(400).json({ error: "All fields are required" });
  }

  const insertQuery = `
    INSERT INTO jobs (job_title, job_description, job_category, location, salary_range, requirements, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    insertQuery,
    [
      job_title,
      job_description,
      job_category,
      location,
      salary_range,
      requirements,
      employer_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating job:", err);
        return res.status(500).json({ error: "Error creating job" });
      }

      const jobId = result.insertId;
      console.log("Job created with ID:", jobId);

      const fetchAllAlertsQuery = "SELECT * FROM job_alerts";
      db.query(fetchAllAlertsQuery, (alertsErr, allAlerts) => {
        if (alertsErr) {
          console.error("Error fetching all alerts:", alertsErr);
          return res
            .status(500)
            .json({ error: "Error fetching all alerts for testing" });
        }
        console.log("All User Alerts in Database:", allAlerts);

        res.status(201).json({
          message: "Job created successfully, notifications sent to users!",
          job_id: jobId,
        });
      });
    }
  );
});

router.delete("/jobs/:id", (req, res) => {
  const jobId = req.params.id;

  db.query("DELETE FROM jobs WHERE job_id = ?", [jobId], (err) => {
    if (err) return res.status(500).json({ error: "Error deleting job" });
    res.status(200).json({ message: "Job deleted successfully" });
  });
});
router.put("/jobs/:id/toggle-status", (req, res) => {
  const { id } = req.params;

  // Fetch the current status of the job
  const getStatusQuery = `SELECT status FROM jobs WHERE job_id = ?`;
  db.query(getStatusQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching job status:", err);
      return res.status(500).json({ error: "Error fetching job status" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Toggle the status
    const currentStatus = results[0].status;
    const newStatus = currentStatus === "Active" ? "Closed" : "Active";

    // Update the job status
    const updateQuery = `UPDATE jobs SET status = ? WHERE job_id = ?`;
    db.query(updateQuery, [newStatus, id], (updateErr) => {
      if (updateErr) {
        console.error("Error updating job status:", updateErr);
        return res.status(500).json({ error: "Error updating job status" });
      }
      res.status(200).json({
        message: `Job status updated successfully to ${newStatus}`,
        status: newStatus,
      });
    });
  });
});

router.get("/job-alerts", (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = `
    SELECT job_alerts.alert_id, job_alerts.keywords, job_alerts.location, job_alerts.category
    FROM job_alerts
    WHERE job_alerts.user_id = ?
  `;
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching job alerts:", err);
      return res.status(500).json({ error: "Error fetching job alerts" });
    }
    res.json(results);
  });
});

router.post("/job-alerts", (req, res) => {
  const { user_id, keywords, location, category } = req.body;

  if (!user_id || !keywords || !location || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO job_alerts (user_id, keywords, location, category)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [user_id, keywords, location, category], (err, result) => {
    if (err) {
      console.error("Error creating job alert:", err);
      return res.status(500).json({ error: "Error creating job alert" });
    }
    res.status(201).json({
      message: "Job alert created successfully",
      alert_id: result.insertId,
    });
  });
});

router.delete("/job-alerts/:id", (req, res) => {
  const alert_id = req.params.id;

  const query = "DELETE FROM job_alerts WHERE alert_id = ?";
  db.query(query, [alert_id], (err) => {
    if (err) {
      console.error("Error deleting job alert:", err);
      return res.status(500).json({ error: "Error deleting job alert" });
    }
    res.json({ message: "Job alert deleted successfully" });
  });
});

// Fetch All Payments
router.get("/payments", (req, res) => {
  const query = "SELECT * FROM payments";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching payments:", err);
      return res.status(500).json({ error: "Error fetching payments" });
    }
    res.json(results);
  });
});

module.exports = router;
