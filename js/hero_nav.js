/**
 * Navigation Controller
 * Handles Lenis initialization, GSAP synchronization, and Smart Navbar logic.
 * * Dependencies: GSAP 3+, ScrollTrigger, Lenis
 */

console.log("nav");

document.addEventListener("DOMContentLoaded", () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const lenis = window.lenis;

  // 5. --- Smart Navbar Logic ---

  const navbar = document.querySelector(".navbar");
  let lastScrollY = 0;
  let isHidden = false;
  let heroRemoved = false; // Track if hero intro is complete

  // Config
  const threshold = 100; // Minimum scroll before hiding starts
  const tolerance = 5; // Small buffer to prevent jitter

  // Listen for hero removal event
  window.addEventListener("heroAway", () => {
    heroRemoved = true;
  });

  // Navbar Entrance Animation - Triggered from animations.js or local
  window.revealNavbar = () => {
    if (!prefersReducedMotion) {
      gsap.to(navbar, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
      });
    } else {
      gsap.set(navbar, { opacity: 1, yPercent: 0 });
    }
  };

  // Initial state: Hidden until hero animation completes
  gsap.set(navbar, { yPercent: -100, opacity: 0 });

  // Scroll Handler for Hide/Show
  if (lenis && lenis.on) {
    lenis.on("scroll", ({ scroll }) => {
      // Don't run hide/show logic until hero is removed
      if (!heroRemoved) return;

      const currentScroll = Math.max(0, scroll);

      if (currentScroll < threshold) {
        if (isHidden) {
          showNavbar();
        }
        lastScrollY = currentScroll;
        return;
      }

      const diff = currentScroll - lastScrollY;

      if (diff > tolerance && !isHidden) {
        hideNavbar();
      } else if (diff < -tolerance && isHidden) {
        showNavbar();
      }

      lastScrollY = currentScroll;
    });
  }

  function hideNavbar() {
    if (prefersReducedMotion) return;

    isHidden = true;
    gsap.to(navbar, {
      yPercent: -100,
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true, // Ensure we kill any conflicting tweens
    });
  }

  function showNavbar() {
    isHidden = false;
    gsap.to(navbar, {
      yPercent: 0,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  }

  // 4. --- Scroll-To Section Logic ---

  const navLinks = document.querySelectorAll(".nav-links a");

  // Map data-targets to actual DOM IDs
  // 0: Home (#hero), 1: About (#about), 2: Team (#team), 3: Contact (Footer)
  const targetMap = {
    0: "#hero",
    1: "#about",
    2: "#team",
    3: ".site-footer",
    4: "./pebbles.html",
    5: "./register.html",
  };

  // navLinks.forEach((link) => {
  //   link.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     const targetKey = link.getAttribute("data-target");
  //     const selector = targetMap[targetKey];
  //     const targetSection = document.querySelector(selector);

  //     if (targetSection) {
  //       const overflowHidden =
  //         getComputedStyle(document.body).overflow === "hidden" ||
  //         document.body.style.overflow === "hidden";
  //       if (lenis && !overflowHidden && typeof lenis.scrollTo === "function") {
  //         lenis.scrollTo(targetSection, {
  //           offset: 0,
  //           duration: 1.5,
  //           easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //           immediate: false,
  //         });
  //       } else {
  //         targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  //       }
  //     }
  //   });
  // });

  // 5. --- Accessibility Fixes ---

  // Ensure keyboard focus brings navbar into view
  navbar.addEventListener("focusin", () => {
    if (isHidden) showNavbar();
  });
});

// Easter Egg Logic
const logo = document.getElementById("logo");
const egg = document.getElementById("easterEgg");
const closeBtn = document.querySelector(".close-btn");

if (logo && egg && closeBtn) {
  let clickCount = 0;
  let clickTimer;

  logo.addEventListener("click", () => {
    clickCount++;
    clearTimeout(clickTimer);

    // reset counter if user pauses
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 1200);

    if (clickCount === 3) {
      egg.classList.remove("hidden");
      clickCount = 0;
    }
  });

  closeBtn.addEventListener("click", () => {
    egg.classList.add("hidden");
  });
}
