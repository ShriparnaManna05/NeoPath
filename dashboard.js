// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const userData = JSON.parse(currentUser);
    updateUserInfo(userData);
    
    // Initialize dashboard
    initializeDashboard();
});

function updateUserInfo(userData) {
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        // Display user's actual name if available, otherwise use email
        const displayName = userData.name || userData.email || userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1);
        userNameElement.textContent = `Welcome, ${displayName}`;
    }
}

function initializeDashboard() {
    // Set up sidebar navigation
    setupSidebarNavigation();
    
    // Set up form handlers
    setupFormHandlers();
    
    // Load initial data
    loadDashboardData();
}

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get section ID from href
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Load section-specific data
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'overview':
            loadOverviewData();
            break;
        case 'profile':
            loadProfileData();
            break;
        case 'assessments':
            loadAssessmentsData();
            break;
        case 'results':
            loadResultsData();
            break;
        case 'sessions':
            loadSessionsData();
            break;
        case 'career-paths':
            loadCareerPathsData();
            break;
    }
}

function setupFormHandlers() {
    // Profile form
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }
    
    // Session booking form
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            bookSession();
        });
    }
    
    // Assessment buttons
    const assessmentButtons = document.querySelectorAll('.assessment-card .btn');
    assessmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const assessmentCard = this.closest('.assessment-card');
            const assessmentName = assessmentCard.querySelector('h3').textContent;
            startAssessment(assessmentName);
        });
    });
}

function loadDashboardData() {
    // Load user-specific data from localStorage or API
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update stats based on user data
    updateStats();
}

function updateStats() {
    // This would typically fetch data from an API
    // For demo purposes, we'll use mock data
    const stats = {
        assessmentsTaken: 3,
        averageScore: 85,
        sessionsBooked: 2,
        careerPaths: 5
    };
    
    // Update stat cards
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = stats.assessmentsTaken;
        statNumbers[1].textContent = stats.averageScore + '%';
        statNumbers[2].textContent = stats.sessionsBooked;
        statNumbers[3].textContent = stats.careerPaths;
    }
}

function loadOverviewData() {
    // Load recent assessments
    loadRecentAssessments();
    
    // Load upcoming sessions
    loadUpcomingSessions();
}

function loadRecentAssessments() {
    // Mock data for recent assessments
    const assessments = [
        {
            name: 'Aptitude Test',
            completed: '2 days ago',
            score: '92%',
            status: 'passed'
        },
        {
            name: 'Personality Test',
            completed: '1 week ago',
            score: '78%',
            status: 'passed'
        },
        {
            name: 'Skill Assessment',
            completed: 'In Progress',
            score: '-',
            status: 'pending'
        }
    ];
    
    // Update assessment list in overview
    updateAssessmentList(assessments);
}

function loadUpcomingSessions() {
    // Mock data for upcoming sessions
    const sessions = [
        {
            title: 'Career Guidance Session',
            counsellor: 'Dr. Sarah Johnson',
            time: 'Tomorrow, 2:00 PM',
            action: 'Join'
        },
        {
            title: 'Skills Development',
            counsellor: 'Prof. Michael Chen',
            time: 'Next Friday, 10:00 AM',
            action: 'Reschedule'
        }
    ];
    
    // Update session list in overview
    updateSessionList(sessions);
}

function loadProfileData() {
    // Load user profile data
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    
    // Populate profile form with user data
    if (userData) {
        // Prefer saved profile from localStorage, fallback to defaults
        const savedProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
        const profileData = savedProfile || {
            firstName: (userData.name && userData.name.split(' ')[0]) || 'John',
            lastName: (userData.name && userData.name.split(' ').slice(1).join(' ')) || 'Doe',
            email: userData.email,
            phone: '+1 (555) 123-4567',
            dob: '2000-01-15',
            gender: 'male',
            skills: 'JavaScript, Python, React, Data Analysis, Communication',
            interests: 'Software Development, Data Science, Product Management'
        };
        
        populateProfileForm(profileData);
        
        // Update profile header card if present
        const profileInfo = document.querySelector('.profile-info');
        if (profileInfo) {
            const nameEl = profileInfo.querySelector('h2');
            const emailEl = profileInfo.querySelector('p:nth-of-type(1)');
            const phoneEl = profileInfo.querySelector('p:nth-of-type(2)');
            if (nameEl) nameEl.textContent = `${profileData.firstName} ${profileData.lastName}`.trim();
            if (emailEl) emailEl.textContent = profileData.email;
            if (phoneEl) phoneEl.textContent = profileData.phone;
        }
    }
}

