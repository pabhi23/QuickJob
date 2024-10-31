const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes);

app.get('/applications', async (req, res) => {
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
app.put('/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE applications SET status = ? WHERE application_id = ?', [status, id]);
    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});