const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const connection = require("./config/db.js");
const mockTestRoutes = require('./routes/mockTestRoutes');


const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());


app.use(cors());

app.use('/api/mocktest', mockTestRoutes);

app.use(bodyParser.json());

app.use("/api", userRoutes);

app.post("/api/resume", (req, res) => {
  const {
    firstName,
    lastName,
    address,
    jobTitle,
    linkedinId,
    experience,
    education,
    skills,
  } = req.body;

  const query = `INSERT INTO resumes (first_name, last_name, address, job_title, linkedin_id, experience, education, skills)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;


  // Insert data into the database
  connection.query(
    query,
    [
      firstName,
      lastName,
      address,
      jobTitle,
      linkedinId,
      JSON.stringify(experience),
      JSON.stringify(education),
      JSON.stringify(skills),
    ],
    (err, result) => {
      if (err) {
        console.error("Error saving resume data:", err);
        return res.status(500).send("Error saving resume data");
      }
      res.status(201).send({
        message: "Resume saved successfully!",
        resumeId: result.insertId,
      });
  connection.query(query, [firstName, lastName, address, jobTitle, linkedinId, JSON.stringify(experience), JSON.stringify(education), JSON.stringify(skills)], (err, result) => {
    if (err) {
      console.error('Error saving resume data:', err);
      return res.status(500).send('Error saving resume data');
    }
  );
});

app.post("/api/resumebuilder", (req, res) => {
  const { firstName, lastName, address, jobTitle, linkedinId, phone, email } =
    req.body;

  const query = `INSERT INTO resumeUser (first_name, last_name, address, job_title, linkedin_id, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [firstName, lastName, address, jobTitle, linkedinId, phone, email],
    (err, result) => {
      if (err) {
        console.error("Error saving user data:", err);
        res.status(500).send("Error saving user data");
      } else {
        res.status(200).send({
          message: "User data saved successfully",
          userId: result.insertId,
        });
      }
    }
  );
});

app.post("/api/experience", (req, res) => {
  const { company, position, startDate, endDate, isCurrent, userId } = req.body; // Include userId

  const query = `INSERT INTO experience (user_id, company, position, start_date, end_date, is_current) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [userId, company, position, startDate, endDate, isCurrent ? 1 : 0],
    (err, result) => {
      if (err) {
        console.error("Error saving experience data:", err);
        return res.status(500).send("Error saving experience data");
      }
      res.status(200).send({
        message: "Experience data saved successfully",
        experienceId: result.insertId,
      });
    }
  );
});

app.get("/applications", async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT a.application_id AS id, j.job_role AS jobRole, u.name AS applicantName, a.applied_at AS submissionDate, a.status
       FROM applications a
       JOIN users u ON a.user_id = u.user_id
       JOIN jobs j ON a.job_id = j.job_id`
    );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status
app.put("/applications/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      "UPDATE applications SET status = ? WHERE application_id = ?",
      [status, id]
    );
    res.json({ message: "Application status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
