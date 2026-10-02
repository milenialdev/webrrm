const SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

export const ICONS = {
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

export function iconSvg(name) {
  return ICONS[name] || "◆";
}
