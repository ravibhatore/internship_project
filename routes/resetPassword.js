//not working properly
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { findUserByEmail, savePasswordResetLink, findUserByResetLink, updatePassword } = require('../models/userModel');

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password',
  },
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).send('User not found');
    }

    const resetLink = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

    await savePasswordResetLink(email, resetLink, expiry);

    console.log(`Password reset link: http://localhost:9000/reset-password/${resetLink}`);

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: http://localhost:9000/reset-password/${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      res.send('Password reset email sent');
    });
  } catch (error) {
    console.error('Error handling password reset:', error);
    res.status(500).send('Error handling password reset');
  }
});

router.get('/reset-password/:resetLink', (req, res) => {
  const { resetLink } = req.params;
  res.render('resetPassword', { resetLink });
});

router.post('/reset-password/:resetLink', async (req, res) => {
  const { resetLink } = req.params;
  const { newPassword } = req.body;
  if (!resetLink || !newPassword) {
    return res.status(400).send('Reset link and new password are required');
  }

  try {
    const user = await findUserByResetLink(resetLink);
    if (!user) {
      return res.status(400).send('Invalid or expired reset link');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(user.email, hashedPassword);

    res.send('Password reset successful');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Error resetting password');
  }
});

module.exports = router;
