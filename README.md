# WhatsApp Clone - MERN Stack

A full-featured WhatsApp Desktop clone built with the MERN stack (MongoDB, Express.js, React, Node.js) and integrated with the WhatsApp Business API for real messaging.

## Features

- 📱 **WhatsApp Desktop UI** - Pixel-perfect dark theme replica
- 💬 **Real-time messaging** - Socket.io powered live updates
- 📥 **Receive messages** - Webhook integration for incoming messages
- 📤 **Send messages** - WhatsApp Business API integration
- 👥 **Contact management** - Add and manage contacts
- 🔍 **Search** - Filter contacts by name or phone number
- ✅ **Read receipts** - Message status indicators (sent, delivered, read)
- 😊 **Emoji support** - Quick emoji picker

## Project Structure

```
├── backend/               # Express.js server
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # WhatsApp API service
│   └── server.js          # Main server file
├── frontend/              # React + Vite app
│   └── src/
│       ├── components/    # UI components
│       └── App.jsx        # Main app component
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- WhatsApp Business API credentials (for production)

### Setup

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   
   Edit `backend/.env` with your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/whatsapp_clone
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_ACCESS_TOKEN=your_access_token
   WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
   PORT=5000
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs at http://localhost:5000

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   App runs at http://localhost:5173

## WhatsApp Business API Setup (Production)

1. Create a Meta Developer account
2. Create a WhatsApp Business App
3. Get your Phone Number ID and Access Token
4. Update `.env` with real credentials
5. Expose your webhook using ngrok:
   ```bash
   ngrok http 5000
   ```
6. Configure webhook URL in Meta Developer Portal:
   - URL: `https://your-ngrok-url.ngrok.io/webhook`
   - Verify Token: Same as `WEBHOOK_VERIFY_TOKEN` in `.env`

## API Endpoints

### Contacts
- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Add new contact
- `PUT /api/contacts/:phone/read` - Mark messages as read

### Messages
- `GET /api/messages/:phone` - Get chat history
- `POST /api/messages/send` - Send a message

### Webhook
- `GET /webhook` - Verification endpoint
- `POST /webhook` - Receive incoming messages

## License

MIT
