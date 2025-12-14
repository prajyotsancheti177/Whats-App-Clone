import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from '../MessageInput/MessageInput';
import './ChatWindow.css';

function ChatWindow({ contact, messages, onSendMessage }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatPhoneNumber = (phone) => {
        if (phone.length > 10) {
            return `+${phone.slice(0, 2)} ${phone.slice(2, 7)} ${phone.slice(7)}`;
        }
        return phone;
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentDate = null;

        messages.forEach((msg) => {
            const msgDate = new Date(msg.timestamp).toDateString();
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                groups.push({ type: 'date', date: new Date(msg.timestamp) });
            }
            groups.push({ type: 'message', data: msg });
        });

        return groups;
    };

    const formatDateLabel = (date) => {
        const now = new Date();
        const d = new Date(date);

        if (d.toDateString() === now.toDateString()) {
            return 'Today';
        }

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="chat-window">
            {/* Chat Header */}
            <div className="chat-header">
                <div className="chat-contact-info">
                    <div className="chat-avatar">
                        {contact.profilePic ? (
                            <img src={contact.profilePic} alt={contact.name} />
                        ) : (
                            <div className="avatar-initials">
                                {getInitials(contact.name)}
                            </div>
                        )}
                    </div>
                    <div className="chat-contact-details">
                        <span className="chat-contact-name">{contact.name}</span>
                        <span className="chat-contact-phone">{formatPhoneNumber(contact.phoneNumber)}</span>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button className="icon-btn" title="Search">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z" />
                        </svg>
                    </button>
                    <button className="icon-btn" title="Menu">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="messages-container">
                <div className="messages-wrapper">
                    {groupedMessages.length === 0 ? (
                        <div className="no-messages">
                            <p>No messages yet</p>
                            <span>Send a message to start the conversation</span>
                        </div>
                    ) : (
                        groupedMessages.map((item, index) => {
                            if (item.type === 'date') {
                                return (
                                    <div key={`date-${index}`} className="date-divider">
                                        <span>{formatDateLabel(item.date)}</span>
                                    </div>
                                );
                            }
                            return (
                                <MessageBubble
                                    key={item.data._id || index}
                                    message={item.data}
                                />
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input */}
            <MessageInput onSendMessage={onSendMessage} />
        </div>
    );
}

export default ChatWindow;
