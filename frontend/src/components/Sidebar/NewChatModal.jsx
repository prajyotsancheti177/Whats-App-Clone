import { useState } from 'react';
import './NewChatModal.css';

function NewChatModal({ onClose, onAddContact }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phoneNumber.trim() && name.trim()) {
            onAddContact(phoneNumber.trim(), name.trim());
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>New Chat</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M19.6004 17.2L14.4004 12L19.6004 6.8L17.2004 4.4L12.0004 9.6L6.80039 4.4L4.40039 6.8L9.60039 12L4.40039 17.2L6.80039 19.6L12.0004 14.4L17.2004 19.6L19.6004 17.2Z" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            placeholder="e.g., 919876543210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            autoFocus
                        />
                        <small>Include country code without + (e.g., 919876543210)</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Contact Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter contact name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-btn" disabled={!phoneNumber.trim() || !name.trim()}>
                        Start Chat
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewChatModal;
