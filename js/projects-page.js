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

function projectCard(p) {
  return el(`
    <article class="project-card">
      <div class="project-img" style="${p.image ? `background-image:url(${p.image})` : ""}">${p.image ? "" : "[ Foto del projecte ]"}</div>
      <div class="project-body">
        <div class="project-category">${p.category || ""}</div>
        <h3>${p.title}</h3>
        <div class="project-location">${p.location || ""}</div>
      </div>
    </article>
  `);
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".site-header");
  toggle.addEventListener("click", () => header.classList.toggle("nav-open"));
  header.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => header.classList.remove("nav-open"));
  });
}

async function init() {
  const [site, projects] = await Promise.all([
    loadJSON("content/site.json"),
    loadJSON("content/projects.json"),
  ]);

  document.getElementById("projects-tag").textContent = projects.tag;
  document.getElementById("projects-title").innerHTML = `${projects.title} <em class="text-teal">${projects.title_highlight}</em>`;
  document.getElementById("projects-subtitle").textContent = projects.subtitle;

  document.getElementById("footer-company").textContent = site.footer.company;
  document.getElementById("footer-description").textContent = site.footer.description;
  document.getElementById("footer-legal").textContent = site.footer.legal;
  document.getElementById("footer-contact").innerHTML = `
    <li>${site.contact.address}</li>
    <li>${site.contact.phone}</li>
    <li>${site.contact.email}</li>
    <li>${site.contact.hours}</li>
  `;

  const items = [...projects.items].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const allTags = [...new Set(items.flatMap(p => p.tags || []))];

  const grid = document.getElementById("projects-grid-all");
  const empty = document.getElementById("projects-empty");
  const filtersWrap = document.getElementById("tag-filters");

  function renderGrid(filter) {
    const filtered = filter === "all" ? items : items.filter(p => (p.tags || []).includes(filter));
    grid.innerHTML = "";
    filtered.forEach(p => grid.appendChild(projectCard(p)));
    empty.hidden = filtered.length > 0;
  }

  function renderFilters() {
    filtersWrap.innerHTML = "";
    const makeBtn = (label, value, active) => {
      const btn = el(`<button class="tag-filter-btn${active ? " active" : ""}" type="button">${label}</button>`);
      btn.addEventListener("click", () => {
        filtersWrap.querySelectorAll(".tag-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderGrid(value);
      });
      return btn;
    };
    filtersWrap.appendChild(makeBtn("Tots", "all", true));
    allTags.forEach(tag => filtersWrap.appendChild(makeBtn(tag, tag, false)));
  }

  renderFilters();
  renderGrid("all");
  setupMobileNav();
}

init();
