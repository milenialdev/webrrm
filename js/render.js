import { loadJSON, el, withSlugs, projectCard, setupMobileNav } from "./projects-shared.js";
import { iconSvg } from "./icons.js";

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
