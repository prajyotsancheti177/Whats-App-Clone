import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message) => {
      // Update messages if it's for the active chat
      if (activeChat && message.contactPhone === activeChat.phoneNumber) {
        setMessages((prev) => [...prev, message]);
      }

      // Update contacts list
      setContacts((prev) => {
        const updated = prev.map((contact) => {
          if (contact.phoneNumber === message.contactPhone) {
            return {
              ...contact,
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
              unreadCount: activeChat?.phoneNumber === contact.phoneNumber
                ? 0
                : contact.unreadCount + 1
            };
          }
          return contact;
        });
        // Sort by last message time
        return updated.sort((a, b) =>
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
      });
    });

    socket.on('messageStatusUpdated', ({ whatsappMessageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.whatsappMessageId === whatsappMessageId
            ? { ...msg, status }
            : msg
        )
      );
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageStatusUpdated');
    };
  }, [socket, activeChat]);

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contacts`);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.phoneNumber);
      markAsRead(activeChat.phoneNumber);
    }
  }, [activeChat]);

  const fetchMessages = async (phoneNumber) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/${phoneNumber}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (phoneNumber) => {
    try {
      await fetch(`${API_URL}/api/contacts/${phoneNumber}/read`, {
        method: 'PUT'
      });
      setContacts((prev) =>
        prev.map((contact) =>
          contact.phoneNumber === phoneNumber
            ? { ...contact, unreadCount: 0 }
            : contact
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendMessage = async (content) => {
    if (!activeChat || !content.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactPhone: activeChat.phoneNumber,
          content: content.trim(),
          type: 'text'
        })
      });

      const data = await response.json();

      // Add message to UI immediately
      setMessages((prev) => [...prev, data.message]);

      // Update contact's last message
      setContacts((prev) => {
        const updated = prev.map((contact) =>
          contact.phoneNumber === activeChat.phoneNumber
            ? {
              ...contact,
              lastMessage: content.trim(),
              lastMessageTime: new Date()
            }
            : contact
        );
        return updated.sort((a, b) =>
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addNewContact = async (phoneNumber, name) => {
    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, name })
      });

      if (response.ok) {
        const newContact = await response.json();
        setContacts((prev) => [newContact, ...prev]);
        setActiveChat(newContact);
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="app-container">
      <Sidebar
        contacts={filteredContacts}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
        onAddContact={addNewContact}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isConnected={isConnected}
      />

      {activeChat ? (
        <ChatWindow
          contact={activeChat}
          messages={messages}
          onSendMessage={sendMessage}
        />
      ) : (
        <WelcomeScreen />
      )}
    </div>
  );
}

export default App;
