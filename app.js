/* Modern Lending   native JS only: scroll reveals, stat counters, calculator */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
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
    const duration = 1200;
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

  /* ---------- repayment calculator ---------- */
  const amount = document.getElementById("amount");
  const rate = document.getElementById("rate");
  const term = document.getElementById("term");
  const amountOut = document.getElementById("amount-out");
  const rateOut = document.getElementById("rate-out");
  const termOut = document.getElementById("term-out");
  const repaymentOut = document.getElementById("repayment");

  if (amount && rate && term && repaymentOut) {
    const aud = new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    });

    const update = () => {
      const principal = Number(amount.value);
      const annualRate = Number(rate.value);
      const years = Number(term.value);

      amountOut.textContent = aud.format(principal);
      rateOut.textContent = annualRate.toFixed(2) + "% p.a.";
      termOut.textContent = years + " years";

      const r = annualRate / 100 / 12;
      const n = years * 12;
      const monthly =
        r === 0
          ? principal / n
          : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      repaymentOut.textContent = aud.format(Math.round(monthly));
    };

    [amount, rate, term].forEach((input) =>
      input.addEventListener("input", update)
    );
    update();
  }
})();
