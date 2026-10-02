import { loadJSON, el, withSlugs, projectCard, setupMobileNav } from "./projects-shared.js";

const SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  building: `<svg ${SVG_ATTRS}><rect x="5" y="3" width="14" height="18" rx="1"/><rect x="8" y="6.5" width="2.3" height="2.3"/><rect x="13.7" y="6.5" width="2.3" height="2.3"/><rect x="8" y="11.5" width="2.3" height="2.3"/><rect x="13.7" y="11.5" width="2.3" height="2.3"/><rect x="9.7" y="16.5" width="4.6" height="4.5"/></svg>`,
  droplet: `<svg ${SVG_ATTRS}><path d="M12 3c0 0-6 7.5-6 12a6 6 0 0 0 12 0c0-4.5-6-12-6-12Z"/></svg>`,
  sun: `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="4.5"/><line x1="12" y1="1.5" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22.5" y2="12"/><line x1="4.4" y1="4.4" x2="6.5" y2="6.5"/><line x1="17.5" y1="17.5" x2="19.6" y2="19.6"/><line x1="4.4" y1="19.6" x2="6.5" y2="17.5"/><line x1="17.5" y1="6.5" x2="19.6" y2="4.4"/></svg>`,
  people: `<svg ${SVG_ATTRS}><circle cx="8.5" cy="8" r="3"/><path d="M2.5 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.3"/><path d="M13.2 20a5 5 0 0 1 8.3-3.7"/></svg>`,
  document: `<svg ${SVG_ATTRS}><path d="M7 2h7l4 4v16H7z"/><path d="M14 2v4h4"/><line x1="9.5" y1="12.5" x2="15" y2="12.5"/><line x1="9.5" y1="16" x2="15" y2="16"/><line x1="9.5" y1="19.5" x2="13" y2="19.5"/></svg>`,
  brush: `<svg ${SVG_ATTRS}><ellipse cx="12" cy="6.5" rx="6.5" ry="2.2"/><path d="M5.5 6.5v11c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2v-11"/><line x1="8.3" y1="11" x2="15.7" y2="11"/></svg>`,
  beam: `<svg ${SVG_ATTRS}><line x1="4" y1="4" x2="20" y2="4"/><line x1="6.5" y1="4" x2="6.5" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="17.5" y1="4" x2="17.5" y2="20"/><line x1="4" y1="20" x2="8" y2="20"/><line x1="10" y1="20" x2="14" y2="20"/><line x1="15.5" y1="20" x2="19.5" y2="20"/></svg>`,
  location: `<svg ${SVG_ATTRS}><path d="M12 21s7-7.8 7-12.5A7 7 0 0 0 5 8.5C5 13.2 12 21 12 21Z"/><circle cx="12" cy="8.5" r="2.3"/></svg>`,
  phone: `<svg ${SVG_ATTRS}><path d="M20.5 16.9v2.6a1.7 1.7 0 0 1-1.9 1.7 16.8 16.8 0 0 1-7.3-2.6 16.6 16.6 0 0 1-5.1-5.1 16.8 16.8 0 0 1-2.6-7.4A1.7 1.7 0 0 1 5.3 3.5h2.6a1.7 1.7 0 0 1 1.7 1.5c.1.8.3 1.6.6 2.4a1.7 1.7 0 0 1-.4 1.8l-1.1 1.1a13.5 13.5 0 0 0 5.1 5.1l1.1-1.1a1.7 1.7 0 0 1 1.8-.4c.8.3 1.6.5 2.4.6a1.7 1.7 0 0 1 1.5 1.8Z"/></svg>`,
  envelope: `<svg ${SVG_ATTRS}><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.7 12 13.2l8.5-6.5"/></svg>`,
  clock: `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.3 2"/></svg>`,
};
function iconSvg(name) {
  return ICONS[name] || "◆";
}