function populateProfileForm(data) {
    const form = document.querySelector('.profile-form');
    if (!form) return;
    
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`#${key}`);
        if (input) {
            input.value = data[key];
        }
    });
}

function updateProfile() {
    const form = document.querySelector('.profile-form');
    const formData = new FormData(form);
    
    // Collect form data
    const profileData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        skills: document.getElementById('skills').value,
        interests: document.getElementById('interests').value
    };
    
    // Save to localStorage (in real app, send to API)
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // Update currentUser name and email for consistency across app
    const currentUserRaw = localStorage.getItem('currentUser');
    if (currentUserRaw) {
        const currentUser = JSON.parse(currentUserRaw);
        currentUser.name = `${profileData.firstName} ${profileData.lastName}`.trim();
        currentUser.email = profileData.email;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        // Refresh welcome banner if present
        updateUserInfo(currentUser);
    }
    
    // Update profile header card if present
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        const nameEl = profileInfo.querySelector('h2');
        const emailEl = profileInfo.querySelector('p:nth-of-type(1)');
        const phoneEl = profileInfo.querySelector('p:nth-of-type(2)');
        if (nameEl) nameEl.textContent = `${profileData.firstName} ${profileData.lastName}`.trim();
        if (emailEl) emailEl.textContent = profileData.email;
        if (phoneEl) phoneEl.textContent = profileData.phone;
    }
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

function loadAssessmentsData() {
    // Mock assessment data
    const assessments = [
        {
            name: 'Aptitude Test',
            description: 'Test your logical reasoning, mathematical ability, and problem-solving skills.',
            duration: '60 minutes',
            questions: '50 questions',
            status: 'available'
        },
        {
            name: 'Personality Test',
            description: 'Discover your personality traits and how they align with different career paths.',
            duration: '45 minutes',
            questions: '100 questions',
            status: 'available'
        },
        {
            name: 'Skill Assessment',
            description: 'Evaluate your technical and soft skills across various domains.',
            duration: '90 minutes',
            questions: '75 questions',
            status: 'available'
        }
    ];
    
    // Update assessment cards
    updateAssessmentCards(assessments);
}

function startAssessment(assessmentName) {
    // Show assessment modal or redirect to assessment page
    showNotification(`Starting ${assessmentName}...`, 'info');
    
    // In a real app, this would redirect to the assessment interface
    setTimeout(() => {
        showNotification(`${assessmentName} completed! Check your results.`, 'success');
        // Update dashboard stats
        updateStats();
    }, 2000);
}

function loadResultsData() {
    // Mock results data
    const results = [
        {
            name: 'Aptitude Test',
            score: '92%',
            status: 'passed',
            strengths: [
                'Logical Reasoning: 95%',
                'Mathematical Ability: 88%',
                'Problem Solving: 90%'
            ],
            improvements: [
                'Verbal Reasoning: 75%',
                'Abstract Thinking: 80%'
            ]
        },
        {
            name: 'Personality Test',
            score: '78%',
            status: 'passed',
            personalityType: 'Analyst (INTJ) - Strategic, independent, and analytical',
            recommendations: [
                'Software Engineer',
                'Data Scientist',
                'Research Analyst'
            ]
        }
    ];
    
    // Update results display
    updateResultsDisplay(results);
}

function loadSessionsData() {
    // Load session history and booking options
    loadSessionHistory();
    loadCounsellorOptions();
}

