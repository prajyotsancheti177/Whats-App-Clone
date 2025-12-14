const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Contact = require('../models/Contact');
const whatsappService = require('../services/whatsappService');

// Get messages for a contact
router.get('/:contactPhone', async (req, res) => {
  try {
    const { contactPhone } = req.params;
    const { limit = 50, before } = req.query;

    let query = { contactPhone };
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    // Return in chronological order
    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { contactPhone, content, type = 'text' } = req.body;

    if (!contactPhone || !content) {
      return res.status(400).json({ error: 'contactPhone and content are required' });
    }

    // Send via WhatsApp API
    let result;
    if (type === 'text') {
      result = await whatsappService.sendTextMessage(contactPhone, content);
    } else {
      result = await whatsappService.sendMediaMessage(contactPhone, content, type);
    }

    // Create message record
    const message = new Message({
      contactPhone,
      content,
      type,
      direction: 'outgoing',
      status: result.success ? 'sent' : 'failed',
      whatsappMessageId: result.messageId || ''
    });

    await message.save();

    // Update contact's last message
    await Contact.findOneAndUpdate(
      { phoneNumber: contactPhone },
      {
        lastMessage: content,
        lastMessageTime: new Date()
      },
      { upsert: true, new: true }
    );

    // Emit message via socket (will be done by server.js)
    const io = req.app.get('io');
    if (io) {
      io.emit('newMessage', message);
    }

    res.status(201).json({
      message,
      whatsappStatus: result
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Update message status
router.put('/:messageId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { status },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

module.exports = router;
