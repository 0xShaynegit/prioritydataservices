/* Priority Data Services - native JS only: scroll reveals, stat counters */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ticker ---------- */
  const tickerTrack = document.querySelector(".ticker__track");
  if (tickerTrack) {
    if (reducedMotion) {
      tickerTrack.style.overflow = "hidden";
    } else {
      // Clone once for seamless loop, then measure actual rendered width
      tickerTrack.innerHTML += tickerTrack.innerHTML;
      let pos = 0;
      let lastTs = null;
      const isMobile = window.innerWidth <= 720;
      const speed = isMobile ? 0.12 : 0.04; // px per ms — desktop: ~40px/s (slow crawl), mobile: ~120px/s
      const loop = (ts) => {
        const half = tickerTrack.scrollWidth / 2;
        if (lastTs !== null) pos += (ts - lastTs) * speed;
        if (pos >= half) pos -= half;
        tickerTrack.style.transform = `translateX(${-pos}px)`;
        lastTs = ts;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- stat counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reducedMotion || target === 0) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); /* easeOutQuart */
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && !reducedMotion) {
    const statIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => statIo.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- hamburger + mobile nav ---------- */
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("is-open");
      mobileNav.classList.toggle("is-open", open);
      hamburger.setAttribute("aria-expanded", open);
      mobileNav.setAttribute("aria-hidden", !open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    const closeNav = () => {
      hamburger.classList.remove("is-open");
      mobileNav.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileNav.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const closeBtn = mobileNav.querySelector(".mobile-nav__close");
    if (closeBtn) closeBtn.addEventListener("click", closeNav);

    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          closeNav();
          setTimeout(() => {
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: "smooth" });
          }, 320);
        } else {
          closeNav();
        }
      });
    });
  }

  /* ---------- desktop services dropdown ---------- */
  const dropdownTriggers = document.querySelectorAll(".nav-dropdown__trigger");
  dropdownTriggers.forEach(trigger => {
    const item = trigger.closest(".nav-item--dropdown");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", item.classList.contains("is-open"));
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-item--dropdown.is-open").forEach(el => {
      el.classList.remove("is-open");
      el.querySelector(".nav-dropdown__trigger").setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- before/after comparison sliders ---------- */
  document.querySelectorAll("[data-compare]").forEach((el) => {
    const beforeImg = el.querySelector(".compare__img--before");
    const handle = el.querySelector(".compare__handle");
    if (!beforeImg || !handle) return;

    const setPos = (x) => {
      const rect = el.getBoundingClientRect();
      const pct = Math.min(Math.max((x - rect.left) / rect.width, 0.05), 0.95);
      const clipRight = (1 - pct) * 100;
      beforeImg.style.clipPath = `inset(0 ${clipRight}% 0 0)`;
      handle.style.left = pct * 100 + "%";
    };

    let dragging = false;
    el.addEventListener("mousedown", (e) => { dragging = true; setPos(e.clientX); });
    window.addEventListener("mousemove", (e) => { if (dragging) setPos(e.clientX); });
    window.addEventListener("mouseup", () => { dragging = false; });

    el.addEventListener("touchstart", (e) => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    el.addEventListener("touchmove", (e) => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    el.addEventListener("touchend", () => { dragging = false; });
  });

  /* ---------- cursor label ---------- */
  const cursorLabel = document.getElementById("cursor-label");
  if (cursorLabel) {
    document.querySelectorAll("[data-cursor-label]").forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursorLabel.textContent = el.dataset.cursorLabel;
        cursorLabel.classList.add("is-visible");
      });
      el.addEventListener("mousemove", e => {
        cursorLabel.style.left = e.clientX + "px";
        cursorLabel.style.top = e.clientY + "px";
      });
      el.addEventListener("mouseleave", () => {
        cursorLabel.classList.remove("is-visible");
      });
    });
  }

})();
