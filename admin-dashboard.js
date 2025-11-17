// Admin Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in as admin
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.userType !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    updateUserInfo(userData);
    initializeAdminDashboard();
});

function updateUserInfo(userData) {
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        // Display user's actual name if available, otherwise use default
        const displayName = userData.name || userData.email || 'Administrator';
        userNameElement.textContent = `Welcome, ${displayName}`;
    }
}

function initializeAdminDashboard() {
    setupUserManagement();
    setupSessionManagement();
    setupAssessmentManagement();
    setupReportGeneration();
    setupResourceManagement();
    setupSystemSettings();
    loadAdminData();
}

function setupUserManagement() {
    // Setup user search and filtering
    const userSearch = document.getElementById('userSearch');
    const userTypeFilter = document.getElementById('userTypeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
    if (userTypeFilter) {
        userTypeFilter.addEventListener('change', filterUsers);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterUsers);
    }
}

function setupSessionManagement() {
    // Setup session filters
    const sessionFilters = [
        'sessionDateFrom', 'sessionDateTo', 'sessionTypeFilter', 'sessionStatusFilter'
    ];
    
    sessionFilters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', filterSessions);
        }
    });
}

function setupAssessmentManagement() {
    // Setup assessment management features
    const assessmentButtons = document.querySelectorAll('.assessment-type-card .btn');
    assessmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const assessmentType = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            manageAssessments(assessmentType);
        });
    });
}

function setupReportGeneration() {
    // Setup report generation
    const reportType = document.getElementById('reportType');
    const reportPeriod = document.getElementById('reportPeriod');
    
    if (reportType) {
        reportType.addEventListener('change', updateReportPreview);
    }
    if (reportPeriod) {
        reportPeriod.addEventListener('change', updateReportPreview);
    }
}

function setupResourceManagement() {
    // Setup resource management features
    const resourceButtons = document.querySelectorAll('.resource-actions .btn');
    resourceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.toLowerCase();
            const resourceCard = this.closest('.resource-card');
            const resourceName = resourceCard.querySelector('h3').textContent;
            handleResourceAction(action, resourceName);
        });
    });
}

function setupSystemSettings() {
    // Setup settings form
    const settingsForm = document.querySelector('.settings-container');
    if (settingsForm) {
        loadSettings();
    }
}

function loadAdminData() {
    // Load admin dashboard data
    loadUserData();
    loadSessionData();
    loadAssessmentData();
    loadReportData();
    loadResourceData();
    loadSystemMetrics();
}

function loadUserData() {
    // Mock user data
    const users = [
        {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            type: 'student',
            status: 'active',
            lastActive: '2 hours ago'
        },
        {
            name: 'Dr. Emma Wilson',
            email: 'emma.wilson@neopath.com',
            type: 'counsellor',
            status: 'active',
            lastActive: '1 hour ago'
        },
        {
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            type: 'student',
            status: 'inactive',
            lastActive: '3 days ago'
        }
    ];
    
    updateUserTable(users);
}

