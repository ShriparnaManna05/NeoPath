// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Modal Functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showRegisterModal(userType = '') {
    document.getElementById('registerModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    if (userType) {
        document.getElementById('regUserType').value = userType;
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        closeModal('loginModal');
    }
    if (event.target === registerModal) {
        closeModal('registerModal');
    }
});

// Form Handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('userType').value;
    
    // Simulate login process
    if (email && password && userType) {
        // Get user info from registered users
        const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = registeredUsers.find(u => u.email === email && u.userType === userType);
        
        // Store user data in localStorage with name if available
        const userData = {
            email: email,
            name: user ? user.name : email.split('@')[0], // Use name from registration or extract from email
            userType: userType,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Redirect to appropriate dashboard
        redirectToDashboard(userType);
    } else {
        alert('Please fill in all fields');
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userType = document.getElementById('regUserType').value;
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    
    if (name && email && password && phone && userType) {
        // Store user data
        const userData = {
            name: name,
            email: email,
            phone: phone,
            userType: userType,
            registrationTime: new Date().toISOString()
        };
        
        // Store in localStorage (in a real app, this would be sent to a server)
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        existingUsers.push(userData);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        alert('Registration successful! Please login to continue.');
        closeModal('registerModal');
        showLoginModal();
    } else {
        alert('Please fill in all fields');
    }
});

// Dashboard Redirection
function redirectToDashboard(userType) {
    closeModal('loginModal');
    
    switch(userType) {
        case 'student':
            window.location.href = 'student-dashboard.html';
            break;
        case 'counsellor':
            window.location.href = 'counsellor-dashboard.html';
            break;
        case 'admin':
            window.location.href = 'admin-dashboard.html';
            break;
        default:
            alert('Invalid user type');
    }
}

// Scroll to features section
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
}

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .user-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        // Update navigation to show user is logged in
        updateNavigationForLoggedInUser(userData);
    }
});

function updateNavigationForLoggedInUser(userData) {
    const navMenu = document.querySelector('.nav-menu');
    const loginBtn = navMenu.querySelector('.login-btn');
    const registerBtn = navMenu.querySelector('.register-btn');
    
    if (loginBtn && registerBtn) {
        loginBtn.textContent = `Dashboard (${userData.userType})`;
        loginBtn.onclick = () => redirectToDashboard(userData.userType);
        registerBtn.style.display = 'none';
    }
}
