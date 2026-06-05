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
      { threshold: 0.18 }
    );

    animatedSections.forEach(section => observer.observe(section));
  } else {
    animatedSections.forEach(revealSection);
  }

  /* ===== Hero video autoplay fallback ===== */
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    if (heroVideo.paused) {
      heroVideo
        .play()
        .catch(() => {
          // If autoplay is blocked, we leave it paused and rely on user controls.
        });
    }
    heroVideo.addEventListener("error", () => {
      heroVideo.classList.add("hidden-video");
    });
  }

  /* ===== Inline film player (trailer / full) ===== */
  const filmFrame = document.getElementById("filmFrame");
  const videoToggles = document.querySelectorAll("[data-video]");
  const setVideoButtons = document.querySelectorAll("[data-set-video]");

  const videoSources = {
    trailer: filmFrame?.dataset.srcTrailer || "",
    full: filmFrame?.dataset.srcFull || "",
  };

  const setVideo = type => {
    if (!filmFrame) return;
    const src = videoSources[type] || videoSources.trailer;
    if (src && filmFrame.src !== src) {
      filmFrame.src = src;
    }
    videoToggles.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.video === type);
    });
  };

  if (filmFrame) {
    setVideo("trailer");
  }

  videoToggles.forEach(btn => {
    btn.addEventListener("click", () => setVideo(btn.dataset.video));
  });

  setVideoButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const type = btn.dataset.setVideo;
      setVideo(type);
      const filmSection = document.getElementById("film");
      if (filmSection) {
        filmSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ===== Smooth scroll for nav links ===== */
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      window.scrollTo({
        top: targetEl.offsetTop - 70,
        behavior: "smooth",
      });
    });
  });

  /* ===== Dynamic year in footer ===== */
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
