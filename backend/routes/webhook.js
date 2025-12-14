const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Contact = require('../models/Contact');

// Webhook verification (GET request from Meta)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully!');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed - token mismatch');
      res.status(403).send('Forbidden');
    }
  } else {
    res.status(400).send('Bad Request');
  }
});

// Receive incoming messages (POST request from Meta)
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    // Check if this is a WhatsApp message
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];
      
      for (const entry of entries) {
        const changes = entry.changes || [];
        
        for (const change of changes) {
          if (change.field === 'messages') {
            const value = change.value;
            const messages = value.messages || [];
            const contacts = value.contacts || [];

            for (let i = 0; i < messages.length; i++) {
              const msg = messages[i];
              const contact = contacts[i] || {};
              
              // Extract message content based on type
              let content = '';
              let type = 'text';
              
              if (msg.type === 'text') {
                content = msg.text?.body || '';
                type = 'text';
              } else if (msg.type === 'image') {
                content = msg.image?.id || '[Image]';
                type = 'image';
              } else if (msg.type === 'video') {
                content = msg.video?.id || '[Video]';
                type = 'video';
              } else if (msg.type === 'audio') {
                content = msg.audio?.id || '[Audio]';
                type = 'audio';
              } else if (msg.type === 'document') {
                content = msg.document?.filename || '[Document]';
                type = 'document';
              }

              // Save message to database
              const newMessage = new Message({
                contactPhone: msg.from,
                content,
                type,
                direction: 'incoming',
                timestamp: new Date(parseInt(msg.timestamp) * 1000),
                whatsappMessageId: msg.id,
                status: 'delivered'
              });

              await newMessage.save();

              // Update or create contact
              const contactName = contact.profile?.name || msg.from;
              await Contact.findOneAndUpdate(
                { phoneNumber: msg.from },
                {
                  $set: {
                    name: contactName,
                    lastMessage: content,
                    lastMessageTime: new Date()
                  },
                  $inc: { unreadCount: 1 }
                },
                { upsert: true, new: true }
              );

              // Emit to connected clients via Socket.io
              const io = req.app.get('io');
              if (io) {
                io.emit('newMessage', newMessage);
                io.emit('contactUpdated', { phoneNumber: msg.from });
              }

              console.log(`Received message from ${msg.from}: ${content}`);
            }

            // Handle status updates
            const statuses = value.statuses || [];
            for (const status of statuses) {
              await Message.findOneAndUpdate(
                { whatsappMessageId: status.id },
                { status: status.status }
              );
              
              const io = req.app.get('io');
              if (io) {
                io.emit('messageStatusUpdated', {
                  whatsappMessageId: status.id,
                  status: status.status
                });
              }
            }
          }
        }
      }

      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
