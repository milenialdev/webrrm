# Web — Rehabilitacions Ruíz Marín

## Com editar el contingut de la web (per a l'equip de l'empresa)

1. Entra a **https://webrrm.pages.dev/admin** (o al domini propi, quan el tingueu).
2. Inicia sessió amb el compte de GitHub de l'empresa.
3. A l'esquerra veuràs les seccions editables: *Textos generals*, *Serveis* i *Projectes*.
4. Edita el text o puja fotos noves i prem **Publish** (o **Save** + **Publish**).
5. Als 1-2 minuts la web es actualitza sola. No cal fer res més.

Si mai teniu dubtes o algun canvi més gran, contacteu amb la persona que ha fet la web.

## Desenvolupament local

Requereix [Node.js](https://nodejs.org/).

```bash
node scripts/dev-server.js
```

Obre `http://localhost:5173`.

## Estructura del projecte

- `index.html`, `css/`, `js/` — la pàgina web (estàtica, sense build).
- `content/*.json` — tots els textos i dades que edita l'equip via `/admin`.
- `admin/` — configuració de Decap CMS (panell d'edició).
- `functions/api/` — Cloudflare Pages Functions que fan de proveïdor OAuth per al login de GitHub al panell `/admin`.
- `agents.md` — pla de construcció pas a pas del projecte.

## Desplegament (Cloudflare Pages)

Veure `agents.md` per a la guia completa pas a pas, incloent la configuració de:
- El projecte a Cloudflare Pages.
- La GitHub OAuth App necessària perquè `/admin` funcioni (variables d'entorn `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET`).
- Web3Forms (formulari de contacte) — cal afegir el domini final a la llista de dominis permesos del formulari.
