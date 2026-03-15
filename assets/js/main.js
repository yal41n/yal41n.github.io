/* =====================================================
   GAPLIZZER – main.js
   Smooth scroll · FAQ accordion · Demo modal · Reveal
   Benchmark bar animations
   ===================================================== */

const DEMO_EMAIL = "YOUR_EMAIL"; // ← replace with your real email address

/* ── Smooth scrolling for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Close mobile nav if open
    if (navLinks) navLinks.classList.remove("open");
    if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  });
});

/* ── Mobile hamburger ── */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
  });
}

/* ── Demo modal ── */
const modal      = document.getElementById("demo-modal");
const modalClose = document.getElementById("modal-close");
const openBtns   = document.querySelectorAll(".open-demo-modal");
const demoForm   = document.getElementById("demo-form");

function openModal() {
  if (!modal) return;
  modal.classList.add("open");
  modal.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
  if (modalClose) modalClose.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openBtns.forEach(btn => btn.addEventListener("click", openModal));
if (modalClose) modalClose.addEventListener("click", closeModal);

// Close on backdrop click
if (modal) {
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
}

// Close on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
});

// Demo form submission via mailto
if (demoForm) {
  demoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name    = (demoForm.querySelector('[name="name"]')?.value    || "").trim();
    const email   = (demoForm.querySelector('[name="email"]')?.value   || "").trim();
    const company = (demoForm.querySelector('[name="company"]')?.value || "").trim();
    const message = (demoForm.querySelector('[name="message"]')?.value || "").trim();

    const subject = encodeURIComponent(`GAPLIZZER Demo Request — ${company || name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${DEMO_EMAIL}?subject=${subject}&body=${body}`;
    closeModal();
  });
}

/* ── FAQ accordion ── */
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", function () {
    const item   = this.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const inner  = item.querySelector(".faq-answer-inner");
    const isOpen = item.classList.contains("open");

    // Close all
    document.querySelectorAll(".faq-item.open").forEach(openItem => {
      const a = openItem.querySelector(".faq-answer");
      openItem.classList.remove("open");
      openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      a.style.maxHeight = "0";
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = inner.scrollHeight + "px";
    }
  });
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── Benchmark bar animations ── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".bmark-bar-fill[data-width]").forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".benchmark-visual").forEach(el => barObserver.observe(el));

/* ── Footer year ── */
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
