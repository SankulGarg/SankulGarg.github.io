// Portfolio Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Scroll animations
    initScrollAnimations();
    
    // Contact form
    initContactForm();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize animations
    initAnimations();
});

// Navigation Management
function initNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close menu when clicking on nav links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('.section');
    
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.getBoundingClientRect().top + scrollY - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active-link'));
                if (navLink) {
                    navLink.classList.add('active-link');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Call once on load
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });

    // Add animation classes to timeline items
    const timelineItems = document.querySelectorAll('.timeline__item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        observer.observe(item);
    });

    // Add animation classes to skill categories
    const skillCategories = document.querySelectorAll('.skills__category');
    skillCategories.forEach((category, index) => {
        category.style.animationDelay = `${index * 0.2}s`;
        observer.observe(category);
    });

    // Add animation classes to project cards
    const projectCards = document.querySelectorAll('.project__card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// Contact Form Management
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link (since we can't actually send emails from client-side)
            const mailtoLink = `mailto:gargsankul@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Simulate sending delay
            setTimeout(() => {
                // Open email client
                window.location.href = mailtoLink;
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('btn--loading');
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Thank you! Your email client should open with the message prepared.', 'success');
            }, 1500);
        });
        
        // Form validation
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    removeErrorMessage(field);
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    } else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

// Show error message for field
function showErrorMessage(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    field.parentNode.appendChild(errorElement);
}

// Remove error message
function removeErrorMessage(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: var(--space-16) var(--space-20);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform var(--duration-normal) var(--ease-standard);
    `;
    
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize animations and interactions
function initAnimations() {
    // Animate skill tags on hover
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add staggered animation to hero elements
    const heroElements = [
        '.hero__title',
        '.hero__subtitle', 
        '.hero__description',
        '.hero__buttons'
    ];
    
    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s var(--ease-standard)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        }
    });
    
    // Hero avatar animation
    const heroAvatar = document.querySelector('.hero__avatar');
    if (heroAvatar) {
        heroAvatar.style.opacity = '0';
        heroAvatar.style.transform = 'scale(0.8)';
        heroAvatar.style.transition = 'all 1s var(--ease-standard)';
        
        setTimeout(() => {
            heroAvatar.style.opacity = '1';
            heroAvatar.style.transform = 'scale(1)';
        }, 800);
    }
}

// Header background on scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    function updateHeaderBackground() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(var(--color-slate-900-rgb), 0.98)';
        } else {
            header.style.backgroundColor = 'rgba(var(--color-slate-900-rgb), 0.95)';
        }
    }
    
    window.addEventListener('scroll', updateHeaderBackground);
    updateHeaderBackground();
}

// Initialize header scroll effect
initHeaderScroll();

// Typing animation for hero title
function initTypingAnimation() {
    const heroName = document.querySelector('.hero__name');
    if (heroName) {
        const text = heroName.textContent;
        heroName.textContent = '';
        heroName.style.borderRight = '2px solid var(--color-primary)';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroName.style.borderRight = 'none';
                }, 500);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
}

// Initialize typing animation
setTimeout(initTypingAnimation, 1500);

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    }
    
    window.addEventListener('scroll', updateParallax);
}

// Initialize parallax (optional, can be removed if not desired)
// initParallax();

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimizations
const debouncedScrollHandler = debounce(() => {
    // Any scroll-based updates can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);