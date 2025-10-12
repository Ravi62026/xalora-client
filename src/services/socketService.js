import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.eventListeners = new Map();
    }

    connect(token) {
        if (this.socket?.connected) {
            return this.socket;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        this.socket = io(API_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true,
        });

        this.socket.on('connect', () => {
            console.log('🔌 Connected to WebSocket server');
            this.isConnected = true;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('🔌 Disconnected from WebSocket server:', reason);
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('🔌 WebSocket connection error:', error.message);
            this.isConnected = false;
        });

        // Re-attach existing event listeners
        for (const [event, listeners] of this.eventListeners) {
            listeners.forEach(listener => {
                this.socket.on(event, listener);
            });
        }

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Enhanced event listener management
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);

        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
                if (this.socket) {
                    this.socket.off(event, callback);
                }
            }
        }
    }

    // Room management
    joinSubmission(submissionId) {
        if (this.socket) {
            this.socket.emit('join-submission', submissionId);
        }
    }

    leaveSubmission(submissionId) {
        if (this.socket) {
            this.socket.emit('leave-submission', submissionId);
        }
    }

    // Emit events
    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    // Get connection status
    get isConnected() {
        return this.socket?.connected || false;
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;