const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const router = express.Router();
const sendEmail = require("../utils/emailService");
const connection = require("../config/db");

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
      console.log(user);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.status(200).json({
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        registerAs: user.registerAs,
        profilePic: user.profile_pic,
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
db.query(fetchAllAlertsQuery, (alertsErr, allAlerts) => {});

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

  // Validate required fields
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

      // Fetch all user alerts for job matching
      const fetchAllAlertsQuery = `SELECT * FROM job_alerts`;
      db.query(fetchAllAlertsQuery, (alertsErr, allAlerts) => {
        if (alertsErr) {
          console.error("Error fetching all alerts:", alertsErr);
          return res
            .status(500)
            .json({ error: "Error fetching all alerts for testing" });
        }

        // Fetch matching alerts
        const matchQuery = `
          SELECT u.email, a.keywords, a.location, a.category
          FROM job_alerts a
          JOIN users u ON a.user_id = u.user_id
          WHERE 
            (
              a.keywords = '' OR 
              EXISTS (
                SELECT 1 FROM (
                  SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(a.keywords, ',', n.n), ',', -1)) AS keyword
                  FROM job_alerts a
                  JOIN (
                    SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                  ) n
                  WHERE n.n <= 1 + LENGTH(a.keywords) - LENGTH(REPLACE(a.keywords, ',', ''))
                ) kw
                WHERE ? LIKE CONCAT('%', TRIM(kw.keyword), '%')
              )
            )
            AND (? LIKE CONCAT('%', TRIM(a.location), '%') OR a.location = '')
            AND (? LIKE CONCAT('%', TRIM(a.category), '%') OR a.category = '')
        `;

        db.query(
          matchQuery,
          [job_title, location, job_category],
          (alertErr, matches) => {
            if (alertErr) {
              console.error("Error fetching matching alerts:", alertErr);
              return res
                .status(500)
                .json({ error: "Error finding matching alerts" });
            }

            console.log("All matching alerts:", matches);

            // Send email notifications asynchronously
            if (matches.length > 0) {
              console.log("Preparing email for:", matches[0].email);
              const subject = `New Job Posting: ${job_title}`;
              const text = `
                A new job posting matches your alert criteria:
                - Job Title: ${job_title}
                - Location: ${location}
                - Category: ${job_category}
                - Salary Range: ${salary_range}
                - Description: ${job_description}
                
                Visit Quick Job to apply now!
              `;
              const html = `
                <h1>New Job Posting Matches Your Alert</h1>
                <p><strong>Job Title:</strong> ${job_title}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Category:</strong> ${job_category}</p>
                <p><strong>Salary Range:</strong> ${salary_range}</p>
                <p><strong>Description:</strong> ${job_description}</p>
                <p>Visit <a href="https://quickjob.com">Quick Job</a> to apply now!</p>
              `;

              // Simulate asynchronous email sending with setImmediate
              setImmediate(() => {
                sendEmail(matches[0].email, subject, text, html)
                  .then(() => console.log(`Email sent to: ${matches[0].email}`))
                  .catch((err) => console.error("Error sending email:", err));
              });
            }
          }
        );
      });

      // Respond to the client immediately (job creation is complete)
      res.status(201).json({ message: "Job created successfully!" });
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
// Update Job Alert
router.put("/job-alerts/:alertId", (req, res) => {
  const { alertId } = req.params;
  const { keywords, location, category } = req.body;

  const sql =
    "UPDATE job_alerts SET keywords = ?, location = ?, category = ? WHERE alert_id = ?";

  db.query(sql, [keywords, location, category, alertId], (err, result) => {
    if (err) {
      console.error("Error updating job alert:", err);
      return res.status(500).json({ error: "Error updating job alert" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job alert not found" });
    }
    res.status(200).json({ message: "Job alert updated successfully!" });
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
router.get("/applications/history/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT a.application_id, a.status, a.applied_at, j.job_title
    FROM applications a
    JOIN jobs j ON a.job_id = j.job_id
    WHERE a.user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching application history:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch application history" });
    }
    res.status(200).json(results);
  });
});

// Apply Job
router.post("/applications", (req, res) => {
  const { jobId, userId } = req.body;

  console.log("Payload received by backend:", req.body);

  if (!jobId || !userId) {
    return res.status(400).json({ error: "Job ID and User ID are required" });
  }

  const checkQuery =
    "SELECT * FROM applications WHERE user_id = ? AND job_id = ?";
  connection.query(checkQuery, [userId, jobId], (err, results) => {
    if (err) {
      console.error("Error checking for existing application:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: "Application already exists!" });
    }

    const insertQuery = `
        INSERT INTO applications (user_id, job_id, status)
        VALUES (?, ?, 'applied');
      `;
    connection.query(insertQuery, [userId, jobId], (err, result) => {
      if (err) {
        console.error("Error applying for the job:", err);
        return res.status(500).json({ error: "Failed to apply for the job" });
      }
      res.status(201).json({ message: "Application successful!" });
    });
  });
});

router.get("/applications/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `SELECT job_id FROM applications WHERE user_id = ? AND status = 'applied'`;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching applied jobs:", err);
      return res.status(500).json({ error: "Failed to fetch applied jobs" });
    }
    const appliedJobs = results.map((row) => row.job_id);
    res.status(200).json(appliedJobs);
  });
});

