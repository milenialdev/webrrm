async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`No s'ha pogut carregar ${path}`);
  return res.json();
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
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
        <div class="dot">◆</div>
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
          <div class="card-icon">${item.style === "light" ? "◆" : "✦"}</div>
          <h4>${item.title}</h4>
          <p class="card-text">${item.text}</p>
        </div>
        <a href="#contacte" class="card-link">${item.link} →</a>
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
  const latest = [...data.items]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3);
  latest.forEach(p => {
    grid.appendChild(el(`
      <article class="project-card">
        <div class="project-img" style="${p.image ? `background-image:url(${p.image})` : ""}">${p.image ? "" : "[ Foto del projecte ]"}</div>
        <div class="project-body">
          <div class="project-category">${p.category}</div>
          <h3>${p.title}</h3>
          <div class="project-location">${p.location}</div>
        </div>
      </article>
    `));
  });
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
    { icon: "📍", label: "Adreça", value: c.address },
    { icon: "📞", label: "Telèfon", value: c.phone },
    { icon: "✉️", label: "Correu", value: c.email },
    { icon: "🕐", label: "Horari", value: c.hours },
  ];
  const wrap = document.getElementById("contact-items");
  wrap.innerHTML = "";
  items.forEach(i => {
    wrap.appendChild(el(`
      <div class="contact-item">
        <div class="icon">${i.icon}</div>
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

function setupForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    if (form.botcheck.checked) return;

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

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".site-header");
  toggle.addEventListener("click", () => {
    header.classList.toggle("nav-open");
  });
  header.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => header.classList.remove("nav-open"));
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
