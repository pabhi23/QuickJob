const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const router = express.Router();
const connection = require('../config/db');

router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, userType } = req.body;

    console.log('Received data:', req.body);

    if (!firstName || !lastName || !email || !password || !userType) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'Error hashing password' });
        }

        const sql = 'INSERT INTO users (firstName, lastName, email, password, registerAs) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [firstName, lastName, email, hashedPassword, userType], (err, result) => {
            if (err) {
                console.error('Error saving user:', err);
                return res.status(500).json({ error: 'Error saving user' });
            }
            console.log('User registered with ID:', result.insertId);
            return res.status(201).json({ message: 'User registered successfully!' });
        });
    });
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
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
  
      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        registerAs: user.registerAs,
      });
    });
  });

router.post("/forget-password", async (req, res) => {
    const { email, newPassword } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Email does not exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Server error" });
            }

            res.status(200).json({ message: "Password updated successfully" });
        });
    });
});
  // Joblisting
  router.get('/jobs', (req, res) => {
    const query = `
        SELECT job_id,
               job_title AS jobRole, 
               job_category AS skill, 
               salary_range AS salaryRange 
        FROM jobs
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching job data:', err);
            return res.status(500).json({ error: 'Error fetching job data' });
        }
        res.json(results);
    });
});

router.get('/jobs', (req, res) => {
    const { employer_id, category, location } = req.query;
    const query = `SELECT * FROM jobs WHERE employer_id = ? 
                   AND (job_category LIKE ? OR ? = '') 
                   AND (location LIKE ? OR ? = '')`;
  
    db.query(query, [employer_id, `%${category}%`, category, `%${location}%`, location], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error fetching jobs' });
      res.json(results);
    });
  });
  
  router.post('/jobs', (req, res) => {
    const { job_title, job_description, job_category, location, salary_range, requirements, employer_id } = req.body;
  
    const sql = 'INSERT INTO jobs (job_title, job_description, job_category, location, salary_range, requirements, employer_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [job_title, job_description, job_category, location, salary_range, requirements, employer_id], (err) => {
      if (err) return res.status(500).json({ error: 'Error creating job' });
      res.status(201).json({ message: 'Job created successfully!' });
    });
  });
  
  router.delete('/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    db.query('DELETE FROM jobs WHERE job_id = ?', [jobId], (err) => {
      if (err) return res.status(500).json({ error: 'Error deleting job' });
      res.status(200).json({ message: 'Job deleted successfully' });
    });
  });

router.get('/applications/history/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT a.application_id, a.status, a.applied_at, j.job_title
    FROM applications a
    JOIN jobs j ON a.job_id = j.job_id
    WHERE a.user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching application history:', err);
      return res.status(500).json({ error: 'Failed to fetch application history' });
    }
    res.status(200).json(results);
  });
});

// Apply Job
  router.post('/applications', (req, res) => {
    const { jobId, userId } = req.body;
  
    console.log('Payload received by backend:', req.body);
  
    if (!jobId || !userId) {
      return res.status(400).json({ error: 'Job ID and User ID are required' });
    }
  
    const checkQuery = 'SELECT * FROM applications WHERE user_id = ? AND job_id = ?';
    connection.query(checkQuery, [userId, jobId], (err, results) => {
      if (err) {
        console.error('Error checking for existing application:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length > 0) {
        return res.status(200).json({ message: 'Application already exists!' });
      }
  
      const insertQuery = `
        INSERT INTO applications (user_id, job_id, status)
        VALUES (?, ?, 'applied');
      `;
      connection.query(insertQuery, [userId, jobId], (err, result) => {
        if (err) {
          console.error('Error applying for the job:', err);
          return res.status(500).json({ error: 'Failed to apply for the job' });
        }
        res.status(201).json({ message: 'Application successful!' });
      });
    });
  });  

  router.get('/applications/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const query = `SELECT job_id FROM applications WHERE user_id = ? AND status = 'applied'`;
  
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching applied jobs:', err);
        return res.status(500).json({ error: 'Failed to fetch applied jobs' });
      }
      const appliedJobs = results.map((row) => row.job_id); 
      res.status(200).json(appliedJobs);
    });
  });
  
  router.delete('/applications/applied', (req, res) => {
    const { jobId, userId } = req.body;
  
    if (!jobId || !userId) {
      return res.status(400).json({ error: 'Job ID and User ID are required' });
    }
  
    const query = `DELETE FROM applications WHERE user_id = ? AND job_id = ?`;
  
    connection.query(query, [userId, jobId], (err, result) => {
      if (err) {
        console.error('Error unapplying for the job:', err);
        return res.status(500).json({ error: 'Failed to unapply for the job' });
      }
      res.status(200).json({ message: 'Unapplied successfully!' });
    });
  });
  
  
module.exports = router;