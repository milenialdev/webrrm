export async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`No s'ha pogut carregar ${path}`);
  return res.json();
}

export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function withSlugs(items) {
  const seen = new Map();
  return items.map(p => {
    const base = slugify(p.title) || "projecte";
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    return { ...p, slug: n === 1 ? base : `${base}-${n}` };
  });
}

export function setupCarousel(root, onChange) {
  const track = root.querySelector(".carousel-slides");
  const count = track.children.length;
  const dots = root.querySelectorAll(".pc-dot");
  const current = () => Math.round(track.scrollLeft / track.clientWidth) || 0;
  const go = i => {
    const wraps = i < 0 || i >= count;
    track.scrollTo({ left: ((i + count) % count) * track.clientWidth, behavior: wraps ? "instant" : "smooth" });
  };

  root.querySelector(".pc-prev")?.addEventListener("click", () => go(current() - 1));
  root.querySelector(".pc-next")?.addEventListener("click", () => go(current() + 1));
  track.addEventListener("scroll", () => {
    const i = current();
    dots.forEach((d, n) => d.classList.toggle("active", n === i));
    onChange?.(i);
  }, { passive: true });

  return { go, current, count };
}

const brokenImages = new Set();

export function validImages(p) {
  return (p.images || []).filter(src => !brokenImages.has(src));
}

// Si una foto ya no existe (p. ex. s'ha esborrat del CMS), la descarta i torna a dibuixar amb les que queden.
export function watchBrokenImages(root, redraw) {
  let fired = false;
  root.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      brokenImages.add(img.getAttribute("src"));
      if (fired) return;
      fired = true;
      redraw();
    }, { once: true });
  });
}

export function projectCard(p) {
  const images = validImages(p);
  const multi = images.length > 1;
  const slides = images.length
    ? images.map((src, i) => `<div class="slide"><img src="${esc(src)}" alt="${esc(p.title)} - foto ${i + 1}" loading="lazy"></div>`).join("")
    : `<div class="slide slide-placeholder">[ Foto del projecte ]</div>`;
  const controls = multi
    ? `<button class="pc-btn pc-prev" type="button" aria-label="Foto anterior">‹</button>
       <button class="pc-btn pc-next" type="button" aria-label="Foto següent">›</button>
       <div class="pc-dots">${images.map((_, i) => `<span class="pc-dot${i === 0 ? " active" : ""}"></span>`).join("")}</div>`
    : "";

  const card = el(`
    <article class="project-card">
      <div class="project-carousel">
        <div class="carousel-slides">${slides}</div>
        ${controls}
      </div>
      <div class="project-body">
        <div class="project-category">${esc(p.category)}</div>
        <h3><a class="project-link" href="projecte.html?p=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h3>
        <div class="project-location">${esc(p.location)}</div>
      </div>
    </article>
  `);

  const link = card.querySelector(".project-link");
  const track = card.querySelector(".carousel-slides");
  track.addEventListener("click", () => { location.href = link.href; });
  if (multi) setupCarousel(card.querySelector(".project-carousel"));
  watchBrokenImages(card, () => card.replaceWith(projectCard(p)));
  return card;
}

export function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".site-header");
  toggle.addEventListener("click", () => header.classList.toggle("nav-open"));
  header.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => header.classList.remove("nav-open"));
  });
}

export function fillFooter(site) {
  document.getElementById("footer-description").textContent = site.footer.description;
  document.getElementById("footer-legal").textContent = site.footer.legal;
  document.getElementById("footer-contact").innerHTML = `
    <li>${esc(site.contact.address)}</li>
    <li>${esc(site.contact.phone)}</li>
    <li>${esc(site.contact.email)}</li>
    <li>${esc(site.contact.hours)}</li>
  `;
}
