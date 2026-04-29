const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- REGISTER ---
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password, role: role.toLowerCase(), phone: "" });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user._id, name: user.name, email: user.email, phone: "" } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: payload.user }); 
        });
    } catch (err) { res.status(500).send('Server error'); }
});

router.post('/upgrade', async (req, res) => {
    console.log("Upgrade request received for ID:", req.body.userId); 
    try {
        const { userId, newRole } = req.body;
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

       
        const payload = { 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone || "" 
            } 
        };
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: payload.user });
        });
    } catch (err) { res.status(500).send('Server error'); }
});

// --- UPDATE PROFILE ---
router.put('/update/:id', async (req, res) => {
    try {
        const { email, phone, newPassword } = req.body;
        let updateFields = {};
        
        if (email) updateFields.email = email;
        if (phone !== undefined) updateFields.phone = phone;

        if (newPassword && newPassword.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(newPassword, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: updateFields }, 
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ msg: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- DELETE ACCOUNT ---
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log("Attempting to delete user with ID:", req.params.id);
        
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ msg: "User not found in database" });
        }

        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- EMERGENCY EMAIL RESET ---
router.put('/fix-password-by-email', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        res.send("Success! Password updated in database.");
    } catch (err) { res.status(500).send("Error: " + err.message); }
});

module.exports = router;