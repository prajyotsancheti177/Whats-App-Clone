import './MessageBubble.css';

function MessageBubble({ message }) {
    const isOutgoing = message.direction === 'outgoing';

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return (
                    <svg viewBox="0 0 16 15" width="16" height="15" className="status-icon sent">
                        <path fill="currentColor" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                    </svg>
                );
            case 'delivered':
                return (
                    <svg viewBox="0 0 16 15" width="16" height="15" className="status-icon delivered">
                        <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.033l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                    </svg>
                );
            case 'read':
                return (
                    <svg viewBox="0 0 16 15" width="16" height="15" className="status-icon read">
                        <path fill="#53bdeb" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.033l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                    </svg>
                );
            case 'failed':
                return (
                    <svg viewBox="0 0 16 16" width="16" height="16" className="status-icon failed">
                        <path fill="#f15c6d" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 4h2v5H7V4zm0 6h2v2H7v-2z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`message-bubble-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`}>
            <div className={`message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`}>
                <div className="message-content">
                    <span className="message-text">{message.content}</span>
                    <span className="message-meta">
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                        {isOutgoing && getStatusIcon(message.status)}
                    </span>
                </div>
                <div className={`bubble-tail ${isOutgoing ? 'outgoing' : 'incoming'}`}></div>
            </div>
        </div>
    );
}

export default MessageBubble;
