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
      const loop = (ts) => {
        const half = tickerTrack.scrollWidth / 2;
        if (lastTs !== null) pos += (ts - lastTs) * 0.18; // px per ms (~18px/s)
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

})();