function renderHero(site) {
  const h = site.hero;
  document.getElementById("hero-title").innerHTML =
    `${h.title_line1} <span class="text-teal"><em>${h.title_highlight1}</em></span> ${h.title_line2}<br>${h.title_line3} <span class="text-terracotta"><em>${h.title_highlight2}</em></span>.`;
  document.getElementById("hero-subtitle").textContent = h.subtitle;
  document.getElementById("hero-cta-primary").textContent = h.cta_primary;
  document.getElementById("hero-cta-secondary").textContent = h.cta_secondary;
  const img = document.getElementById("hero-image");
  if (h.image) {
    img.style.backgroundImage = `url(${h.image})`;
    img.textContent = "";
  }
}

function renderServices(data) {
  document.getElementById("services-tag").textContent = data.tag;
  document.getElementById("services-title").innerHTML =
    `${data.title} <em class="text-teal">${data.title_highlight}</em>`;
  document.getElementById("services-subtitle").textContent = data.subtitle;

  const featuredWrap = document.getElementById("services-featured");
  featuredWrap.innerHTML = "";
  const f = data.featured;
  featuredWrap.appendChild(el(`
    <article class="card card-featured">
      <div class="card-featured-img" style="${f.image ? `background-image:url(${f.image})` : ""}">${f.image ? "" : "[ Imatge de façana rehabilitada ]"}</div>
      <div class="card-featured-body">
        <div class="dot">${iconSvg(f.icon)}</div>
        <h3>${f.title}</h3>
        <ul>${f.items.map(i => `<li>${i}</li>`).join("")}</ul>
        <a href="#contacte">${f.link} →</a>
      </div>
    </article>
  `));

  const track = document.getElementById("services-carousel-track");
  track.innerHTML = "";
  data.items.forEach(item => {
    track.appendChild(el(`
      <article class="card card-${item.style}">
        <div>
          <div class="card-icon">${iconSvg(item.icon)}</div>
          <h4>${item.title}</h4>
          <p class="card-text">${item.text}</p>
        </div>
      </article>
    `));
  });

  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  prevBtn.addEventListener("click", () => track.scrollBy({ left: -300, behavior: "smooth" }));
  nextBtn.addEventListener("click", () => track.scrollBy({ left: 300, behavior: "smooth" }));
}

function renderAbout(site) {
  const a = site.about;
  document.getElementById("about-tag").textContent = a.tag;
  document.getElementById("about-title").innerHTML = `${a.title} <em>${a.title_highlight}</em>`;
  document.getElementById("about-text").textContent = a.text;
  document.getElementById("about-quote").textContent = `"${a.quote}"`;

  const photo = document.getElementById("about-photo");
  const p = a.photo || {};
  photo.style.backgroundImage = p.image ? `url(${p.image})` : "";
  photo.textContent = p.image ? "" : `[ ${p.label || "Foto"} ]`;

  const stats = document.getElementById("about-stats");
  stats.innerHTML = "";
  a.stats.forEach(s => {
    stats.appendChild(el(`
      <div class="stat-box">
        <div class="value">${s.value}</div>
        <div class="label">${s.label}</div>
      </div>
    `));
  });
}

function renderProjects(data) {
  document.getElementById("projects-tag").textContent = data.tag;
  document.getElementById("projects-title").innerHTML = `${data.title} <em class="text-teal">${data.title_highlight}</em>`;
  document.getElementById("projects-subtitle").textContent = data.subtitle;

  const grid = document.getElementById("projects-grid");
  grid.innerHTML = "";
  const latest = withSlugs(data.items)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3);
  latest.forEach(p => grid.appendChild(projectCard(p)));
}

function renderProcess(site) {
  const p = site.process;
  document.getElementById("process-tag").textContent = p.tag;
  document.getElementById("process-title").innerHTML = `${p.title} <em class="text-teal">${p.title_highlight}</em>`;
  const steps = document.getElementById("process-steps");
  steps.innerHTML = "";
  p.steps.forEach(s => {
    steps.appendChild(el(`
      <div class="step">
        <div class="step-num">${s.number}</div>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </div>
    `));
  });
}

