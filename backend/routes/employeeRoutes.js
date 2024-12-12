const express = require("express");
const multer = require("multer");
const path = require("path");
const connection = require("../config/db");
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_photos/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
router.get("/employees/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM users WHERE user_id = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching employee details");
      } else if (rows.length === 0) {
        res.status(404).send("Employee not found");
      } else {
        res.json(rows[0]);
      }
    }
  );
});

// Update Employee Profile
router.put(
  "/employees/:id",
  upload.single("profilePhoto"),
  async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, location } = req.body;
    const profilePhoto = req.file
      ? `/uploads/profile_photos/${req.file.filename}`
      : null;

    // Validation (basic)
    if (!firstName || !lastName || !email || !phoneNumber || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // SQL query to update employee data
      const query = `
      UPDATE users
      SET 
        firstName = ?, 
        lastName = ?, 
        email = ?, 
        phone_number = ?, 
        location = ?, 
        profile_pic = COALESCE(?, profile_pic)
      WHERE user_id = ?
    `;

      const values = [
        firstName,
        lastName,
        email,
        phoneNumber,
        location,
        profilePhoto,
        id,
      ];

      connection.query(query, values, (err, result) => {
        if (err) {
          console.error("Error updating employee profile:", err);
          return res
            .status(500)
            .json({ message: "Error updating employee profile" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Profile updated successfully" });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }
);

module.exports = router;
