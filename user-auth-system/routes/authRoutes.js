const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPW = await bcrypt.hash(password, 10);
        const newUser = await User.create( {email, password: hasedPassword });

        res.status(201).json({ message: "User registered successfully", userId: newUser._id });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ err: "Error logging in" });
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: "You have accessed a protected route!", userId: req.user.userId });
});

module.exports = router;