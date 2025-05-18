// Page navigation order with section names
const pages = [
    { file: 'index.html', name: 'Home' },
    { file: 'about.html', name: 'About' },
    { file: 'skills.html', name: 'Skills' },
    { file: 'projects.html', name: 'Projects' },
    { file: 'education.html', name: 'Education' },
    { file: 'achievements.html', name: 'Achievements' },
    { file: 'contact.html', name: 'Contact' }
];

let currentPageIndex = 0;

// Navigation function
function navigatePage(direction) {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentIndex = pages.findIndex(page => page.file === currentPage);

    let nextIndex;
    if (direction === 'next') {
        nextIndex = currentIndex + 1;
        if (nextIndex >= pages.length) {
            nextIndex = 0; // Loop back to first page
        }
    } else {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
            nextIndex = pages.length - 1; // Loop to last page
        }
    }

    // Navigate to the next/previous page
    window.location.href = pages[nextIndex].file;
}

// Add keyboard navigation
document.addEventListener('keydown', (event) => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (event.key === 'ArrowRight') {
        navigatePage('next');
    } else if (event.key === 'ArrowLeft' && currentPage !== 'index.html') {
        navigatePage('prev');
    }
});

// Optional: Add swipe navigation for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const swipeThreshold = 50; // minimum distance for swipe
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && currentPage !== 'index.html') {
            // Swipe right (previous)
            navigatePage('prev');
        } else if (swipeDistance < 0) {
            // Swipe left (next)
            navigatePage('next');
        }
    }
}

// Initialize current page index
function initCurrentPageIndex() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    currentPageIndex = Math.max(0, pages.indexOf(currentPage));
}

// Initialize when the page loads
window.addEventListener('load', () => {
    initCurrentPageIndex();
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Update icon
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.mobile-menu-btn')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
    }
}); 