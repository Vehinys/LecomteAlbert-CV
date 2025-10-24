
// ==================== VARIABLES GLOBALES ====================

const burgerMenu = document.getElementById('burgerMenu');
const navMenu = document.getElementById('navMenu');
const backToTopBtn = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-menu a');

// ==================== GESTION DU THÈME (Mode Sombre/Clair) ====================

function initTheme() {
    const savedTheme = localStorage.getItem('theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        themeToggle.setAttribute('aria-pressed', 'true');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', isDark);
    
    themeToggle.style.transform = 'scale(0.9) rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    initTheme();
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
        document.body.classList.toggle('dark-mode', e.matches);
    }
});

// ==================== MENU BURGER (Mobile) ====================

function toggleMenu() {
    const isExpanded = burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    burgerMenu.setAttribute('aria-expanded', isExpanded);
    burgerMenu.setAttribute('aria-label', isExpanded ? 'Fermer le menu' : 'Ouvrir le menu');
    
    document.body.style.overflow = isExpanded ? 'hidden' : '';
    
    if (isExpanded) {
        navMenu.querySelector('a')?.focus();
    }
}

if (burgerMenu) {
    burgerMenu.addEventListener('click', toggleMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

document.addEventListener('click', (event) => {
    if (navMenu.classList.contains('active')) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnBurger = burgerMenu.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnBurger) {
            toggleMenu();
        }
    }
});

// ==================== NAVIGATION AU CLAVIER (RGAA) ====================

document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu();
        burgerMenu.focus();
    }
    
    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {

            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {

            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// ==================== BOUTON RETOUR EN HAUT ====================

function handleBackToTop() {
    const scrollPosition = window.scrollY;
    const isVisible = scrollPosition > 300;
    
    backToTopBtn.classList.toggle('visible', isVisible);
    backToTopBtn.setAttribute('aria-hidden', !isVisible);
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            handleBackToTop();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            document.querySelector('.skip-link')?.focus();
        }, 500);
    });
}

// ==================== SMOOTH SCROLL AVEC OFFSET ====================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                targetSection.focus();
            }
        }
    });
});

// ==================== INTERSECTION OBSERVER (Animations) ====================

if ('IntersectionObserver' in window) {
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
    
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==================== LAZY LOADING DES IMAGES ====================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== AMÉLIORATION DES FOCUS VISIBLES ====================

let isUsingMouse = false;

document.addEventListener('mousedown', () => {
    isUsingMouse = true;
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        isUsingMouse = false;
    }
});

document.addEventListener('focusin', (e) => {
    if (!isUsingMouse) {
        e.target.classList.add('keyboard-focus');
    }
});

document.addEventListener('focusout', (e) => {
    e.target.classList.remove('keyboard-focus');
});

// ==================== GESTION DES ERREURS D'IMAGES ====================

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.background = '#f1f5f9';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.alt = this.alt || 'Image non disponible';
        console.warn('Erreur de chargement d\'image:', this.src);
    });
});

// ==================== ANALYTICS RESPECT RGPD ====================

function requestAnalyticsConsent() {

    const consent = localStorage.getItem('analytics-consent');
    
    if (consent === null) {

        console.log('Consentement analytics requis (RGPD)');
    } else if (consent === 'accepted') {

        console.log('Analytics autorisés par l\'utilisateur');
    }
}

// ==================== DÉTECTION DE CONNEXION INTERNET ====================

window.addEventListener('online', () => {
    console.log('✅ Connexion Internet rétablie');
});

window.addEventListener('offline', () => {
    console.log('⚠️ Connexion Internet perdue');
});

// ==================== PROTECTION CONTRE LE SPAM ====================

document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function(e) {
        console.log('📧 Ouverture du client email');
    });
});