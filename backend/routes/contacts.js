const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get all contacts sorted by last message time
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ lastMessageTime: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get single contact
router.get('/:phoneNumber', async (req, res) => {
  try {
    const contact = await Contact.findOne({ phoneNumber: req.params.phoneNumber });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Add new contact
router.post('/', async (req, res) => {
  try {
    const { phoneNumber, name, profilePic } = req.body;
    
    // Check if contact already exists
    let contact = await Contact.findOne({ phoneNumber });
    if (contact) {
      return res.status(400).json({ error: 'Contact already exists' });
    }

    contact = new Contact({
      phoneNumber,
      name,
      profilePic: profilePic || ''
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
router.put('/:phoneNumber', async (req, res) => {
  try {
    const { name, profilePic } = req.body;
    const contact = await Contact.findOneAndUpdate(
      { phoneNumber: req.params.phoneNumber },
      { name, profilePic },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Reset unread count
router.put('/:phoneNumber/read', async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { phoneNumber: req.params.phoneNumber },
      { unreadCount: 0 },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error resetting unread count:', error);
    res.status(500).json({ error: 'Failed to reset unread count' });
  }
});

// Delete contact
router.delete('/:phoneNumber', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ phoneNumber: req.params.phoneNumber });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