function renderContact(site) {
  const c = site.contact;
  document.getElementById("contact-title").innerHTML = `${c.title} <em>${c.title_highlight}</em>`;
  document.getElementById("contact-text").textContent = c.text;
  document.getElementById("contact-form-note").textContent = c.form_note;

  const items = [
    { icon: "location", label: "Adreça", value: c.address },
    { icon: "phone", label: "Telèfon", value: c.phone },
    { icon: "envelope", label: "Correu", value: c.email },
    { icon: "clock", label: "Horari", value: c.hours },
  ];
  const wrap = document.getElementById("contact-items");
  wrap.innerHTML = "";
  items.forEach(i => {
    wrap.appendChild(el(`
      <div class="contact-item">
        <div class="icon">${iconSvg(i.icon)}</div>
        <div>
          <div class="label">${i.label}</div>
          <div class="value">${i.value}</div>
        </div>
      </div>
    `));
  });

  const footerContact = document.getElementById("footer-contact");
  footerContact.innerHTML = `
    <li>${c.address}</li>
    <li>${c.phone}</li>
    <li>${c.email}</li>
    <li>${c.hours}</li>
  `;
}

function renderFooter(site) {
  document.getElementById("footer-company").textContent = site.footer.company;
  document.getElementById("footer-description").textContent = site.footer.description;
  document.getElementById("footer-legal").textContent = site.footer.legal;
}

function setFieldError(input, errorEl, message) {
  if (message) {
    input.classList.add("invalid");
    errorEl.textContent = message;
  } else {
    input.classList.remove("invalid");
    errorEl.textContent = "";
  }
  return !message;
}

function setupFormValidation() {
  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("name-error");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const phoneInput = document.getElementById("phone");
  const phoneError = document.getElementById("phone-error");
  const messageInput = document.getElementById("message");
  const messageError = document.getElementById("message-error");

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'’\s-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRegex = /^[+\d][\d\s-]{6,}$/;

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) return setFieldError(nameInput, nameError, "El nom és obligatori.");
    if (!nameRegex.test(value)) return setFieldError(nameInput, nameError, "El nom només pot contenir lletres.");
    return setFieldError(nameInput, nameError, "");
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) return setFieldError(emailInput, emailError, "El correu és obligatori.");
    if (!emailRegex.test(value)) return setFieldError(emailInput, emailError, "Introdueix un correu vàlid.");
    return setFieldError(emailInput, emailError, "");
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    if (!value) return setFieldError(phoneInput, phoneError, "");
    if (!phoneRegex.test(value)) return setFieldError(phoneInput, phoneError, "Introdueix un telèfon vàlid.");
    return setFieldError(phoneInput, phoneError, "");
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (!value) return setFieldError(messageInput, messageError, "El missatge és obligatori.");
    return setFieldError(messageInput, messageError, "");
  }

  nameInput.addEventListener("input", validateName);
  nameInput.addEventListener("blur", validateName);
  emailInput.addEventListener("input", validateEmail);
  emailInput.addEventListener("blur", validateEmail);
  phoneInput.addEventListener("input", validatePhone);
  phoneInput.addEventListener("blur", validatePhone);
  messageInput.addEventListener("input", validateMessage);
  messageInput.addEventListener("blur", validateMessage);

  return { validateName, validateEmail, validatePhone, validateMessage };
}

function setupForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit");
  const { validateName, validateEmail, validatePhone, validateMessage } = setupFormValidation();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    if (form.botcheck.checked) return;

    const validName = validateName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validMessage = validateMessage();
    if (!validName || !validEmail || !validPhone || !validMessage) {
      status.textContent = "Revisa els camps marcats abans d'enviar.";
      status.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Enviant...";

    try {
      const formData = new FormData(form);
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        status.textContent = "Gràcies! Hem rebut el teu missatge, et contactarem aviat.";
        status.classList.add("success");
        form.reset();
      } else {
        throw new Error(result.message || "Error desconegut");
      }
    } catch (err) {
      status.textContent = "Hi ha hagut un error enviant el missatge. Torna-ho a provar o truca'ns.";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

async function init() {
  try {
    const [site, services, projects] = await Promise.all([
      loadJSON("content/site.json"),
      loadJSON("content/services.json"),
      loadJSON("content/projects.json"),
    ]);
    renderHero(site);
    renderServices(services);
    renderAbout(site);
    renderProjects(projects);
    renderProcess(site);
    renderContact(site);
    renderFooter(site);
  } catch (err) {
    console.error(err);
  }
  setupForm();
  setupMobileNav();
}

init();
