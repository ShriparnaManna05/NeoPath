// Counsellor Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in as counsellor
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.userType !== 'counsellor') {
        window.location.href = 'index.html';
        return;
    }
    
    updateUserInfo(userData);
    initializeCounsellorDashboard();
});

function updateUserInfo(userData) {
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        // Display user's actual name if available, otherwise use default
        const displayName = userData.name || userData.email || 'Counsellor';
        userNameElement.textContent = `Welcome, ${displayName}`;
    }
}

function initializeCounsellorDashboard() {
    setupSessionTabs();
    setupStudentSearch();
    setupMentoringFeatures();
    loadCounsellorData();
}

function setupSessionTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sessionTabs = document.querySelectorAll('.session-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.textContent.toLowerCase().replace(' ', '-');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            sessionTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab
            const targetTab = document.getElementById(tabName + '-sessions');
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

function showSessionTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sessionTabs = document.querySelectorAll('.session-tab');
    
    // Update button states
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Update tab visibility
    sessionTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.id === tabName + '-sessions') {
            tab.classList.add('active');
        }
    });
}

function setupStudentSearch() {
    const searchInput = document.getElementById('studentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const studentCards = document.querySelectorAll('.student-card');
            
            studentCards.forEach(card => {
                const studentName = card.querySelector('h3').textContent.toLowerCase();
                const studentEmail = card.querySelector('p').textContent.toLowerCase();
                
                if (studentName.includes(searchTerm) || studentEmail.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

function setupMentoringFeatures() {
    // Setup mentoring progress tracking
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

function loadCounsellorData() {
    // Load counsellor-specific data
    loadSessionData();
    loadStudentData();
    loadMentoringData();
    loadReportData();
}

function loadSessionData() {
    // Mock session data
    const sessions = {
        upcoming: [
            {
                title: 'Career Guidance Session',
                student: 'Sarah Johnson',
                time: 'Tomorrow, 10:00 AM - 11:00 AM',
                type: 'video'
            },
            {
                title: 'Skills Development',
                student: 'Michael Chen',
                time: 'Friday, 2:00 PM - 3:00 PM',
                type: 'chat'
            }
        ],
        completed: [
            {
                title: 'Career Guidance Session',
                student: 'Emma Wilson',
                time: 'Completed on Dec 15, 2024',
                type: 'video',
                rating: '★★★★★',
                ratingText: 'Excellent'
            },
            {
                title: 'Skills Development',
                student: 'David Lee',
                time: 'Completed on Dec 12, 2024',
                type: 'chat',
                rating: '★★★★☆',
                ratingText: 'Very Good'
            }
        ]
    };
    
    updateSessionDisplay(sessions);
}

function updateSessionDisplay(sessions) {
    // Update upcoming sessions
    const upcomingList = document.querySelector('#upcoming-sessions .session-list');
    if (upcomingList) {
        upcomingList.innerHTML = sessions.upcoming.map(session => `
            <div class="session-item">
                <div class="session-info">
                    <h4>${session.title}</h4>
                    <p>Student: ${session.student}</p>
                    <p class="session-time">${session.time}</p>
                    <span class="session-type ${session.type}">${getSessionTypeLabel(session.type)}</span>
                </div>
                <div class="session-actions">
                    <button class="btn btn-sm btn-primary">${session.type === 'video' ? 'Join Session' : 'Start'}</button>
                    <button class="btn btn-sm btn-outline">Reschedule</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update completed sessions
    const completedList = document.querySelector('#completed-sessions .session-list');
    if (completedList) {
        completedList.innerHTML = sessions.completed.map(session => `
            <div class="session-item">
                <div class="session-info">
                    <h4>${session.title}</h4>
                    <p>Student: ${session.student}</p>
                    <p class="session-time">${session.time}</p>
                    <span class="session-type ${session.type}">${getSessionTypeLabel(session.type)}</span>
                </div>
                <div class="session-rating">
                    <span class="rating">${session.rating}</span>
                    <span class="rating-text">${session.ratingText}</span>
                </div>
            </div>
        `).join('');
    }
}

function getSessionTypeLabel(type) {
    const labels = {
        video: 'Video Call',
        chat: 'Chat Session',
        offline: 'In-Person'
    };
    return labels[type] || type;
}

function loadStudentData() {
    // Mock student data
    const students = [
        {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            assessments: '3/5',
            sessions: '2'
        },
        {
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            assessments: '2/5',
            sessions: '1'
        },
        {
            name: 'Emma Wilson',
            email: 'emma.wilson@email.com',
            assessments: '4/5',
            sessions: '3'
        }
    ];
    
    updateStudentDisplay(students);
}

function updateStudentDisplay(students) {
    const studentsGrid = document.querySelector('.students-grid');
    if (studentsGrid) {
        studentsGrid.innerHTML = students.map(student => `
            <div class="student-card">
                <div class="student-avatar">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="student-info">
                    <h3>${student.name}</h3>
                    <p>${student.email}</p>
                    <div class="student-stats">
                        <span class="stat">Assessments: ${student.assessments}</span>
                        <span class="stat">Sessions: ${student.sessions}</span>
                    </div>
                </div>
                <div class="student-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewStudentProfile('${student.name}')">View Profile</button>
                    <button class="btn btn-sm btn-outline" onclick="messageStudent('${student.name}')">Message</button>
                </div>
            </div>
        `).join('');
    }
}

function loadMentoringData() {
    // Mock mentoring data
    const mentees = [
        {
            name: 'Dr. Emma Wilson',
            title: 'Junior Counsellor',
            experience: '6 months experience',
            skills: [
                { name: 'Assessment Skills', progress: 85 },
                { name: 'Session Management', progress: 70 }
            ]
        },
        {
            name: 'Prof. David Lee',
            title: 'New Counsellor',
            experience: '2 months experience',
            skills: [
                { name: 'Assessment Skills', progress: 60 },
                { name: 'Session Management', progress: 45 }
            ]
        }
    ];
    
    updateMentoringDisplay(mentees);
}

function updateMentoringDisplay(mentees) {
    const menteeCards = document.querySelector('.mentee-cards');
    if (menteeCards) {
        menteeCards.innerHTML = mentees.map(mentee => `
            <div class="mentee-card">
                <div class="mentee-info">
                    <div class="mentee-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="mentee-details">
                        <h4>${mentee.name}</h4>
                        <p>${mentee.title}</p>
                        <p>${mentee.experience}</p>
                    </div>
                </div>
                <div class="mentee-progress">
                    ${mentee.skills.map(skill => `
                        <div class="progress-item">
                            <span>${skill.name}</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${skill.progress}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="mentee-actions">
                    <button class="btn btn-sm btn-primary" onclick="scheduleMentoringMeeting('${mentee.name}')">Schedule Meeting</button>
                    <button class="btn btn-sm btn-outline" onclick="viewMenteeProgress('${mentee.name}')">View Progress</button>
                </div>
            </div>
        `).join('');
    }
}

function loadReportData() {
    // Mock report data
    const reportData = {
        totalSessions: 24,
        averageDuration: 52,
        completionRate: 96,
        averageRating: 4.8,
        ratingBreakdown: [
            { stars: 5, percentage: 80 },
            { stars: 4, percentage: 15 },
            { stars: 3, percentage: 5 }
        ]
    };
    
    updateReportDisplay(reportData);
}

function updateReportDisplay(data) {
    // Update session activity report
    const sessionStats = document.querySelector('.report-stats');
    if (sessionStats) {
        sessionStats.innerHTML = `
            <div class="report-stat">
                <span class="stat-label">Total Sessions</span>
                <span class="stat-value">${data.totalSessions}</span>
            </div>
            <div class="report-stat">
                <span class="stat-label">Average Duration</span>
                <span class="stat-value">${data.averageDuration} min</span>
            </div>
            <div class="report-stat">
                <span class="stat-label">Completion Rate</span>
                <span class="stat-value">${data.completionRate}%</span>
            </div>
        `;
    }
    
    // Update feedback analysis
    const feedbackScore = document.querySelector('.feedback-score .score');
    if (feedbackScore) {
        feedbackScore.textContent = data.averageRating;
    }
    
    const ratingBreakdown = document.querySelector('.feedback-breakdown');
    if (ratingBreakdown) {
        ratingBreakdown.innerHTML = data.ratingBreakdown.map(rating => `
            <div class="rating-item">
                <span>${'★'.repeat(rating.stars)}${'☆'.repeat(5 - rating.stars)}</span>
                <div class="rating-bar">
                    <div class="rating-fill" style="width: ${rating.percentage}%"></div>
                </div>
                <span>${rating.percentage}%</span>
            </div>
        `).join('');
    }
}

// Session form handling
document.addEventListener('DOMContentLoaded', function() {
    const sessionForm = document.querySelector('.session-form');
    if (sessionForm) {
        sessionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            scheduleNewSession();
        });
    }
});

function scheduleNewSession() {
    const form = document.querySelector('.session-form');
    const formData = new FormData(form);
    
    const sessionData = {
        student: document.getElementById('studentSelect').value,
        type: document.getElementById('sessionType').value,
        date: document.getElementById('sessionDate').value,
        time: document.getElementById('sessionTime').value,
        duration: document.getElementById('sessionDuration').value,
        notes: document.getElementById('sessionNotes').value
    };
    
    // Validate form
    if (!sessionData.student || !sessionData.type || !sessionData.date || !sessionData.time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Save session
    const sessions = JSON.parse(localStorage.getItem('counsellorSessions') || '[]');
    sessions.push({
        ...sessionData,
        id: Date.now(),
        status: 'scheduled'
    });
    localStorage.setItem('counsellorSessions', JSON.stringify(sessions));
    
    showNotification('Session scheduled successfully!', 'success');
    form.reset();
    
    // Refresh session display
    loadSessionData();
}

// Student management functions
function viewStudentProfile(studentName) {
    showNotification(`Opening profile for ${studentName}...`, 'info');
    // In a real app, this would open a detailed student profile modal
}

function messageStudent(studentName) {
    showNotification(`Opening chat with ${studentName}...`, 'info');
    // In a real app, this would open a messaging interface
}

function showAddStudentModal() {
    showNotification('Add Student feature coming soon!', 'info');
    // In a real app, this would open a modal to add new students
}

// Mentoring functions
function scheduleMentoringMeeting(menteeName) {
    showNotification(`Scheduling meeting with ${menteeName}...`, 'info');
    // In a real app, this would open a scheduling interface
}

function viewMenteeProgress(menteeName) {
    showNotification(`Viewing progress for ${menteeName}...`, 'info');
    // In a real app, this would show detailed progress reports
}

// Report functions
function generateReport() {
    const period = document.getElementById('reportPeriod').value;
    const type = document.getElementById('reportType').value;
    
    showNotification(`Generating ${type} report for last ${period} days...`, 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification('Report generated successfully!', 'success');
        // In a real app, this would generate and display the actual report
    }, 2000);
}

// Additional CSS for counsellor-specific elements
const counsellorStyles = `
    .session-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .tab-btn {
        padding: 10px 20px;
        border: none;
        background: transparent;
        color: #64748b;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .tab-btn.active {
        color: #1e40af;
        border-bottom-color: #1e40af;
    }
    
    .tab-btn:hover {
        color: #1e40af;
    }
    
    .session-tab {
        display: none;
    }
    
    .session-tab.active {
        display: block;
    }
    
    .session-type {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
    }
    
    .session-type.video {
        background: #dbeafe;
        color: #1e40af;
    }
    
    .session-type.chat {
        background: #dcfce7;
        color: #166534;
    }
    
    .session-type.offline {
        background: #fef3c7;
        color: #92400e;
    }
    
    .students-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .search-box {
        position: relative;
        width: 300px;
    }
    
    .search-box input {
        width: 100%;
        padding: 10px 40px 10px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
    }
    
    .search-box i {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
    }
    
    .students-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .student-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .student-avatar {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #1e40af, #f97316);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
    }
    
    .student-info h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 5px;
    }
    
    .student-info p {
        color: #64748b;
        font-size: 14px;
        margin-bottom: 10px;
    }
    
    .student-stats {
        display: flex;
        gap: 15px;
    }
    
    .student-stats .stat {
        font-size: 12px;
        color: #64748b;
        background: #f1f5f9;
        padding: 4px 8px;
        border-radius: 4px;
    }
    
    .student-actions {
        display: flex;
        gap: 10px;
    }
    
    .mentoring-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .mentee-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
    }
    
    .mentee-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .mentee-info {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .mentee-avatar {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #1e40af, #f97316);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
    }
    
    .mentee-details h4 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 5px;
    }
    
    .mentee-details p {
        color: #64748b;
        font-size: 14px;
        margin: 0;
    }
    
    .mentee-progress {
        margin-bottom: 20px;
    }
    
    .progress-item {
        margin-bottom: 15px;
    }
    
    .progress-item span {
        display: block;
        font-size: 14px;
        color: #374151;
        margin-bottom: 5px;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #1e40af, #f97316);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .mentee-actions {
        display: flex;
        gap: 10px;
    }
    
    .reports-filters {
        display: flex;
        gap: 20px;
        align-items: end;
        margin-bottom: 30px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .filter-group label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
    }
    
    .filter-group select {
        padding: 8px 12px;
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        font-size: 14px;
    }
    
    .reports-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 30px;
    }
    
    .report-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .report-card h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 20px;
    }
    
    .report-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .report-stat {
        text-align: center;
    }
    
    .report-stat .stat-label {
        display: block;
        font-size: 12px;
        color: #64748b;
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .report-stat .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e40af;
    }
    
    .feedback-analysis {
        display: flex;
        gap: 30px;
        align-items: center;
    }
    
    .feedback-score {
        text-align: center;
    }
    
    .feedback-score .score {
        display: block;
        font-size: 3rem;
        font-weight: 700;
        color: #1e40af;
    }
    
    .feedback-score .score-label {
        font-size: 14px;
        color: #64748b;
    }
    
    .feedback-breakdown {
        flex: 1;
    }
    
    .rating-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }
    
    .rating-item span:first-child {
        width: 80px;
        color: #fbbf24;
    }
    
    .rating-bar {
        flex: 1;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .rating-fill {
        height: 100%;
        background: linear-gradient(90deg, #1e40af, #f97316);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .rating-item span:last-child {
        width: 40px;
        text-align: right;
        font-size: 14px;
        color: #64748b;
    }
    
    @media (max-width: 768px) {
        .students-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
        }
        
        .search-box {
            width: 100%;
        }
        
        .students-grid {
            grid-template-columns: 1fr;
        }
        
        .mentee-cards {
            grid-template-columns: 1fr;
        }
        
        .reports-filters {
            flex-direction: column;
            align-items: stretch;
        }
        
        .reports-content {
            grid-template-columns: 1fr;
        }
        
        .feedback-analysis {
            flex-direction: column;
            text-align: center;
        }
    }
`;

// Add counsellor-specific styles
const styleSheet = document.createElement('style');
styleSheet.textContent = counsellorStyles;
document.head.appendChild(styleSheet);
