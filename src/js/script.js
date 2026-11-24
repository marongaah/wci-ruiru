// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Mobile menu =====
const toggle = document.querySelector(".navbar__toggle");
const links = document.querySelector(".navbar__links");
if (toggle && links) {
  const setOpen = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = open ? "&times;" : "&#9776;";   // X when open, bars when closed
  };
  toggle.addEventListener("click", () => setOpen(!links.classList.contains("is-open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

// ===== Resources page: filter by Prayers / Teachings =====
const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".resource-card");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const type = btn.dataset.filter;
    cards.forEach((card) => {
      card.hidden = !(type === "all" || card.dataset.type === type);
    });
  });
});

// ===== Service Units page: search and filter =====
const unitForm = document.getElementById("unit-form");
if (unitForm) {
  const searchInput = document.getElementById("unit-search");
  const categorySelect = document.getElementById("unit-category");
  const countEl = document.getElementById("unit-count");
  const emptyEl = document.getElementById("unit-empty");
  const unitCards = document.querySelectorAll("#unit-list .unit");

  // Fill the group dropdown from the groups found on the cards
  const groups = [...new Set([...unitCards].map((c) => c.dataset.category).filter(Boolean))];
  groups.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    categorySelect.appendChild(opt);
  });

  function filterUnits() {
    const q = searchInput.value.trim().toLowerCase();
    const group = categorySelect.value;
    let shown = 0;
    unitCards.forEach((card) => {
      const match =
        card.dataset.search.includes(q) &&
        (group === "all" || card.dataset.category === group);
      card.hidden = !match;
      if (match) shown++;
    });
    countEl.textContent = "Showing " + shown + " service unit" + (shown === 1 ? "" : "s");
    emptyEl.hidden = shown !== 0;
  }

  searchInput.addEventListener("input", filterUnits);
  categorySelect.addEventListener("change", filterUnits);
  unitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filterUnits();
  });
  filterUnits();
}

// ===== Contact page: send the message through WhatsApp (or email) =====
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(contactForm);
    const text =
      "Hello, my name is " + f.get("name") + ".\n" +
      "Phone: " + f.get("phone") + "\n" +
      "Email: " + (f.get("email") || "not given") + "\n" +
      "About: " + f.get("topic") + "\n\n" +
      f.get("message");
    const whatsapp = contactForm.dataset.whatsapp;
    const email = contactForm.dataset.email;
    if (whatsapp) {
      window.open("https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    } else if (email) {
      window.location.href =
        "mailto:" + email +
        "?subject=" + encodeURIComponent("Message from " + f.get("name") + " (" + f.get("topic") + ")") +
        "&body=" + encodeURIComponent(text);
    }
  });
}

// ===== JBS gallery: click a photo to see it larger =====
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const bigImage = document.getElementById("lightbox-img");
  document.querySelectorAll(".gallery__item").forEach((btn) => {
    btn.addEventListener("click", () => {
      bigImage.src = btn.dataset.full;
      lightbox.showModal();
    });
  });
  // Click the dark area or the close button to close (Esc also works)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox__close")) lightbox.close();
  });
}

// ===== Event countdown banner =====
const countdown = document.querySelector("[data-countdown]");
if (countdown) {
  const target = new Date(countdown.dataset.countdown).getTime();
  const units = {
    d: countdown.querySelector('[data-unit="d"]'),
    h: countdown.querySelector('[data-unit="h"]'),
    m: countdown.querySelector('[data-unit="m"]'),
    s: countdown.querySelector('[data-unit="s"]'),
  };
  const timer = countdown.querySelector(".countdown__timer");
  const live = countdown.querySelector(".countdown__live");
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      timer.hidden = true;     // the event has begun
      live.hidden = false;
      return false;
    }
    units.d.textContent = Math.floor(diff / 86400000);
    units.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    units.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
    units.s.textContent = pad(Math.floor((diff % 60000) / 1000));
    return true;
  }
  if (tick()) {
    const interval = setInterval(() => { if (!tick()) clearInterval(interval); }, 1000);
  }
}
// ===== WSF page: search home cells by name or area =====
const cellForm = document.getElementById("cell-form");
if (cellForm) {
  const cellInput = document.getElementById("cell-search");
  const cells = [...document.querySelectorAll(".cell")];
  const cellCount = document.getElementById("cell-count");
  const cellEmpty = document.getElementById("cell-empty");
  const areaBox = document.getElementById("cell-areas");
  const clean = (s) => s.toLowerCase().replace(/[’']/g, "").replace(/\s+/g, " ").trim();

  // Area buttons, built from the locations printed on the cards
  const areas = [...new Set([...document.querySelectorAll(".cell__loc")].map((el) => el.textContent.trim()))];
  areas.forEach((area) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "wsf-area";
    b.textContent = area;
    b.addEventListener("click", () => {
      cellInput.value = cellInput.value === area ? "" : area;
      filterCells();
    });
    areaBox.appendChild(b);
  });

  function filterCells() {
    const words = clean(cellInput.value).split(" ").filter(Boolean);   // every word must match
    let shown = 0;
    cells.forEach((card) => {
      const hit = words.every((w) => card.dataset.search.includes(w));
      card.hidden = !hit;
      if (hit) shown++;
    });
    cellEmpty.hidden = shown !== 0;
    cellCount.textContent = words.length ? shown + (shown === 1 ? " home cell found" : " home cells found") : "";
    areaBox.querySelectorAll(".wsf-area").forEach((b) => b.classList.toggle("is-active", clean(b.textContent) === clean(cellInput.value)));
  }

  cellInput.addEventListener("input", filterCells);
  cellForm.addEventListener("submit", (e) => { e.preventDefault(); filterCells(); });
  filterCells();
}