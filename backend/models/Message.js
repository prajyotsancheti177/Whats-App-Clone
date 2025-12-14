const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  contactPhone: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'document'],
    default: 'text'
  },
  direction: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  whatsappMessageId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient chat history queries
messageSchema.index({ contactPhone: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
