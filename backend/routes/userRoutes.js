const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); 
const router = express.Router();

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

module.exports = router;