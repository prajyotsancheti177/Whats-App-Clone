import { useState } from 'react';
import ContactItem from './ContactItem';
import NewChatModal from './NewChatModal';
import './Sidebar.css';

function Sidebar({
    contacts,
    activeChat,
    onSelectChat,
    onAddContact,
    searchQuery,
    onSearchChange,
    isConnected
}) {
    const [showNewChat, setShowNewChat] = useState(false);

    return (
        <div className="sidebar">
            {/* Header */}
            <div className="sidebar-header">
                <div className="user-avatar">
                    <div className="avatar-placeholder">
                        <svg viewBox="0 0 212 212" width="40" height="40">
                            <path fill="#DFE5E7" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.251,212C47.846,212,0.5,164.654,0.5,106.25S47.846,0.5,106.251,0.5z" />
                            <path fill="#FFF" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955c-0.557,0.848-1.033,1.622-1.447,2.324c24.898,28.227,61.779,46.061,102.818,46.061c41.093,0,77.995-17.867,102.887-46.146C174.594,173.238,174.117,172.463,173.561,171.615z" />
                            <circle fill="#FFF" cx="106.002" cy="77.969" r="36.469" />
                        </svg>
                    </div>
                </div>
                <div className="header-actions">
                    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                        <span className="status-dot"></span>
                        {isConnected ? 'Connected' : 'Offline'}
                    </div>
                    <button className="icon-btn" onClick={() => setShowNewChat(true)} title="New chat">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z" />
                        </svg>
                    </button>
                    <button className="icon-btn" title="Menu">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-box">
                    <svg viewBox="0 0 24 24" width="24" height="24" className="search-icon">
                        <path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Contacts List */}
            <div className="contacts-list">
                {contacts.length === 0 ? (
                    <div className="no-contacts">
                        <p>No chats yet</p>
                        <button className="start-chat-btn" onClick={() => setShowNewChat(true)}>
                            Start a new chat
                        </button>
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <ContactItem
                            key={contact.phoneNumber}
                            contact={contact}
                            isActive={activeChat?.phoneNumber === contact.phoneNumber}
                            onClick={() => onSelectChat(contact)}
                        />
                    ))
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChat && (
                <NewChatModal
                    onClose={() => setShowNewChat(false)}
                    onAddContact={(phone, name) => {
                        onAddContact(phone, name);
                        setShowNewChat(false);
                    }}
                />
            )}
        </div>
    );
}

export default Sidebar;