function loadSessionHistory() {
    // Mock session history
    const sessions = [
        {
            title: 'Career Guidance Session',
            counsellor: 'Dr. Sarah Johnson',
            date: 'Completed on Dec 15, 2024',
            rating: '★★★★★',
            ratingText: 'Excellent'
        },
        {
            title: 'Skills Development',
            counsellor: 'Prof. Michael Chen',
            date: 'Completed on Dec 8, 2024',
            rating: '★★★★☆',
            ratingText: 'Very Good'
        }
    ];
    
    // Update session history display
    updateSessionHistory(sessions);
}

function loadCounsellorOptions() {
    // Mock counsellor data
    const counsellors = [
        { id: 'sarah', name: 'Dr. Sarah Johnson', specialty: 'Career Guidance' },
        { id: 'michael', name: 'Prof. Michael Chen', specialty: 'Skills Development' },
        { id: 'emma', name: 'Dr. Emma Wilson', specialty: 'Industry Insights' }
    ];
    
    // Populate counsellor dropdown
    const counsellorSelect = document.getElementById('counsellor');
    if (counsellorSelect) {
        counsellorSelect.innerHTML = '<option value="">Choose a counsellor</option>';
        counsellors.forEach(counsellor => {
            const option = document.createElement('option');
            option.value = counsellor.id;
            option.textContent = `${counsellor.name} - ${counsellor.specialty}`;
            counsellorSelect.appendChild(option);
        });
    }
}

function bookSession() {
    const form = document.querySelector('.booking-form');
    const formData = new FormData(form);
    
    const sessionData = {
        counsellor: document.getElementById('counsellor').value,
        sessionType: document.getElementById('sessionType').value,
        date: document.getElementById('sessionDate').value,
        time: document.getElementById('sessionTime').value
    };
    
    // Validate form
    if (!sessionData.counsellor || !sessionData.sessionType || !sessionData.date || !sessionData.time) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Save session booking
    const bookings = JSON.parse(localStorage.getItem('sessionBookings') || '[]');
    bookings.push({
        ...sessionData,
        id: Date.now(),
        status: 'pending'
    });
    localStorage.setItem('sessionBookings', JSON.stringify(bookings));
    
    showNotification('Session booked successfully!', 'success');
    form.reset();
}

function loadCareerPathsData() {
    // Mock career paths data
    const careerPaths = [
        {
            name: 'Software Engineer',
            match: '95%',
            description: 'Develop applications and software solutions using programming languages and frameworks.',
            salary: '$70,000 - $150,000',
            growth: '22% (2020-2030)',
            skills: 'Programming, Problem Solving, Teamwork'
        },
        {
            name: 'Data Scientist',
            match: '88%',
            description: 'Analyze complex data to help organizations make informed business decisions.',
            salary: '$80,000 - $180,000',
            growth: '36% (2020-2030)',
            skills: 'Statistics, Machine Learning, Python'
        },
        {
            name: 'Product Manager',
            match: '82%',
            description: 'Lead product development and strategy to deliver value to customers and business.',
            salary: '$90,000 - $200,000',
            growth: '8% (2020-2030)',
            skills: 'Leadership, Communication, Strategy'
        }
    ];
    
    // Update career paths display
    updateCareerPaths(careerPaths);
}

// Utility functions
function updateAssessmentList(assessments) {
    // Update assessment list in overview section
    const assessmentList = document.querySelector('.assessment-list');
    if (!assessmentList) return;
    
    assessmentList.innerHTML = assessments.map(assessment => `
        <div class="assessment-item">
            <div class="assessment-info">
                <h4>${assessment.name}</h4>
                <p>${assessment.completed}</p>
            </div>
            <div class="assessment-score">
                <span class="score">${assessment.score}</span>
                <span class="status ${assessment.status}">${assessment.status === 'passed' ? 'Passed' : 'Pending'}</span>
            </div>
        </div>
    `).join('');
}

function updateSessionList(sessions) {
    // Update session list in overview section
    const sessionList = document.querySelector('.session-list');
    if (!sessionList) return;
    
    sessionList.innerHTML = sessions.map(session => `
        <div class="session-item">
            <div class="session-info">
                <h4>${session.title}</h4>
                <p>with ${session.counsellor}</p>
                <p class="session-time">${session.time}</p>
            </div>
            <div class="session-actions">
                <button class="btn btn-sm ${session.action === 'Join' ? 'btn-primary' : 'btn-outline'}">${session.action}</button>
            </div>
        </div>
    `).join('');
}

