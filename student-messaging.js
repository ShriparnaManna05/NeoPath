// Student Messaging Interface
let selectedCounsellorId = null;
let selectedCounsellorName = null;

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.userType === 'student') {
        loadCounsellors();
        setupMessageInput();
    }
});

function loadCounsellors() {
    // Get available counsellors from system
    const counsellors = [
        { id: 'counsellor1', name: 'Dr. Sarah Johnson', specialty: 'Career Guidance' },
        { id: 'counsellor2', name: 'Prof. Michael Chen', specialty: 'Skills Development' },
        { id: 'counsellor3', name: 'Dr. Emma Wilson', specialty: 'Industry Insights' }
    ];
    
    const counsellorsList = document.getElementById('counsellorsList');
    if (!counsellorsList) return;
    
    counsellors.forEach(counsellor => {
        const counsellorItem = document.createElement('div');
        counsellorItem.className = 'counsellor-item';
        counsellorItem.setAttribute('data-counsellor-id', counsellor.id);
        counsellorItem.onclick = () => selectCounsellor(counsellor.id, counsellor.name);
        
        counsellorItem.innerHTML = `
            <div class="counsellor-avatar">
                <i class="fas fa-chalkboard-teacher"></i>
            </div>
            <div class="counsellor-info">
                <h5>${counsellor.name}</h5>
                <p>${counsellor.specialty}</p>
            </div>
        `;
        
        counsellorsList.appendChild(counsellorItem);
    });
}

function selectCounsellor(counsellorId, counsellorName) {
    selectedCounsellorId = counsellorId;
    selectedCounsellorName = counsellorName;
    
    // Update UI
    document.getElementById('chatCounsellorName').textContent = counsellorName;
    
    // Remove active class from all items
    document.querySelectorAll('.counsellor-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected item
    const selectedItem = document.querySelector(`[data-counsellor-id="${counsellorId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Load messages
    loadMessages();
}

function setupMessageInput() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendStudentMessage();
            }
        });
    }
}

function loadMessages() {
    if (!selectedCounsellorId) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const messages = window.messagingSystem.getMessages('student', currentUser.email);
    
    // Filter messages for selected counsellor
    const conversationMessages = messages.filter(m => 
        (m.senderId === selectedCounsellorId || m.recipientId === selectedCounsellorId) ||
        (selectedCounsellorId === 'all')
    );
    
    displayMessages(conversationMessages, currentUser);
}

function displayMessages(messages, currentUser) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="empty-chat">
                <i class="fas fa-comment-slash"></i>
                <p>No messages yet. Start the conversation!</p>
                <p class="anonymous-notice">Your messages are anonymous and encrypted</p>
            </div>
        `;
        return;
    }
    
    // Sort messages by timestamp
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    chatMessages.innerHTML = messages.map(msg => {
        const isStudent = msg.senderType === 'student' && 
                         (msg.senderId === currentUser.email || msg.senderId === window.messagingSystem.generateAnonymousId(currentUser.email));
        
        // Decrypt message for display
        const decryptedMessage = window.messagingSystem.decryptMessage(msg.message);
        
        return `
            <div class="message-item ${isStudent ? 'sent' : 'received'}">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">${msg.senderName}</span>
                        <span class="message-time">${formatTime(msg.timestamp)}</span>
                    </div>
                    <div class="message-text">${escapeHtml(decryptedMessage)}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendStudentMessage() {
    if (!selectedCounsellorId) {
        alert('Please select a counsellor first');
        return;
    }
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    const anonymousMode = document.getElementById('anonymousMode').checked;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Send message
    window.messagingSystem.sendMessage(
        'student',
        currentUser.email,
        currentUser.name || currentUser.email,
        'counsellor',
        selectedCounsellorId === 'all' ? 'any' : selectedCounsellorId,
        selectedCounsellorName,
        message,
        anonymousMode
    );
    
    // Clear input
    messageInput.value = '';
    
    // Reload messages
    loadMessages();
    
    // Show success notification
    showNotification('Message sent successfully!', 'success');
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
    // Simple notification - you can enhance this
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


