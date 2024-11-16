const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const router = express.Router();
const sendEmail = require("../utils/emailService");
router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;

  console.log("Received data:", req.body);

  // Validate all required fields
  if (!firstName || !lastName || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Error hashing password" });
    }

    // SQL query to insert user
    const sql =
      "INSERT INTO users (firstName, lastName, email, password, registerAs) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [firstName, lastName, email, hashedPassword, userType],
      (err, result) => {
        if (err) {
          console.error("Error saving user:", err);

          // Handle duplicate email case (for example, based on unique email constraint)
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already registered" });
          }

          return res.status(500).json({ error: "Error saving user" });
        }

        console.log("User registered with ID:", result.insertId);

        // Return user_id along with success message
        return res.status(201).json({
          message: "User registered successfully!",
          user_id: result.insertId, // Return the generated user_id
        });
      }
    );
  });
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Query the database for the user by email
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

      // Compare the provided password with the hashed password
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
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Server error" });
          }

          res.status(200).json({ message: "Password updated successfully" });
        }
      );
    }
  );
});

router.get("/jobs", (req, res) => {
  const { employer_id, category, location } = req.query;

  // Updated query to use user_id instead of employer_id
  const query = `
    SELECT * FROM jobs 
    WHERE user_id = ? 
      AND (job_category LIKE ? OR ? = '') 
      AND (location LIKE ? OR ? = '')
  `;

  db.query(
    query,
    [employer_id, `%${category}%`, category, `%${location}%`, location],
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

      // Log all user alerts for testing
      const fetchAllAlertsQuery = `SELECT * FROM job_alerts`;

      db.query(fetchAllAlertsQuery, (alertsErr, allAlerts) => {
        if (alertsErr) {
          console.error("Error fetching all alerts:", alertsErr);
          return res
            .status(500)
            .json({ error: "Error fetching all alerts for testing" });
        }

        console.log("All User Alerts in Database:", allAlerts);

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

        console.log("Executing matching alerts query...");
        console.log("Matching Query Parameters:", {
          job_title,
          location,
          job_category,
        });

        db.query(
          matchQuery,
          [job_title, location, job_category],
          async (alertErr, matches) => {
            if (alertErr) {
              console.error("Error fetching matching alerts:", alertErr);
              return res
                .status(500)
                .json({ error: "Error finding matching alerts" });
            }

            console.log("All matching alerts:", matches);

            // Send email notifications
            for (const match of matches) {
              console.log("Preparing email for:", match.email);

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

              try {
                console.log(`Sending email to: ${match.email}`);
                await sendEmail(match.email, subject, text, html);
                console.log(`Email sent successfully to ${match.email}`);
              } catch (emailError) {
                console.error(
                  `Error sending email to ${match.email}:`,
                  emailError
                );
              }
            }

            res.status(201).json({
              message: "Job created successfully, notifications sent to users!",
              job_id: jobId,
            });
          }
        );
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

// job alerts routes
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

  const query = `DELETE FROM job_alerts WHERE alert_id = ?`;

  db.query(query, [alert_id], (err, result) => {
    if (err) {
      console.error("Error deleting job alert:", err);
      return res.status(500).json({ error: "Error deleting job alert" });
    }

    res.json({ message: "Job alert deleted successfully" });
  });
});

//

module.exports = router;
