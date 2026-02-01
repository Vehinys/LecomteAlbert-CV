/* ==================== SCRIPT.JS ==================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Swiper Initialization (Main Slider) ---
    const swiper = new Swiper(".mySwiper", {
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 10000, // 10 seconds as requested
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination-main",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next-main",
            prevEl: ".swiper-button-prev-main",
        },
        effect: 'coverflow', // Optional cool effect
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false, // Cleaner without shadows on transparent
        },
    });

    // --- 2. Nested Swipers (Galleries) ---
    const nestedSwipers = document.querySelectorAll('.nestedSwiper');
    nestedSwipers.forEach(swiperElement => {
        new Swiper(swiperElement, {
            loop: true,
            nested: true, // Crucial for nested inside another swiper
            pagination: {
                el: swiperElement.querySelector(".swiper-pagination"),
                clickable: true,
            },
            navigation: {
                nextEl: swiperElement.querySelector(".swiper-button-next"),
                prevEl: swiperElement.querySelector(".swiper-button-prev"),
            },
        });
    });

    // --- 3. Typing Animation ---
    const textToType = ["Concepteur WordPress", "Prototypage UI/UX", "Développeur Front-End"];
    const typeWriterElement = document.getElementById('typewriter');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentText = textToType[textIndex];
        
        if (isDeleting) {
            typeWriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeWriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textToType.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();

    // --- 4. Mobile Menu Toggle ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if(menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
    }

    // --- 5. Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Close mobile menu if open
            if(mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                menuBtn.setAttribute('aria-expanded', 'false');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                 targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Shift focus to target for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });

    // --- 6. GDPR Modal Logic (Accessible) ---
    const modalTrigger = document.getElementById('modal-trigger');
    const modal = document.getElementById('gdpr-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');

    function openModal() {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        modalCloseBtn.focus(); // Shift focus to close button
        
        // Trap Focus
        modal.addEventListener('keydown', trapFocus);
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        modalTrigger.focus(); // Return focus to trigger
        modal.removeEventListener('keydown', trapFocus);
    }

    function trapFocus(e) {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    if(modalTrigger && modal && modalCloseBtn) {
        modalTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
        modalCloseBtn.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);
    }
});
