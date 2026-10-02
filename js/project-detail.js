import { loadJSON, el, esc, withSlugs, setupCarousel, setupMobileNav, fillFooter } from "./projects-shared.js";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ca-ES", { year: "numeric", month: "long" });
}

function renderGallery(p) {
  const images = p.images || [];
  if (!images.length) {
    return el(`<div class="gallery gallery-empty">[ Aquest projecte encara no té fotos ]</div>`);
  }

  const multi = images.length > 1;
  const slides = images.map((src, i) => `<div class="slide"><img src="${esc(src)}" alt="${esc(p.title)} - foto ${i + 1}"></div>`).join("");
  const controls = multi
    ? `<button class="pc-btn pc-prev" type="button" aria-label="Foto anterior">‹</button>
       <button class="pc-btn pc-next" type="button" aria-label="Foto següent">›</button>
       <div class="pc-counter">1 / ${images.length}</div>`
    : "";
  const thumbs = multi
    ? `<div class="gallery-thumbs">${images.map((src, i) =>
        `<button class="gallery-thumb${i === 0 ? " active" : ""}" type="button" aria-label="Veure la foto ${i + 1}"><img src="${esc(src)}" alt=""></button>`
      ).join("")}</div>`
    : "";

  const wrap = el(`
    <div>
      <div class="gallery">
        <div class="carousel-slides">${slides}</div>
        ${controls}
      </div>
      ${thumbs}
    </div>
  `);

  if (multi) {
    const gallery = wrap.querySelector(".gallery");
    const counter = wrap.querySelector(".pc-counter");
    const thumbBtns = [...wrap.querySelectorAll(".gallery-thumb")];
    const carousel = setupCarousel(gallery, i => {
      counter.textContent = `${i + 1} / ${images.length}`;
      thumbBtns.forEach((b, n) => b.classList.toggle("active", n === i));
    });
    thumbBtns.forEach((b, n) => b.addEventListener("click", () => carousel.go(n)));
    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") carousel.go(carousel.current() - 1);
      if (e.key === "ArrowRight") carousel.go(carousel.current() + 1);
    });
  }
  return wrap;
}

async function init() {
  const [site, projects] = await Promise.all([
    loadJSON("content/site.json"),
    loadJSON("content/projects.json"),
  ]);
  fillFooter(site);
  setupMobileNav();

  const slug = new URLSearchParams(location.search).get("p");
  const p = withSlugs(projects.items).find(item => item.slug === slug);
  const root = document.getElementById("project-detail");

  if (!p) {
    root.innerHTML = `<h1>Projecte no trobat</h1><p class="projects-empty">Aquest projecte no existeix o s'ha eliminat. <a class="back-link" href="projectes.html">Veure tots els projectes</a></p>`;
    return;
  }

  document.title = `${p.title} — Rehabilitacions Ruíz Marín`;
  const meta = [p.category, p.location, formatDate(p.date)].filter(Boolean).map(esc).join("<span class=\"meta-dot\">·</span>");
  const tags = (p.tags || []).map(t => `<span class="tag-pill">${esc(t)}</span>`).join("");

  root.innerHTML = `
    <h1>${esc(p.title)}</h1>
    <div class="project-meta">${meta}</div>
    ${tags ? `<div class="project-tags">${tags}</div>` : ""}
  `;
  root.appendChild(renderGallery(p));
}

init();
