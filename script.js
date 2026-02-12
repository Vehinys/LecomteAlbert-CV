/* ==================== SCRIPT.JS ==================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed. Initializing Swipers...");

  // --- 1. Swiper Initialization (Main Slider) ---
  const swiper = new Swiper(".mySwiper", {
    loop: true,
    speed: 1000,
    autoHeight: true, // Enable autoHeight to prevent truncation
    observer: true,
    observeParents: true,
    autoplay: {
      delay: 10000,
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
    effect: "coverflow",
    coverflowEffect: {
      rotate: 15, // Reduced rotation for mobile
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    breakpoints: {
      // Adjust effect for mobile
      320: {
        effect: "slide", // Switch to simple slide on mobile
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 0,
        },
      },
      768: {
        effect: "coverflow",
        coverflowEffect: {
          rotate: 15,
          depth: 100,
        },
      },
    },
    on: {
      init: function () {
        this.update();
      },
    },
  });

  // --- 2. Nested Swipers (Galleries) ---
  const nestedSwipers = document.querySelectorAll(".nestedSwiper");
  nestedSwipers.forEach((swiperElement) => {
    const nSwiper = new Swiper(swiperElement, {
      loop: true,
      nested: true,
      observer: true,
      observeParents: true,
      pagination: {
        el: swiperElement.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: swiperElement.querySelector(".swiper-button-next"),
        prevEl: swiperElement.querySelector(".swiper-button-prev"),
      },
    });
    setTimeout(() => {
      nSwiper.update();
      console.log("Nested Swiper updated:", swiperElement);
    }, 1000);
  });

  // --- 3. Typing Animation ---
  const textToType = [
    "Concepteur WordPress",
    "Prototypage UI/UX",
    "Développeur Front-End",
  ];
  const typeWriterElement = document.getElementById("typewriter");
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
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("flex");
    });
  }

  // --- 5. Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
        menuBtn.setAttribute("aria-expanded", "false");
      }

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
        // Shift focus to target for accessibility
        targetElement.setAttribute("tabindex", "-1");
        targetElement.focus();
      }
    });
  });

  // --- 6. GDPR Modal Logic (Accessible) ---
  const modalTrigger = document.getElementById("modal-trigger");
  const modal = document.getElementById("gdpr-modal");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalBackdrop = document.getElementById("modal-backdrop");

  function openModal() {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scroll
    modalCloseBtn.focus(); // Shift focus to close button

    // Trap Focus
    modal.addEventListener("keydown", trapFocus);
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    modalTrigger.focus(); // Return focus to trigger
    modal.removeEventListener("keydown", trapFocus);
  }

  function trapFocus(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  if (modalTrigger && modal && modalCloseBtn) {
    modalTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
    modalCloseBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);
  }

  // --- 7. Contact Form AJAX Submission ---
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Store original button content
      const originalBtnContent = submitBtn.innerHTML;

      // Set loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Envoi en cours...</span>
            `;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // Success state
          submitBtn.classList.remove("from-acid-green", "to-electric-cyan");
          submitBtn.classList.add("bg-green-500");
          submitBtn.innerHTML = `<span>Envoyé ! ✓</span>`;
          contactForm.reset();

          // Reset button after 5 seconds
          setTimeout(() => {
            submitBtn.classList.remove("bg-green-500");
            submitBtn.classList.add("from-acid-green", "to-electric-cyan");
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
          }, 5000);
        } else {
          throw new Error("Erreur lors de l'envoi");
        }
      } catch (error) {
        // Error state
        submitBtn.classList.remove("from-acid-green", "to-electric-cyan");
        submitBtn.classList.add("bg-red-500", "text-white");
        submitBtn.innerHTML = `<span>Erreur ! Réessayez</span>`;

        setTimeout(() => {
          submitBtn.classList.remove("bg-red-500", "text-white");
          submitBtn.classList.add("from-acid-green", "to-electric-cyan");
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // --- 8. Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      root: null,
      threshold: 0.15, // Trigger when 15% of the element is visible
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // --- 9. Body Scroll Animation (Hue Rotate) ---
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    // Use documentElement.scrollHeight to get full page height including body
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    // Update CSS variable on body
    document.body.style.setProperty("--scroll-progress", scrollPercent);
  });
});
