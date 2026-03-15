/* =====================================================
   GapRease – main.js
   Smooth scroll · FAQ accordion · Demo modal · Reveal
   ===================================================== */

const DEMO_EMAIL = "YOUR_EMAIL"; // ← replace with your email address

/* ── Smooth scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Close mobile nav if open
    navLinks.classList.remove("open");
  });
});

/* ── Mobile hamburger ── */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open);
  });
}

/* ── Demo modal ── */
const modal       = document.getElementById("demo-modal");
const modalClose  = document.getElementById("modal-close");
const openBtns    = document.querySelectorAll(".open-demo-modal");
const demoForm    = document.getElementById("demo-form");

function openModal() {
  modal.classList.add("open");
  modal.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openBtns.forEach(btn => btn.addEventListener("click", openModal));
if (modalClose) modalClose.addEventListener("click", closeModal);

if (modal) {
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
});

// Form → mailto
if (demoForm) {
  demoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name    = demoForm.querySelector('[name="name"]').value.trim();
    const email   = demoForm.querySelector('[name="email"]').value.trim();
    const company = demoForm.querySelector('[name="company"]').value.trim();
    const message = demoForm.querySelector('[name="message"]').value.trim();

    const subject = encodeURIComponent("GapRease Demo Request – " + company);
    const body    = encodeURIComponent(
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Company: " + company + "\n\n" +
      "Message:\n" + message
    );

    window.location.href = "mailto:" + DEMO_EMAIL + "?subject=" + subject + "&body=" + body;
  });
}

/* ── FAQ accordion ── */
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", function () {
    const item   = this.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("open");

    // Close all
    document.querySelectorAll(".faq-item.open").forEach(openItem => {
      openItem.classList.remove("open");
      openItem.querySelector(".faq-answer").style.maxHeight = "0";
      openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    // Toggle clicked
    if (!isOpen) {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      this.setAttribute("aria-expanded", "true");
    }
  });
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── Benchmark bar animation ── */
const bmObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".bm-bar-fill[data-width]").forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        bmObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".bm-bars").forEach(el => bmObserver.observe(el));
