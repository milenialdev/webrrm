import { iconSvg } from "/js/icons.js";
import { esc } from "/js/projects-shared.js";

const CMS = window.CMS;
const h = window.h;
const createClass = window.createClass;

CMS.registerPreviewStyle("/css/styles.css");

function asset(getAsset, path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const a = getAsset(path);
  return a ? String(a) : path;
}

function heroHtml(d, a) {
  const x = d.hero || {};
  const img = a(x.image);
  return `
    <section class="hero" style="margin:16px auto 24px">
      <div class="hero-copy">
        <h1>${esc(x.title_line1)} <span class="text-teal"><em>${esc(x.title_highlight1)}</em></span> ${esc(x.title_line2)}<br>${esc(x.title_line3)} <span class="text-terracotta"><em>${esc(x.title_highlight2)}</em></span>.</h1>
        <p>${esc(x.subtitle)}</p>
        <div class="hero-actions">
          <span class="btn btn-primary">${esc(x.cta_primary)}</span>
          <span class="btn btn-outline">${esc(x.cta_secondary)}</span>
        </div>
      </div>
      <div class="hero-image" style="${img ? `background-image:url(${esc(img)})` : ""}">${img ? "" : "[ Substituir per foto de projecte ]"}</div>
    </section>`;
}

function aboutHtml(d, a) {
  const x = d.about || {};
  const photo = x.photo || {};
  const img = a(photo.image);
  const stats = (x.stats || []).map(s => `
    <div class="stat-box"><div class="value">${esc(s.value)}</div><div class="label">${esc(s.label)}</div></div>`).join("");
  return `
    <section class="about-section" style="padding:48px 0">
      <div class="container about-grid">
        <div class="about-photo" style="${img ? `background-image:url(${esc(img)})` : ""}">${img ? "" : `[ ${esc(photo.label || "Foto")} ]`}</div>
        <div class="about-copy">
          <span class="tag-pill">${esc(x.tag)}</span>
          <h2>${esc(x.title)} <em>${esc(x.title_highlight)}</em></h2>
          <p>${esc(x.text)}</p>
          <div class="about-quote">"${esc(x.quote)}"</div>
          <div class="about-stats">${stats}</div>
        </div>
      </div>
    </section>`;
}

function contactHtml(d) {
  const c = d.contact || {};
  const rows = [
    ["location", "Adreça", c.address],
    ["phone", "Telèfon", c.phone],
    ["envelope", "Correu", c.email],
    ["clock", "Horari", c.hours],
  ].map(([icon, label, value]) => `
    <div class="contact-item">
      <div class="icon">${iconSvg(icon)}</div>
      <div><div class="label">${label}</div><div class="value">${esc(value)}</div></div>
    </div>`).join("");
  return `
    <section class="contact-section" style="padding:48px 0">
      <div class="container contact-copy">
        <h2>${esc(c.title)} <em>${esc(c.title_highlight)}</em></h2>
        <p>${esc(c.text)}</p>
        ${rows}
      </div>
    </section>`;
}

function footerHtml(d) {
  const f = d.footer || {};
  return `
    <footer class="site-footer" style="padding:32px 0 16px">
      <div class="container">
        <div class="footer-brand"><span class="footer-logo"><img src="/assets/logo-horizontal.svg" alt="Rehabilitacions Ruíz Marín"></span><p>${esc(f.description)}</p></div>
        <div class="footer-bottom" style="margin-top:24px">${esc(f.legal)}</div>
      </div>
    </footer>`;
}

function generalHtml(d, a) {
  return heroHtml(d, a) + aboutHtml(d, a) + contactHtml(d) + footerHtml(d);
}

function servicesHtml(d, a) {
  const f = d.featured || {};
  const fimg = a(f.image);
  const cards = (d.items || []).map(item => `
    <article class="card card-${esc(item.style || "light")}">
      <div>
        <div class="card-icon">${iconSvg(item.icon)}</div>
        <h4>${esc(item.title)}</h4>
        <p class="card-text">${esc(item.text)}</p>
      </div>
    </article>`).join("");
  return `
    <section id="serveis" class="section">
      <div class="container">
        <div class="section-head">
          <span class="tag-pill">${esc(d.tag)}</span>
          <h2>${esc(d.title)} <em class="text-teal">${esc(d.title_highlight)}</em></h2>
          <p>${esc(d.subtitle)}</p>
        </div>
        <div class="services-featured">
          <article class="card card-featured">
            <div class="card-featured-img" style="${fimg ? `background-image:url(${esc(fimg)})` : ""}">${fimg ? "" : "[ Imatge de façana rehabilitada ]"}</div>
            <div class="card-featured-body">
              <div class="dot">${iconSvg(f.icon)}</div>
              <h3>${esc(f.title)}</h3>
              <ul>${(f.items || []).map(i => `<li>${esc(i)}</li>`).join("")}</ul>
              <a>${esc(f.link)} →</a>
            </div>
          </article>
        </div>
        <div class="services-carousel"><div class="carousel-track">${cards}</div></div>
      </div>
    </section>`;
}

function projectsHtml(d, a) {
  const items = [...(d.items || [])].sort((x, y) => new Date(y.date || 0) - new Date(x.date || 0));
  const cards = items.map(p => {
    const imgs = (p.images || []).map(src => a(src)).filter(Boolean);
    const slides = imgs.length
      ? imgs.map(src => `<div class="slide"><img src="${esc(src)}" alt=""></div>`).join("")
      : `<div class="slide slide-placeholder">[ Foto del projecte ]</div>`;
    const dots = imgs.length > 1
      ? `<div class="pc-dots">${imgs.map((_, i) => `<span class="pc-dot${i === 0 ? " active" : ""}"></span>`).join("")}</div>`
      : "";
    return `
      <article class="project-card">
        <div class="project-carousel"><div class="carousel-slides">${slides}</div>${dots}</div>
        <div class="project-body">
          <div class="project-category">${esc(p.category)}</div>
          <h3><a class="project-link">${esc(p.title)}</a></h3>
          <div class="project-location">${esc(p.location)}</div>
        </div>
      </article>`;
  }).join("");
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="tag-pill">${esc(d.tag)}</span>
          <h2>${esc(d.title)} <em class="text-teal">${esc(d.title_highlight)}</em></h2>
          <p>${esc(d.subtitle)}</p>
        </div>
        <div class="projects-grid">${cards}</div>
      </div>
    </section>`;
}

function makePreview(render) {
  return createClass({
    render() {
      let html;
      try {
        html = render(this.props.entry.get("data").toJS(), path => asset(this.props.getAsset, path));
      } catch (err) {
        console.error(err);
        html = `<p style="padding:16px;color:#b00020">No s'ha pogut generar la vista prèvia.</p>`;
      }
      return h("div", { dangerouslySetInnerHTML: { __html: html } });
    },
  });
}

CMS.registerPreviewTemplate("general", makePreview(generalHtml));
CMS.registerPreviewTemplate("services", makePreview(servicesHtml));
CMS.registerPreviewTemplate("projects", makePreview(projectsHtml));
