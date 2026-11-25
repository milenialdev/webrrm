# agents.md — Web Rehabilitacions Ruíz Marín

Guía para cualquier agente (Claude Code) que trabaje en este repo. Describe cómo está construida la web, cómo se despliega, qué decisiones se tomaron y por qué, y qué queda pendiente. Si algo de aquí contradice el código, manda el código: corrígelo aquí.

## Qué es

Landing en catalán para una empresa familiar de rehabilitación de Badalona. Muestra servicios, proyectos hechos (con fotos y etiquetas) y un formulario de contacto. El equipo de la empresa **no es técnico**: todo el contenido se edita desde un panel (`/admin`) sin tocar código.

- Repo: `github.com/milenialdev/webrrm` (rama `main`).
- Producción: `https://webrrm.carlosbenitoandev.workers.dev` (dominio propio pendiente).
- Idioma de la interfaz web y del panel: **catalán**. Con el usuario (el desarrollador), español.

## Stack

- **Front**: HTML + CSS + JS (módulos ES) estáticos. **Sin build, sin framework.** Los textos viven en JSON y el JS los pinta en el navegador.
- **Hosting**: Cloudflare **Workers con Static Assets** (gratis). Cloudflare unificó Pages dentro de Workers; no existe el flujo clásico de Pages. `wrangler.toml` sirve la carpeta raíz como assets y `worker.js` atiende `/api/auth` y `/api/callback` (el OAuth del panel) y deja pasar el resto a los assets.
- **Despliegue**: cada push a `main` despliega solo (Workers Builds, `npx wrangler deploy`). Tarda 1–2 minutos. Los commits que hace el CMS también despliegan.
- **CMS**: Decap CMS 3.16+ con backend `github` (login con GitHub OAuth). Panel en `/admin`.
- **Formulario**: Web3Forms (clave pública en `index.html`, restringida a dominios en el panel de Web3Forms; el dominio de producción debe estar permitido). Los mensajes llegan al correo de la empresa.

## Mapa del repo

```
index.html            Landing (cabecera, portada, servicios, "Qui som", projectes, contacto, pie)
projectes.html        Todos los proyectos + filtro por etiqueta (acepta ?tag=Etiqueta)
projecte.html         Ficha de un proyecto (?p=slug-del-titulo)
css/styles.css        Todo el CSS (variables en :root)
js/render.js          Pinta la landing (lee content/*.json)
js/projects-page.js   Lista y filtros de projectes.html
js/project-detail.js  Ficha del proyecto (galería, etiquetas clicables)
js/projects-shared.js Utilidades compartidas: cargar JSON, slugs, tarjeta, carrusel, menú móvil, protección de fotos rotas
js/icons.js           Iconos SVG de línea (servicios y contacto)
content/site.json     Portada, "Qui som" (+ foto y cifras), contacto, pie
content/services.json Servicio destacado + tarjetas del carrusel
content/projects.json Proyectos (el ORDEN del array es el orden en la web)
content/tags.json     Lista de etiquetas que se pueden elegir en los proyectos
admin/index.html      Carga Decap, registra el catalán ("Afegir" en vez de "Add") y la vista previa
admin/config.yml      Esquema del CMS (colecciones, campos, textos de ayuda)
admin/preview.js      Vista previa en vivo del panel (reutiliza css/styles.css y js/icons.js)
assets/               Logo (SVG vectorizado), favicons, uploads/ (fotos subidas desde el CMS)
worker.js, wrangler.toml, .assetsignore   Cloudflare
scripts/dev-server.js Servidor estático local
```

## Modelo de contenido (lo que edita el CMS)

- `site.json`: `hero` (título en 5 piezas + subtítulo + 2 botones + `image`), `about` (texto, frase, `photo{label,image}`, `stats[]`), `contact`, `footer`. La sección `process` ("Com treballem") sigue en el JSON pero está **oculta** (`hidden` en `index.html`) y fuera del CMS: puede volver.
- `services.json`: `featured` (servicio grande con `icon` e `image`) e `items[]` (`title`, `icon`, `text`, `style`: `light` | `dark-teal` | `terracotta`). `icon` es una **clave** (`building`, `droplet`, `sun`, `people`, `document`, `brush`, `beam`), no un emoji.
- `projects.json`: `items[]` con `title`, `location`, `description`, `date`, `tags[]`, `images[]` (máx. 5). **El orden del array es el orden de la web** (los 3 primeros salen en la landing); se cambia arrastrando en el panel. `date` solo se muestra en la ficha.
- `tags.json`: `tags[].name`. Los proyectos las eligen con un `relation`; los nombres deben coincidir exactamente.

Slug de un proyecto = título normalizado (sin acentos, con guiones). **Cambiar un título cambia su URL.**

## Reglas del proyecto

