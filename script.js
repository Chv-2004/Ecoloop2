// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const signupModal = document.getElementById('signupModal');
const projectsGrid = document.getElementById('projectsGrid');

// Global variable to hold all projects from localStorage
let allProjects = [];

// Mobile Navigation
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        plastic: 'wine-bottle',
        metal: 'cog',
        paper: 'newspaper',
        organic: 'leaf'
    };
    return icons[category] || 'recycle';
}

// Get star rating
function getStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Extract YouTube video ID
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Render projects
function renderProjects(category = 'all') {
    if (!projectsGrid) return;

    allProjects = JSON.parse(localStorage.getItem('userProjects')) || [];
    const approvedProjects = allProjects.filter(p => p.status === 'approved');

    const filteredProjects = category === 'all'
        ? approvedProjects
        : approvedProjects.filter(p => p.category === category);

    projectsGrid.innerHTML = '';

    if (filteredProjects.length === 0) {
        document.getElementById('no-projects-message').style.display = 'block';
    } else {
        document.getElementById('no-projects-message').style.display = 'none';
        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            const videoId = getYouTubeId(project.videoUrl);
            const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

            projectCard.innerHTML = `
                <div class="project-image-container">
                    <img src="${thumbnailUrl}" alt="${project.title} Thumbnail" class="project-thumbnail">
                    <button class="btn btn-play-overlay" onclick="viewProject(${project.id})">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <div class="project-rating">
                            <span class="stars">${getStars(project.rating)}</span>
                            <span>${project.rating}/5</span>
                        </div>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }
}

// View project details in a modal
function viewProject(projectId) {
    const project = allProjects.find(p => p.id == projectId);
    if (!project) return;
    
    const videoId = getYouTubeId(project.videoUrl);
    const videoEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="video-responsive">
                <iframe width="560" height="315" src="${videoEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <h2>${project.title}</h2>
            <p style="color: #666; margin-bottom: 1rem;">${project.description}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: #1B5E20; margin-bottom: 1rem;">Materials Needed</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${project.materials.map(material => `<li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                            <i class="fas fa-check" style="color: #2E7D32; margin-right: 0.5rem;"></i>${material}
                        </li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h3 style="color: #1B5E20; margin-bottom: 1rem;">Rating</h3>
                    <p><strong>Rating:</strong> ${getStars(project.rating)} ${project.rating}/5</p>
                </div>
            </div>
            
            <div>
                <h3 style="color: #1B5E20; margin-bottom: 1rem;">Step-by-Step Instructions</h3>
                <ol style="padding-left: 1.5rem;">
                    ${project.steps.map((step, index) => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Filter projects
function filterProjects(category, clickedElement) {
    const allFilterButtons = document.querySelectorAll('.btn-filter');
    allFilterButtons.forEach(btn => btn.classList.remove('active'));
    if (clickedElement) {
        clickedElement.classList.add('active');
    }

    renderProjects(category);
}

// Modal functions
function openSignupModal() {
    signupModal.style.display = 'block';
}

function closeSignupModal() {
    signupModal.style.display = 'none';
}

window.addEventListener('click', (e) => {
    if (e.target === signupModal) {
        closeSignupModal();
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.category-card, .project-card, .feature-card, .stat-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    checkAuthStatus();
    renderProjects();

    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    const modalSignupForm = document.getElementById('modalSignupForm');
    if (modalSignupForm) {
        modalSignupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleModalSignup();
        });
    }
    
});

function registerUser(name, email, password) {
    let users = JSON.parse(localStorage.getItem('ecoloopUsers')) || [];

    if (users.some(user => user.email === email)) {
        return false;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('ecoloopUsers', JSON.stringify(users));
    return true;
}

function loginUser(email, password, rememberMe) {
    let users = JSON.parse(localStorage.getItem('ecoloopUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const sessionUser = { name: user.name, email: user.email };
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('ecoloopUser', JSON.stringify(sessionUser));
        return user;
    }
    return false;
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('ecoloopUser') || sessionStorage.getItem('ecoloopUser');
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (loginBtn && userMenu && userName) {
        if (savedUser) {
            const user = JSON.parse(savedUser);
            loginBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            userName.textContent = user.name;
        } else {
            loginBtn.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }
}

function logout() {
    localStorage.removeItem('ecoloopUser');
    sessionStorage.removeItem('ecoloopUser');
    window.location.href = 'index.html';
}

function adminLogin(username, password) {
    if (username === 'ecoloop@admin' && password === 'ecoloop@123') {
        showToast('Admin login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
        return true;
    } else {
        showToast('Invalid admin credentials.', 'error');
        return false;
    }
}

function handleModalSignup() {
    const name = document.getElementById('modalSignupName').value;
    const email = document.getElementById('modalSignupEmail').value;
    const password = document.getElementById('modalSignupPassword').value;
    const confirmPassword = document.getElementById('modalSignupConfirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match. Please try again.', 'error');
        return;
    }

    if (registerUser(name, email, password)) {
        showToast('Account created! Please sign in.', 'success');
        closeSignupModal();
    } else {
        showToast('An account with this email already exists.', 'error');
    }
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> <p>${message}</p>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);