/* ===== Hero entrance — fires on full page load ===== */
window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

/* ===== Cursor glow spotlight ===== */
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow) {
  let cx = -300, cy = -300, rafPending = false;
  document.addEventListener("mousemove", e => {
    cx = e.clientX;
    cy = e.clientY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        cursorGlow.style.background =
          `radial-gradient(520px circle at ${cx}px ${cy}px, rgba(15,118,110,0.08), transparent 42%)`;
        rafPending = false;
      });
    }
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {

  /* ===== Scroll-in animation ===== */
  const animatedSections = document.querySelectorAll(".animate-section");
  const revealSection = section => section.classList.add("visible");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealSection(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    animatedSections.forEach(section => observer.observe(section));
  } else {
    animatedSections.forEach(revealSection);
  }

  /* ===== Hero video autoplay fallback ===== */
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    if (heroVideo.paused) {
      heroVideo.play().catch(() => {});
    }
    heroVideo.addEventListener("error", () => {
      heroVideo.classList.add("hidden-video");
    });
  }

  /* ===== Hamburger / mobile nav ===== */
  const hamburger = document.getElementById("hamburger");
  const navRight = document.getElementById("navRight");
  const mainNav = document.getElementById("mainNav");

  if (hamburger && navRight) {
    const openNav = () => {
      hamburger.classList.add("open");
      navRight.classList.add("open");
      hamburger.setAttribute("aria-label", "Close navigation");
      document.body.style.overflow = "hidden";
    };

    const closeNav = () => {
      hamburger.classList.remove("open");
      navRight.classList.remove("open");
      hamburger.setAttribute("aria-label", "Open navigation");
      document.body.style.overflow = "";
    };

    hamburger.addEventListener("click", e => {
      e.stopPropagation();
      hamburger.classList.contains("open") ? closeNav() : openNav();
    });

    // Close when a nav link is clicked
    navRight.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", closeNav);
    });

    // Close on Escape key
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && navRight.classList.contains("open")) closeNav();
    });

    // Close when tapping the mobile overlay background or outside the nav
    document.addEventListener("click", e => {
      if (
        navRight.classList.contains("open") &&
        (
          e.target === navRight ||
          (mainNav && !mainNav.contains(e.target))
        )
      ) {
        closeNav();
      }
    });
  }

  /* ===== Dynamic year in footer ===== */
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ===== Scroll progress bar ===== */
  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = total > 0 ? (scrolled / total * 100) + "%" : "0%";
    }, { passive: true });
  }

  /* ===== Animated stat counters ===== */
  const statNumbers = document.querySelectorAll("[data-count]");

  const animateCount = el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const isFloat = el.dataset.count.includes(".");
    const duration = 1600;
    const startTime = performance.now();

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const tick = now => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOut(progress);
      el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && statNumbers.length > 0) {
    const countObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach(el => countObserver.observe(el));
  } else {
    statNumbers.forEach(el => {
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      el.textContent = prefix + el.dataset.count + suffix;
    });
  }

});
