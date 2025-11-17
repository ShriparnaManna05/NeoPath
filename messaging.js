// Encrypted Messaging System for NeoPath
// Provides anonymous encrypted communication between students and counsellors

// Encryption key - In production, this should be generated per-user or per-session
const ENCRYPTION_KEY = 'neopath-secure-messaging-key-2024';

// Simple encryption using XOR cipher (for demo purposes)
// In production, use Web Crypto API or similar
function encryptMessage(message) {
    try {
        // For demo: simple base64 encoding + XOR encryption
        let encrypted = '';
        const key = ENCRYPTION_KEY;
        
        for (let i = 0; i < message.length; i++) {
            const keyChar = key[i % key.length];
            encrypted += String.fromCharCode(
                message.charCodeAt(i) ^ keyChar.charCodeAt(0)
            );
        }
        
        // Base64 encode for storage
        return btoa(encrypted);
    } catch (error) {
        console.error('Encryption error:', error);
        return message; // Fallback to plain text if encryption fails
    }
}

function decryptMessage(encryptedMessage) {
    try {
        // Base64 decode
        const decoded = atob(encryptedMessage);
        const key = ENCRYPTION_KEY;
        let decrypted = '';
        
        for (let i = 0; i < decoded.length; i++) {
            const keyChar = key[i % key.length];
            decrypted += String.fromCharCode(
                decoded.charCodeAt(i) ^ keyChar.charCodeAt(0)
            );
        }
        
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        return encryptedMessage; // Fallback to encrypted message if decryption fails
    }
}

// Generate anonymous ID for students
function generateAnonymousId(email) {
    // Create a hash-like ID from email (not reversible)
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return 'STU-' + Math.abs(hash).toString(16).substring(0, 8).toUpperCase();
}

// Messaging functions
function saveMessage(messageData) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push({
        ...messageData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('messages', JSON.stringify(messages));
    return messages[messages.length - 1];
}

function getMessages(userType, userId) {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    if (userType === 'student') {
        // Students see only their own messages
        return allMessages.filter(m => 
            m.senderId === userId || m.senderId === generateAnonymousId(userId)
        );
    } else if (userType === 'counsellor') {
        // Counsellors see all messages from students
        return allMessages.filter(m => m.recipientType === 'counsellor' || m.senderType === 'student');
    }
    
    return [];
}

function getConversations(userType, userId) {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const conversations = {};
    
    if (userType === 'counsellor') {
        // Group messages by student anonymous ID
        allMessages.forEach(msg => {
            if (msg.senderType === 'student') {
                const studentId = msg.senderId;
                if (!conversations[studentId]) {
                    conversations[studentId] = {
                        studentId: studentId,
                        studentName: msg.senderName || 'Anonymous Student',
                        lastMessage: msg.message,
                        lastMessageTime: msg.timestamp,
                        unread: msg.read ? 0 : 1
                    };
                } else {
                    if (new Date(msg.timestamp) > new Date(conversations[studentId].lastMessageTime)) {
                        conversations[studentId].lastMessage = msg.message;
                        conversations[studentId].lastMessageTime = msg.timestamp;
                    }
                    if (!msg.read) {
                        conversations[studentId].unread += 1;
                    }
                }
            }
        });
    } else if (userType === 'student') {
        // Students see messages with counsellors
        allMessages.forEach(msg => {
            if (msg.recipientType === 'counsellor' || msg.senderType === 'counsellor') {
                const counsellorId = msg.senderType === 'counsellor' ? msg.senderId : msg.recipientId;
                if (!conversations[counsellorId]) {
                    conversations[counsellorId] = {
                        counsellorId: counsellorId,
                        counsellorName: msg.senderType === 'counsellor' ? msg.senderName : msg.recipientName,
                        lastMessage: msg.message,
                        lastMessageTime: msg.timestamp,
                        unread: msg.read || false ? 0 : 1
                    };
                } else {
                    if (new Date(msg.timestamp) > new Date(conversations[counsellorId].lastMessageTime)) {
                        conversations[counsellorId].lastMessage = msg.message;
                        conversations[counsellorId].lastMessageTime = msg.timestamp;
                    }
                }
            }
        });
    }
    
    return Object.values(conversations).sort((a, b) => 
        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
}

function sendMessage(senderType, senderId, senderName, recipientType, recipientId, recipientName, message, anonymous = false) {
    // Encrypt the message
    const encryptedMessage = encryptMessage(message);
    
    // Use anonymous ID for students if anonymous
    const displaySenderId = (senderType === 'student' && anonymous) ? generateAnonymousId(senderId) : senderId;
    const displaySenderName = (senderType === 'student' && anonymous) ? 'Anonymous Student' : senderName;
    
    const messageData = {
        senderType: senderType,
        senderId: displaySenderId,
        senderName: displaySenderName,
        recipientType: recipientType,
        recipientId: recipientId,
        recipientName: recipientName,
        message: encryptedMessage, // Store encrypted
        originalMessage: message, // Also store original for display (in real app, don't store this)
        anonymous: anonymous,
        read: false
    };
    
    return saveMessage(messageData);
}

function markAsRead(messageId) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
        messages[messageIndex].read = true;
        localStorage.setItem('messages', JSON.stringify(messages));
    }
}

function markConversationAsRead(conversationId, userType) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.forEach(msg => {
        if (userType === 'counsellor' && msg.senderId === conversationId) {
            msg.read = true;
        } else if (userType === 'student' && msg.senderId === conversationId) {
            msg.read = true;
        }
    });
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.messagingSystem = {
        sendMessage,
        getMessages,
        getConversations,
        markAsRead,
        markConversationAsRead,
        encryptMessage,
        decryptMessage,
        generateAnonymousId
    };
}