router.delete("/applications/applied", (req, res) => {
  const { jobId, userId } = req.body;

  if (!jobId || !userId) {
    return res.status(400).json({ error: "Job ID and User ID are required" });
  }

  const query = `DELETE FROM applications WHERE user_id = ? AND job_id = ?`;

  connection.query(query, [userId, jobId], (err, result) => {
    if (err) {
      console.error("Error unapplying for the job:", err);
      return res.status(500).json({ error: "Failed to unapply for the job" });
    }
    res.status(200).json({ message: "Unapplied successfully!" });
  });
});

// Save a job
router.post("/saved-jobs", (req, res) => {
  const { jobId, userId } = req.body;

  console.log("Payload received by backend:", req.body);

  if (!jobId || !userId) {
    return res.status(400).json({ error: "Job ID and User ID are required" });
  }

  const checkQuery =
    "SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?";
  connection.query(checkQuery, [userId, jobId], (err, results) => {
    if (err) {
      console.error("Error checking for existing saved job:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: "Job already saved!" });
    }

    const insertQuery = `
      INSERT INTO saved_jobs (user_id, job_id)
      VALUES (?, ?);
    `;
    connection.query(insertQuery, [userId, jobId], (err, result) => {
      if (err) {
        console.error("Error saving the job:", err);
        return res.status(500).json({ error: "Failed to save the job" });
      }
      res.status(201).json({ message: "Job saved successfully!" });
    });
  });
});

// Delete a saved job
router.delete("/saved-jobs", (req, res) => {
  const { jobId, userId } = req.body;

  if (!jobId || !userId) {
    return res.status(400).json({ error: "Job ID and User ID are required" });
  }

  const query = `
    DELETE FROM saved_jobs
    WHERE user_id = ? AND job_id = ?;
  `;

  connection.query(query, [userId, jobId], (err, result) => {
    if (err) {
      console.error("Error removing saved job:", err);
      return res.status(500).json({ error: "Failed to remove saved job" });
    }
    res.status(200).json({ message: "Job removed from saved jobs!" });
  });
});

// Fetch saved jobs for a user
router.get("/saved-jobs/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT j.job_id, j.job_title, j.job_category, j.location, j.salary_range
    FROM saved_jobs sj
    INNER JOIN jobs j ON sj.job_id = j.job_id
    WHERE sj.user_id = ?;
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching saved jobs:", err);
      return res.status(500).json({ error: "Failed to fetch saved jobs" });
    }
    res.status(200).json(results); // Send job details to the frontend
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
    const payments = results.map((payment) => ({
      ...payment,
      status: "Pending", // Static default value
      amount: 99, // Static payment amount
    }));

    res.status(200).json(payments);
  });
});
module.exports = router;
