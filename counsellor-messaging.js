// Counsellor Messaging Interface
let selectedStudentId = null;
let selectedStudentName = null;

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.userType === 'counsellor') {
        loadConversations();
        setupMessageInput();
    }
});

function loadConversations() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const conversations = window.messagingSystem.getConversations('counsellor', currentUser.email);
    
    const conversationsContainer = document.getElementById('conversationsContainer');
    if (!conversationsContainer) return;
    
    if (conversations.length === 0) {
        conversationsContainer.innerHTML = `
            <div class="no-conversations">
                <i class="fas fa-inbox"></i>
                <p>No student messages yet</p>
                <p class="small-text">Messages from students will appear here</p>
            </div>
        `;
        return;
    }
    
    conversationsContainer.innerHTML = conversations.map(conv => {
        // Decrypt last message for preview
        const lastMessagePreview = conv.lastMessage.length > 50 
            ? window.messagingSystem.decryptMessage(conv.lastMessage).substring(0, 50) + '...'
            : window.messagingSystem.decryptMessage(conv.lastMessage);
        
        return `
            <div class="conversation-item ${conv.studentId === selectedStudentId ? 'active' : ''}" 
                 onclick="selectStudent('${conv.studentId}', '${conv.studentName}')">
                <div class="conversation-avatar">
                    <i class="fas fa-user-secret"></i>
                </div>
                <div class="conversation-info">
                    <div class="conversation-header">
                        <h5>${conv.studentName}</h5>
                        ${conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : ''}
                    </div>
                    <p class="last-message">${escapeHtml(lastMessagePreview)}</p>
                    <span class="last-message-time">${formatTime(conv.lastMessageTime)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function selectStudent(studentId, studentName) {
    selectedStudentId = studentId;
    selectedStudentName = studentName;
    
    // Update UI
    document.getElementById('chatStudentName').textContent = studentName;
    
    // Remove active class from all items
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected item
    const selectedItem = document.querySelector(`[onclick*="${studentId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Mark conversation as read
    window.messagingSystem.markConversationAsRead(studentId, 'counsellor');
    
    // Load messages
    loadMessages();
    
    // Reload conversations to update unread count
    setTimeout(() => loadConversations(), 500);
}

function setupMessageInput() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendCounsellorMessage();
            }
        });
    }
}

function loadMessages() {
    if (!selectedStudentId) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const messages = window.messagingSystem.getMessages('counsellor', currentUser.email);
    
    // Filter messages for selected student
    const conversationMessages = messages.filter(m => m.senderId === selectedStudentId);
    
    displayMessages(conversationMessages, currentUser);
}

function displayMessages(messages, currentUser) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="empty-chat">
                <i class="fas fa-comment-slash"></i>
                <p>No messages in this conversation yet</p>
                <p class="anonymous-notice">Student messages are anonymous for privacy</p>
            </div>
        `;
        return;
    }
    
    // Sort messages by timestamp
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    chatMessages.innerHTML = messages.map(msg => {
        const isCounsellor = msg.senderType === 'counsellor' && msg.senderId === currentUser.email;
        
        // Decrypt message for display
        const decryptedMessage = window.messagingSystem.decryptMessage(msg.message);
        
        return `
            <div class="message-item ${isCounsellor ? 'sent' : 'received'}">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">${msg.senderName}</span>
                        <span class="message-time">${formatTime(msg.timestamp)}</span>
                    </div>
                    <div class="message-text">${escapeHtml(decryptedMessage)}</div>
                    ${msg.anonymous ? '<span class="anonymous-tag"><i class="fas fa-user-secret"></i> Anonymous</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendCounsellorMessage() {
    if (!selectedStudentId) {
        alert('Please select a student conversation first');
        return;
    }
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Send message
    window.messagingSystem.sendMessage(
        'counsellor',
        currentUser.email,
        currentUser.name || currentUser.email,
        'student',
        selectedStudentId,
        selectedStudentName,
        message,
        false // Counsellors don't send anonymously
    );
    
    // Clear input
    messageInput.value = '';
    
    // Reload messages
    loadMessages();
    
    // Reload conversations
    setTimeout(() => loadConversations(), 500);
    
    // Show success notification
    showNotification('Reply sent successfully!', 'success');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes} min ago`;
    } else if (diff < 86400000) { // Less than 1 day
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


