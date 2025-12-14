import './WelcomeScreen.css';

function WelcomeScreen() {
    return (
        <div className="welcome-screen">
            <div className="welcome-content">
                <div className="welcome-icon">
                    <svg viewBox="0 0 303 172" width="303" height="172">
                        <path fill="#364147" d="M229.565 160.229c32.647-16.72 54.96-50.027 54.96-88.612 0-54.94-44.674-99.614-99.614-99.614-54.94 0-99.614 44.674-99.614 99.614 0 38.586 22.313 71.893 54.96 88.612h89.308z" />
                        <path fill="#F0F0F0" d="M137.492 48.138c0-5.043-4.09-9.133-9.134-9.133-5.042 0-9.133 4.09-9.133 9.133v12.178H95.461v45.39h23.764v12.177c0 5.043 4.091 9.133 9.133 9.133 5.044 0 9.134-4.09 9.134-9.133v-12.177h23.764v-45.39h-23.764V48.138zM219.823 48.138c0-5.043-4.09-9.133-9.134-9.133-5.043 0-9.133 4.09-9.133 9.133v12.178h-23.764v45.39h23.764v12.177c0 5.043 4.09 9.133 9.133 9.133 5.044 0 9.134-4.09 9.134-9.133v-12.177h23.764v-45.39h-23.764V48.138z" />
                        <path fill="#E0E0E0" d="M176.202 83.528c0-14.213-11.524-25.737-25.737-25.737-14.213 0-25.737 11.524-25.737 25.737s11.524 25.737 25.737 25.737c14.213 0 25.737-11.524 25.737-25.737z" />
                        <circle fill="#FFFFFF" cx="150.465" cy="83.528" r="14.737" />
                    </svg>
                </div>
                <h1>WhatsApp Web</h1>
                <p>Send and receive messages without keeping your phone online.</p>
                <p className="hint">Use your phone to scan the QR code to log in.</p>
                <div className="encryption-note">
                    <svg viewBox="0 0 10 12" width="10" height="12">
                        <path fill="currentColor" d="M5.009 0C3.007 0 1.386 1.621 1.386 3.624v2.085c-.632.188-1.092.786-1.092 1.49v3.905A.897.897 0 0 0 1.19 12h7.637a.897.897 0 0 0 .896-.896V7.199a1.5 1.5 0 0 0-1.092-1.49V3.624C8.632 1.622 7.011 0 5.01 0zm0 1.177c1.397 0 2.528 1.132 2.528 2.528v1.913H2.481V3.705c0-1.397 1.131-2.528 2.528-2.528z" />
                    </svg>
                    <span>Your personal messages are end-to-end encrypted</span>
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen;
