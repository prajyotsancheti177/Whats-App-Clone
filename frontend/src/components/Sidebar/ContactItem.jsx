import './ContactItem.css';

function ContactItem({ contact, isActive, onClick }) {
    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();

        if (isToday) {
            return d.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`contact-item ${isActive ? 'active' : ''}`} onClick={onClick}>
            <div className="contact-avatar">
                {contact.profilePic ? (
                    <img src={contact.profilePic} alt={contact.name} />
                ) : (
                    <div className="avatar-initials">
                        {getInitials(contact.name)}
                    </div>
                )}
            </div>
            <div className="contact-info">
                <div className="contact-header">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-time">{formatTime(contact.lastMessageTime)}</span>
                </div>
                <div className="contact-preview">
                    <span className="last-message">
                        {contact.lastMessage || 'No messages yet'}
                    </span>
                    {contact.unreadCount > 0 && (
                        <span className="unread-badge">{contact.unreadCount}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContactItem;