function updateAssessmentCards(assessments) {
    // Update assessment cards in assessments section
    const assessmentCards = document.querySelectorAll('.assessment-card');
    assessmentCards.forEach((card, index) => {
        if (assessments[index]) {
            const assessment = assessments[index];
            const title = card.querySelector('h3');
            const description = card.querySelector('p');
            const duration = card.querySelector('.duration');
            const questions = card.querySelector('.questions');
            
            if (title) title.textContent = assessment.name;
            if (description) description.textContent = assessment.description;
            if (duration) duration.innerHTML = `<i class="fas fa-clock"></i> ${assessment.duration}`;
            if (questions) questions.innerHTML = `<i class="fas fa-question-circle"></i> ${assessment.questions}`;
        }
    });
}

function updateResultsDisplay(results) {
    // Update results display in results section
    const resultsContainer = document.querySelector('.results-container');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="result-card">
            <div class="result-header">
                <h3>${result.name}</h3>
                <span class="result-score ${result.status}">${result.score} - ${result.status === 'passed' ? 'Passed' : 'Failed'}</span>
            </div>
            <div class="result-details">
                ${result.strengths ? `
                    <div class="result-section">
                        <h4>Strengths</h4>
                        <ul>
                            ${result.strengths.map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${result.improvements ? `
                    <div class="result-section">
                        <h4>Areas for Improvement</h4>
                        <ul>
                            ${result.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${result.personalityType ? `
                    <div class="result-section">
                        <h4>Personality Type</h4>
                        <p><strong>${result.personalityType}</strong></p>
                    </div>
                ` : ''}
                ${result.recommendations ? `
                    <div class="result-section">
                        <h4>Career Recommendations</h4>
                        <ul>
                            ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function updateSessionHistory(sessions) {
    // Update session history in sessions section
    const sessionHistory = document.querySelector('.session-history .session-list');
    if (!sessionHistory) return;
    
    sessionHistory.innerHTML = sessions.map(session => `
        <div class="session-item">
            <div class="session-info">
                <h4>${session.title}</h4>
                <p>with ${session.counsellor}</p>
                <p class="session-date">${session.date}</p>
            </div>
            <div class="session-rating">
                <span class="rating">${session.rating}</span>
                <span class="rating-text">${session.ratingText}</span>
            </div>
        </div>
    `).join('');
}

function updateCareerPaths(careerPaths) {
    // Update career paths in career-paths section
    const careerPathsGrid = document.querySelector('.career-paths-grid');
    if (!careerPathsGrid) return;
    
    careerPathsGrid.innerHTML = careerPaths.map(path => `
        <div class="career-path-card">
            <div class="career-icon">
                <i class="fas fa-${getCareerIcon(path.name)}"></i>
            </div>
            <h3>${path.name}</h3>
            <p class="match-score">${path.match} Match</p>
            <p>${path.description}</p>
            <div class="career-details">
                <div class="detail-item">
                    <span class="detail-label">Salary Range:</span>
                    <span class="detail-value">${path.salary}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Growth Rate:</span>
                    <span class="detail-value">${path.growth}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Required Skills:</span>
                    <span class="detail-value">${path.skills}</span>
                </div>
            </div>
            <button class="btn btn-primary">Learn More</button>
        </div>
    `).join('');
}

function getCareerIcon(careerName) {
    const iconMap = {
        'Software Engineer': 'code',
        'Data Scientist': 'chart-bar',
        'Product Manager': 'briefcase',
        'Marketing Manager': 'bullhorn',
        'Financial Analyst': 'chart-line'
    };
    return iconMap[careerName] || 'briefcase';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return iconMap[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colorMap = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    return colorMap[type] || '#3b82f6';
}

function logout() {
    // Clear user data
    localStorage.removeItem('currentUser');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
