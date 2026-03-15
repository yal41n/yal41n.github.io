/* =====================================================
   CyberGAP Hackathon – main.js
   Sidebar · FAQ accordion · Register modal · Reveal
   ===================================================== */

const CONTACT_EMAIL = "YOUR_EMAIL"; // ← replace with your email address

/* ── Smooth scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeSidebar();
  });
});

/* ── Sidebar ── */
const sidebar        = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const hamburger      = document.getElementById("hamburger");
const sidebarClose   = document.getElementById("sidebar-close");

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("open");
  sidebarOverlay.removeAttribute("aria-hidden");
  document.body.style.overflow = "hidden";
  if (hamburger) hamburger.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
  sidebarOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (hamburger) hamburger.setAttribute("aria-expanded", "false");
}

if (hamburger) hamburger.addEventListener("click", openSidebar);
if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

/* Highlight active sidebar link on scroll */
const sidebarLinks = document.querySelectorAll(".sidebar-link[data-section]");
const sections = document.querySelectorAll("section[id]");

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        sidebarLinks.forEach(link => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach(sec => sectionObserver.observe(sec));

/* ── Registration modal ── */
const modal      = document.getElementById("register-modal");
const modalClose = document.getElementById("modal-close");
const openBtns   = document.querySelectorAll(".open-register-modal");
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
if (modal) modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (modal && modal.classList.contains("open")) closeModal();
    closeSidebar();
  }
});

/* Form → mailto */
if (demoForm) {
  demoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name    = demoForm.querySelector('[name="name"]')?.value.trim()    || "";
    const email   = demoForm.querySelector('[name="email"]')?.value.trim()   || "";
    const company = demoForm.querySelector('[name="company"]')?.value.trim() || "";
    const track   = demoForm.querySelector('[name="track"]')?.value          || "";
    const message = demoForm.querySelector('[name="message"]')?.value.trim() || "";

    const subject = encodeURIComponent("CyberGAP Hackathon Registration – " + (company || name));
    const body    = encodeURIComponent(
      "Team Lead: " + name + "\n" +
      "Email: " + email + "\n" +
      "Organization: " + company + "\n" +
      "Track: " + track + "\n\n" +
      "Team Description:\n" + message
    );

    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
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
      openItem.querySelector(".faq-answer").setAttribute("aria-hidden", "true");
    });

    // Toggle clicked
    if (!isOpen) {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      answer.setAttribute("aria-hidden", "false");
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
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── Donut chart animation ── */
const donutObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".donut-arc").forEach(arc => {
          // Force reflow then animate to actual value
          arc.style.strokeDashoffset = "200.96"; // full circle = hidden
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              arc.style.strokeDashoffset = arc.dataset.offset || "50";
            });
          });
        });
        donutObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll(".stat-cards").forEach(el => donutObserver.observe(el));

/* ── Live countdown for "days to start" ── */
(function () {
  const eventDate = new Date("2025-04-12T09:00:00Z");
  const counter   = document.getElementById("days-counter");
  if (!counter) return;

  function update() {
    const now  = new Date();
    const diff = eventDate - now;
    if (diff <= 0) { counter.textContent = "0"; return; }
    counter.textContent = Math.ceil(diff / 86400000);
  }
  update();
  setInterval(update, 60000);
})();