function updateUserTable(users) {
    const tbody = document.querySelector('.users-table tbody');
    if (tbody) {
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            <i class="fas fa-${user.type === 'student' ? 'user-graduate' : 'chalkboard-teacher'}"></i>
                        </div>
                        <div>
                            <h4>${user.name}</h4>
                            <p>${user.email}</p>
                        </div>
                    </div>
                </td>
                <td><span class="user-type ${user.type}">${user.type.charAt(0).toUpperCase() + user.type.slice(1)}</span></td>
                <td><span class="status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                <td>${user.lastActive}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="editUser('${user.name}')">Edit</button>
                        <button class="btn btn-sm btn-outline" onclick="viewUser('${user.name}')">View</button>
                        <button class="btn btn-sm ${user.status === 'active' ? 'btn-danger' : 'btn-success'}" 
                                onclick="${user.status === 'active' ? 'suspendUser' : 'activateUser'}('${user.name}')">
                            ${user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const userType = document.getElementById('userTypeFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    const rows = document.querySelectorAll('.users-table tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('h4').textContent.toLowerCase();
        const email = row.querySelector('p').textContent.toLowerCase();
        const type = row.querySelector('.user-type').textContent.toLowerCase();
        const userStatus = row.querySelector('.status').textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesType = !userType || type.includes(userType);
        const matchesStatus = !status || userStatus.includes(status);
        
        if (matchesSearch && matchesType && matchesStatus) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

function loadSessionData() {
    // Mock session data
    const sessions = [
        {
            id: 'SES-001',
            student: 'Sarah Johnson',
            counsellor: 'Dr. Emma Wilson',
            type: 'video',
            date: 'Dec 20, 2024 10:00 AM',
            status: 'completed',
            rating: '★★★★★'
        },
        {
            id: 'SES-002',
            student: 'Michael Chen',
            counsellor: 'Dr. Sarah Johnson',
            type: 'chat',
            date: 'Dec 20, 2024 2:00 PM',
            status: 'scheduled',
            rating: '-'
        },
        {
            id: 'SES-003',
            student: 'Emma Wilson',
            counsellor: 'Prof. David Lee',
            type: 'offline',
            date: 'Dec 19, 2024 3:00 PM',
            status: 'completed',
            rating: '★★★★☆'
        }
    ];
    
    updateSessionTable(sessions);
}

function updateSessionTable(sessions) {
    const tbody = document.querySelector('.sessions-table tbody');
    if (tbody) {
        tbody.innerHTML = sessions.map(session => `
            <tr>
                <td>#${session.id}</td>
                <td>${session.student}</td>
                <td>${session.counsellor}</td>
                <td><span class="session-type ${session.type}">${getSessionTypeLabel(session.type)}</span></td>
                <td>${session.date}</td>
                <td><span class="status ${session.status}">${session.status.charAt(0).toUpperCase() + session.status.slice(1)}</span></td>
                <td><span class="rating">${session.rating}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewSession('${session.id}')">View</button>
                </td>
            </tr>
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

function filterSessions() {
    const dateFrom = document.getElementById('sessionDateFrom').value;
    const dateTo = document.getElementById('sessionDateTo').value;
    const type = document.getElementById('sessionTypeFilter').value;
    const status = document.getElementById('sessionStatusFilter').value;
    
    const rows = document.querySelectorAll('.sessions-table tbody tr');
    
    rows.forEach(row => {
        const sessionType = row.querySelector('.session-type').textContent.toLowerCase();
        const sessionStatus = row.querySelector('.status').textContent.toLowerCase();
        
        const matchesType = !type || sessionType.includes(type);
        const matchesStatus = !status || sessionStatus.includes(status);
        
        if (matchesType && matchesStatus) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

function loadAssessmentData() {
    // Mock assessment data
    const assessments = {
        total: 5247,
        completed: 4892,
        inProgress: 355,
        averageScore: 78,
        types: [
            {
                name: 'Aptitude Tests',
                completed: 1247,
                averageScore: 82,
                passRate: 89
            },
            {
                name: 'Personality Tests',
                completed: 1156,
                averageScore: 76,
                completionRate: 94
            },
            {
                name: 'Skill Assessments',
                completed: 1234,
                averageScore: 71,
                passRate: 78
            }
        ]
    };
    
    updateAssessmentDisplay(assessments);
}

function updateAssessmentDisplay(assessments) {
    // Update assessment stats
    const statsCards = document.querySelectorAll('.assessment-stats .stat-card');
    if (statsCards.length >= 4) {
        statsCards[0].querySelector('.stat-number').textContent = assessments.total;
        statsCards[1].querySelector('.stat-number').textContent = assessments.completed;
        statsCards[2].querySelector('.stat-number').textContent = assessments.inProgress;
        statsCards[3].querySelector('.stat-number').textContent = assessments.averageScore + '%';
    }
    
    // Update assessment type cards
    const typeCards = document.querySelectorAll('.assessment-type-card');
    typeCards.forEach((card, index) => {
        if (assessments.types[index]) {
            const type = assessments.types[index];
            const header = card.querySelector('.type-header');
            const stats = card.querySelector('.type-stats');
            
            if (header) {
                header.querySelector('h3').textContent = type.name;
                header.querySelector('.type-count').textContent = `${type.completed} completed`;
            }
            
            if (stats) {
                const statItems = stats.querySelectorAll('.stat');
                if (statItems.length >= 2) {
                    statItems[0].querySelector('.stat-label').textContent = 
                        type.passRate ? 'Pass Rate' : 'Average Score';
                    statItems[0].querySelector('.stat-value').textContent = 
                        (type.passRate || type.averageScore) + '%';
                    statItems[1].querySelector('.stat-label').textContent = 
                        type.completionRate ? 'Completion Rate' : 'Average Score';
                    statItems[1].querySelector('.stat-value').textContent = 
                        (type.completionRate || type.averageScore) + '%';
                }
            }
        }
    });
}

function loadReportData() {
    // Mock report data
    const reportData = {
        totalUsers: 1336,
        activeSessions: 2156,
        assessmentCompletions: 4892,
        revenue: 45200,
        userGrowth: 12,
        sessionGrowth: 18,
        assessmentGrowth: 25,
        revenueGrowth: 25
    };
    
    updateReportDisplay(reportData);
}

function updateReportDisplay(data) {
    // Update report metrics
    const metrics = document.querySelectorAll('.metric-item');
    if (metrics.length >= 4) {
        metrics[0].querySelector('.metric-value').textContent = data.totalUsers.toLocaleString();
        metrics[1].querySelector('.metric-value').textContent = data.activeSessions.toLocaleString();
        metrics[2].querySelector('.metric-value').textContent = data.assessmentCompletions.toLocaleString();
        metrics[3].querySelector('.metric-value').textContent = '$' + (data.revenue / 1000).toFixed(1) + 'K';
        
        // Update growth indicators
        metrics.forEach((metric, index) => {
            const changeElement = metric.querySelector('.metric-change');
            if (changeElement) {
                const growthRates = [data.userGrowth, data.sessionGrowth, data.assessmentGrowth, data.revenueGrowth];
                changeElement.textContent = '+' + growthRates[index] + '%';
            }
        });
    }
}

function loadResourceData() {
    // Mock resource data
    const resources = [
        {
            name: 'Career Guide 2024',
            description: 'Comprehensive guide to modern career paths',
            type: 'Guide',
            downloads: 1247,
            icon: 'fas fa-file-pdf'
        },
        {
            name: 'Interview Skills Workshop',
            description: 'Video series on mastering job interviews',
            type: 'Video',
            downloads: 856,
            icon: 'fas fa-video'
        },
        {
            name: 'Industry Links',
            description: 'Curated list of industry resources',
            type: 'Links',
            downloads: 2134,
            icon: 'fas fa-link'
        }
    ];
    
    updateResourceDisplay(resources);
}

function updateResourceDisplay(resources) {
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid) {
        resourcesGrid.innerHTML = resources.map(resource => `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="${resource.icon}"></i>
                </div>
                <div class="resource-info">
                    <h3>${resource.name}</h3>
                    <p>${resource.description}</p>
                    <div class="resource-meta">
                        <span class="downloads">${resource.downloads} ${resource.type === 'Video' ? 'views' : 'downloads'}</span>
                        <span class="category">${resource.type}</span>
                    </div>
                </div>
                <div class="resource-actions">
                    <button class="btn btn-sm btn-primary" onclick="editResource('${resource.name}')">Edit</button>
                    <button class="btn btn-sm btn-outline" onclick="viewResource('${resource.name}')">View</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteResource('${resource.name}')">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

function loadSystemMetrics() {
    // Mock system metrics
    const metrics = {
        serverStatus: { status: 'online', value: 100 },
        databasePerformance: { status: 'good', value: 95 },
        apiResponseTime: { status: 'good', value: 88 },
        storageUsage: { status: 'warning', value: 75 }
    };
    
    updateSystemMetrics(metrics);
}

function updateSystemMetrics(metrics) {
    const metricItems = document.querySelectorAll('.metric-item');
    const metricData = [
        metrics.serverStatus,
        metrics.databasePerformance,
        metrics.apiResponseTime,
        metrics.storageUsage
    ];
    
    metricItems.forEach((item, index) => {
        if (metricData[index]) {
            const metric = metricData[index];
            const statusIndicator = item.querySelector('.status-indicator');
            const metricFill = item.querySelector('.metric-fill');
            
            if (statusIndicator) {
                statusIndicator.textContent = metric.status.charAt(0).toUpperCase() + metric.status.slice(1);
                statusIndicator.className = `status-indicator ${metric.status}`;
            }
            
            if (metricFill) {
                metricFill.style.width = metric.value + '%';
                if (metric.status === 'warning') {
                    metricFill.classList.add('warning');
                }
            }
        }
    });
}

function loadSettings() {
    // Load system settings from localStorage or API
    const settings = JSON.parse(localStorage.getItem('systemSettings') || '{}');
    
    // Populate settings form
    Object.keys(settings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = settings[key];
            } else {
                element.value = settings[key];
            }
        }
    });
}

// User Management Functions
function editUser(userName) {
    showNotification(`Editing user: ${userName}`, 'info');
    // In a real app, this would open a user edit modal
}

function viewUser(userName) {
    showNotification(`Viewing profile: ${userName}`, 'info');
    // In a real app, this would open a user profile modal
}

function suspendUser(userName) {
    if (confirm(`Are you sure you want to suspend ${userName}?`)) {
        showNotification(`${userName} has been suspended`, 'success');
        // In a real app, this would update the user status
    }
}

function activateUser(userName) {
    showNotification(`${userName} has been activated`, 'success');
    // In a real app, this would update the user status
}

function showAddUserModal() {
    showNotification('Add User feature coming soon!', 'info');
    // In a real app, this would open a user creation modal
}

// Session Management Functions
function viewSession(sessionId) {
    showNotification(`Viewing session: ${sessionId}`, 'info');
    // In a real app, this would open a session details modal
}

function exportSessions() {
    showNotification('Exporting session data...', 'info');
    // In a real app, this would generate and download a CSV/Excel file
    setTimeout(() => {
        showNotification('Session data exported successfully!', 'success');
    }, 2000);
}

// Assessment Management Functions
function manageAssessments(assessmentType) {
    showNotification(`Managing ${assessmentType} assessments...`, 'info');
    // In a real app, this would open an assessment management interface
}

// Report Functions
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportPeriod = document.getElementById('reportPeriod').value;
    
    showNotification(`Generating ${reportType} report for last ${reportPeriod} days...`, 'info');
    
    setTimeout(() => {
        showNotification('Report generated successfully!', 'success');
        // In a real app, this would generate the actual report
    }, 2000);
}

function exportReport() {
    showNotification('Exporting report to PDF...', 'info');
    // In a real app, this would generate and download a PDF report
    setTimeout(() => {
        showNotification('Report exported successfully!', 'success');
    }, 2000);
}

function updateReportPreview() {
    const reportType = document.getElementById('reportType').value;
    const reportPeriod = document.getElementById('reportPeriod').value;
    
    showNotification(`Previewing ${reportType} report for last ${reportPeriod} days...`, 'info');
    // In a real app, this would update the report preview
}

// Resource Management Functions
function showAddResourceModal() {
    showNotification('Add Resource feature coming soon!', 'info');
    // In a real app, this would open a resource creation modal
}

function editResource(resourceName) {
    showNotification(`Editing resource: ${resourceName}`, 'info');
    // In a real app, this would open a resource edit modal
}

function viewResource(resourceName) {
    showNotification(`Viewing resource: ${resourceName}`, 'info');
    // In a real app, this would open a resource viewer
}

function deleteResource(resourceName) {
    if (confirm(`Are you sure you want to delete ${resourceName}?`)) {
        showNotification(`${resourceName} has been deleted`, 'success');
        // In a real app, this would delete the resource
    }
}

function handleResourceAction(action, resourceName) {
    switch(action) {
        case 'edit':
            editResource(resourceName);
            break;
        case 'view':
            viewResource(resourceName);
            break;
        case 'delete':
            deleteResource(resourceName);
            break;
    }
}

// Settings Functions
function saveSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        siteDescription: document.getElementById('siteDescription').value,
        maintenanceMode: document.getElementById('maintenanceMode').checked,
        allowRegistration: document.getElementById('allowRegistration').checked,
        emailVerification: document.getElementById('emailVerification').checked,
        sessionTimeout: document.getElementById('sessionTimeout').value,
        assessmentTimeLimit: document.getElementById('assessmentTimeLimit').value,
        passingScore: document.getElementById('passingScore').value,
        retakeLimit: document.getElementById('retakeLimit').value
    };
    
    // Save settings to localStorage (in real app, send to API)
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    
    showNotification('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        // Reset to default values
        document.getElementById('siteName').value = 'NeoPath';
        document.getElementById('siteDescription').value = 'Reinventing the Career Journey';
        document.getElementById('maintenanceMode').checked = false;
        document.getElementById('allowRegistration').checked = true;
        document.getElementById('emailVerification').checked = true;
        document.getElementById('sessionTimeout').value = 30;
        document.getElementById('assessmentTimeLimit').value = 60;
        document.getElementById('passingScore').value = 70;
        document.getElementById('retakeLimit').value = 3;
        
        showNotification('Settings reset to default', 'success');
    }
}

// Additional CSS for admin-specific elements
const adminStyles = `
    .users-header, .sessions-header, .reports-header, .resources-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .search-filters, .session-filters, .report-filters {
        display: flex;
        gap: 20px;
        align-items: end;
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
    
    .filter-group select,
    .filter-group input {
        padding: 8px 12px;
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        font-size: 14px;
    }
    
    .users-table, .sessions-table {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .users-table table, .sessions-table table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .users-table th, .sessions-table th {
        background: #f8fafc;
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #374151;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .users-table td, .sessions-table td {
        padding: 15px;
        border-bottom: 1px solid #f1f5f9;
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .user-avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #1e40af, #f97316);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
    }
    
    .user-info h4 {
        font-size: 14px;
        font-weight: 600;
        color: #1e40af;
        margin: 0;
    }
    
    .user-info p {
        font-size: 12px;
        color: #64748b;
        margin: 0;
    }
    
    .user-type, .status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
    }
    
    .user-type.student {
        background: #dbeafe;
        color: #1e40af;
    }
    
    .user-type.counsellor {
        background: #dcfce7;
        color: #166534;
    }
    
    .user-type.admin {
        background: #fef3c7;
        color: #92400e;
    }
    
    .status.active {
        background: #dcfce7;
        color: #166534;
    }
    
    .status.inactive {
        background: #f3f4f6;
        color: #6b7280;
    }
    
    .status.suspended {
        background: #fee2e2;
        color: #dc2626;
    }
    
    .status.completed {
        background: #dcfce7;
        color: #166534;
    }
    
    .status.scheduled {
        background: #dbeafe;
        color: #1e40af;
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
    
    .action-buttons {
        display: flex;
        gap: 8px;
    }
    
    .btn-danger {
        background: #ef4444;
        color: white;
        border: none;
    }
    
    .btn-danger:hover {
        background: #dc2626;
    }
    
    .btn-success {
        background: #10b981;
        color: white;
        border: none;
    }
    
    .btn-success:hover {
        background: #059669;
    }
    
    .assessment-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .assessment-types {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px;
    }
    
    .assessment-type-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .type-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .type-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e40af;
        margin: 0;
    }
    
    .type-count {
        font-size: 14px;
        color: #64748b;
    }
    
    .type-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .type-stats .stat {
        text-align: center;
    }
    
    .type-stats .stat-label {
        display: block;
        font-size: 12px;
        color: #64748b;
        margin-bottom: 5px;
    }
    
    .type-stats .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e40af;
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
    
    .metric-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }
    
    .metric-item {
        text-align: center;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .metric-label {
        display: block;
        font-size: 14px;
        color: #64748b;
        margin-bottom: 8px;
    }
    
    .metric-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: #1e40af;
        margin-bottom: 5px;
    }
    
    .metric-change {
        font-size: 14px;
        font-weight: 600;
    }
    
    .metric-change.positive {
        color: #10b981;
    }
    
    .metric-change.negative {
        color: #ef4444;
    }
    
    .chart-container {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .counsellor-ranking {
        space-y: 15px;
    }
    
    .ranking-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: #f8fafc;
        border-radius: 8px;
        margin-bottom: 10px;
    }
    
    .rank {
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #1e40af, #f97316);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
    }
    
    .counsellor-info h4 {
        font-size: 1rem;
        font-weight: 600;
        color: #1e40af;
        margin: 0 0 5px 0;
    }
    
    .counsellor-info p {
        font-size: 14px;
        color: #64748b;
        margin: 0;
    }
    
    .counsellor-stats {
        text-align: right;
    }
    
    .counsellor-stats .rating {
        display: block;
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e40af;
        margin-bottom: 5px;
    }
    
    .counsellor-stats .sessions {
        font-size: 12px;
        color: #64748b;
    }
    
    .resources-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
    }
    
    .resource-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .resource-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #1e40af, #f97316);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
    }
    
    .resource-info {
        flex: 1;
    }
    
    .resource-info h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 8px;
    }
    
    .resource-info p {
        color: #64748b;
        margin-bottom: 10px;
        font-size: 14px;
    }
    
    .resource-meta {
        display: flex;
        gap: 15px;
        font-size: 12px;
    }
    
    .resource-meta .downloads {
        color: #64748b;
    }
    
    .resource-meta .category {
        background: #e2e8f0;
        color: #475569;
        padding: 2px 8px;
        border-radius: 4px;
    }
    
    .resource-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .settings-container {
        max-width: 1000px;
    }
    
    .settings-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
        margin-bottom: 30px;
    }
    
    .settings-section {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .settings-section h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 20px;
    }
    
    .setting-item {
        margin-bottom: 20px;
    }
    
    .setting-item label {
        display: block;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
    }
    
    .setting-item input,
    .setting-item textarea,
    .setting-item select {
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        font-size: 14px;
    }
    
    .setting-item input[type="checkbox"] {
        width: auto;
        margin-right: 10px;
    }
    
    .setting-description {
        display: block;
        font-size: 12px;
        color: #64748b;
        margin-top: 5px;
    }
    
    .settings-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .health-metrics {
        space-y: 15px;
    }
    
    .metric-item {
        margin-bottom: 20px;
    }
    
    .metric-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .metric-label span:first-child {
        font-weight: 500;
        color: #374151;
    }
    
    .status-indicator {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
    }
    
    .status-indicator.online {
        background: #dcfce7;
        color: #166534;
    }
    
    .status-indicator.good {
        background: #dbeafe;
        color: #1e40af;
    }
    
    .status-indicator.warning {
        background: #fef3c7;
        color: #92400e;
    }
    
    .metric-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .metric-fill {
        height: 100%;
        background: linear-gradient(90deg, #1e40af, #f97316);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .metric-fill.warning {
        background: linear-gradient(90deg, #f59e0b, #ef4444);
    }
    
    .activity-list {
        space-y: 15px;
    }
    
    .activity-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 0;
        border-bottom: 1px solid #f1f5f9;
    }
    
    .activity-item:last-child {
        border-bottom: none;
    }
    
    .activity-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #1e40af, #f97316);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
    }
    
    .activity-content h4 {
        font-size: 14px;
        font-weight: 600;
        color: #1e40af;
        margin: 0 0 5px 0;
    }
    
    .activity-content p {
        font-size: 12px;
        color: #64748b;
        margin: 0 0 5px 0;
    }
    
    .activity-time {
        font-size: 11px;
        color: #94a3b8;
    }
    
    @media (max-width: 768px) {
        .search-filters, .session-filters, .report-filters {
            flex-direction: column;
            align-items: stretch;
        }
        
        .search-box {
            width: 100%;
        }
        
        .users-table, .sessions-table {
            overflow-x: auto;
        }
        
        .assessment-types {
            grid-template-columns: 1fr;
        }
        
        .resources-grid {
            grid-template-columns: 1fr;
        }
        
        .settings-sections {
            grid-template-columns: 1fr;
        }
        
        .resource-card {
            flex-direction: column;
            text-align: center;
        }
        
        .resource-actions {
            flex-direction: row;
            justify-content: center;
        }
    }
`;

// Add admin-specific styles
const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);
