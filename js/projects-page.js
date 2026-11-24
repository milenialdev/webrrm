import { loadJSON, el, esc, withSlugs, projectCard, setupMobileNav, fillFooter } from "./projects-shared.js";

async function init() {
  const [site, projects] = await Promise.all([
    loadJSON("content/site.json"),
    loadJSON("content/projects.json"),
  ]);

  document.getElementById("projects-tag").textContent = projects.tag;
  document.getElementById("projects-title").innerHTML = `${projects.title} <em class="text-teal">${projects.title_highlight}</em>`;
  document.getElementById("projects-subtitle").textContent = projects.subtitle;
  fillFooter(site);

  const items = withSlugs(projects.items);
  const allTags = [...new Set(items.flatMap(p => p.tags || []))];
  const requested = new URLSearchParams(location.search).get("tag");
  const initial = allTags.includes(requested) ? requested : "all";

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
      const btn = el(`<button class="tag-filter-btn${active ? " active" : ""}" type="button">${esc(label)}</button>`);
      btn.setAttribute("aria-pressed", String(active));
      btn.addEventListener("click", () => {
        filtersWrap.querySelectorAll(".tag-filter-btn").forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        const url = value === "all" ? location.pathname : `${location.pathname}?tag=${encodeURIComponent(value)}`;
        history.replaceState(null, "", url);
        renderGrid(value);
      });
      return btn;
    };
    filtersWrap.appendChild(makeBtn("Tots", "all", initial === "all"));
    allTags.forEach(tag => filtersWrap.appendChild(makeBtn(tag, tag, tag === initial)));
  }

  renderFilters();
  renderGrid(initial);
  setupMobileNav();
}

init();
