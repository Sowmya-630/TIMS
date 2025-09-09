const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE all
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: 'All notifications cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