- Todo texto o imagen visible debe salir de `content/`, nunca hardcodeado, para que el CMS lo pueda editar.
- No añadir paso de build ni framework sin hablarlo: el equipo y el despliegue dependen de que sea estático.
- Si añades un campo al JSON, añádelo a `admin/config.yml` y, si se ve en una vista previa, a `admin/preview.js`.
- Imágenes: el CMS las convierte a WebP, máx. 1600 px de ancho, calidad 80, en el navegador al subirlas (`media_processing`). Borrar una foto de "Multimèdia" **no** la quita de las listas de los proyectos; por eso la web descarta automáticamente las fotos que no cargan.
- **Accesibilidad**: se midió el contraste de todos los textos (0 fallos). Los botones son azul `#0094B2` con texto oscuro `#0A1B20` (el blanco sobre ese azul no llega a 4,5:1). Terracota `#A5552F`. Respetar `prefers-reduced-motion`. Mantener enlace "Salta al contingut", `aria-*` del menú móvil y campos del formulario con `aria-describedby`/`aria-invalid`.
- Paleta: crema `#F3ECE4`, azul del logo `#0094B2` (oscuro `#006B80`, hover de botón `#19A6C3`), terracota `#A5552F`, casi negro `#12211E`. Titulares en serif (Georgia) con acentos en cursiva.

## Desarrollo en local

```bash
npm run dev          # http://localhost:5173 (node scripts/dev-server.js)
```

Para probar el panel sin login (no toques producción):
1. Crea `admin/local-config.yml` = `local_backend: true` + el contenido de `admin/config.yml`, y `admin/local-index.html` = `admin/index.html` con `<link href="local-config.yml" type="text/yaml" rel="cms-config-url">` dentro de `<head>`. Ambos están ignorados por git (`admin/local-*`).
2. Arranca `npx decap-server` (puerto 8081) y abre `http://localhost:5173/admin/local-index.html`.
3. **Publicar en ese panel escribe en los archivos del proyecto.** Para probar solo arrastres o vistas previas, no publiques; si publicas, revierte con git.
4. Al terminar, para el servidor y borra los dos archivos `local-*`.

## Flujo de trabajo con git

- El equipo publica desde `/admin` → commits directos a `main` (autor "Carlos", mensajes "Update …"). **Haz `git pull --rebase origin main` antes de empezar y antes de cada push.**
- El usuario pide los commits y pushes explícitamente. No hagas push sin que lo pida; cuando es un cambio visual, enséñale antes el resultado.
- Al terminar un commit: mensaje en catalán o español, terminado con la línea `Co-Authored-By` que indique el entorno.

## Infraestructura y cuentas (no hay secretos aquí)

- **GitHub OAuth App** del panel: su Client ID es público y está en `wrangler.toml` (`[vars]`). El Client Secret está como secret del Worker (se subió con `wrangler secret put OAUTH_CLIENT_SECRET`). Las variables de la sección "Builds" del dashboard de Cloudflare **no llegan al Worker en ejecución**; por eso el Client ID va en `wrangler.toml`.
- Callback de la OAuth App: `https://webrrm.carlosbenitoandev.workers.dev/api/callback`. `admin/config.yml` tiene la misma URL en `base_url`.
- **Si se compra un dominio propio**, actualizar: `base_url` en `admin/config.yml`, la Homepage/Callback URL de la OAuth App, los dominios permitidos en Web3Forms y `site_url`. No crear cuentas externas en nombre del usuario: se lo pides y te pasa lo necesario.

## Pendiente / ideas

1. **Login del panel con email y contraseña (sin GitHub).** La empresa no tiene GitHub y el doble factor les supera. Recomendado: Netlify Identity + Git Gateway (gratis, solo como servicio de login; la web sigue en Cloudflare; registro "solo por invitación"; backend `git-gateway`). Alternativa: sistema propio en Cloudflare (D1 + Workers + proxy backend de Decap + envío de emails); es bastante más trabajo y el envío de invitaciones exige dominio propio verificado. El usuario aún no ha elegido; mientras tanto el login es con GitHub.
2. Dominio propio cuando estén contentos con la web.
3. Reescribir las descripciones de 3 proyectos que son una sola palabra (antes eran "categoría").
4. `README.md` (para el equipo, en catalán) está desfasado: menciona secciones y botones antiguos del panel. Actualizarlo.
5. Accesibilidad pendiente: no se ha probado con lector de pantalla ni al 200 % de zoom; encabezados H4 del pie tras un H2 y secciones sin nombre propio.
6. Las tarjetas de proyecto ya no muestran categoría (el campo ahora es la descripción, solo visible en la ficha). El usuario puede querer mostrar la primera etiqueta o un extracto.

## Trampas conocidas

- En el navegador integrado de Claude, las capturas tras hacer scroll pueden salir en blanco o duplicadas. Soluciones: traer la pestaña al frente (`tabs_select`) y/o cambiar el tamaño de la ventana en 1 px para forzar un repintado. Para medir cosas, usa `javascript_exec` (getBoundingClientRect, comprobar el DOM).
- En PowerShell, `$home` es una variable reservada: no la uses como variable propia. Escribe los archivos con `UTF8Encoding($false)` (sin BOM) para no corromper los acentos.
- Los avisos "LF will be replaced by CRLF" de git en Windows son normales.
- El scroll suave (`scroll-behavior: smooth`) hace que pruebas de posición con JavaScript den valores intermedios; espera o usa `behavior: "instant"`.
- Descubierto el 2026-09: la ejecución de scripts de PowerShell puede estar bloqueada; usa `cmd`/`npx.cmd` o `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
