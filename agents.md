# agents.md — Web Rehabilitacions Ruiz Marin

Documento guía paso a paso para construir y desplegar la web. Pensado para que un agente (Claude Code) lo siga secuencialmente. Cada paso indica si requiere acción humana (cuenta externa, credenciales) o si el agente puede ejecutarlo solo.

## Stack decidido

- **Hosting**: Cloudflare Workers con "Static Assets" (gratis, `*.workers.dev`; dominio propio se añadirá más adelante). Cloudflare ha unificado "Pages" dentro de "Workers" en su dashboard nuevo — ya no existe el flujo clásico de Pages, así que el sitio se despliega como un Worker (`wrangler.toml` + `worker.js`) que sirve los archivos estáticos y gestiona las rutas `/api/auth` y `/api/callback` (antes esto se hacía con Cloudflare Pages Functions en `/functions`, ahora retirado).
- **Contenido editable**: Decap CMS (panel en `/admin`, login con GitHub), backend git → cada guardado en el CMS crea un commit que Cloudflare vuelve a desplegar automáticamente.
- **Formulario de contacto**: Web3Forms (gratis, sin backend propio, envía directo al email de la empresa). Config se hace una vez; después no requiere mantenimiento ni de ellos ni de nosotros.
- **Código**: HTML + CSS (Tailwind) estático. Sin framework pesado — mantiene el repo simple para que Decap CMS y Cloudflare Pages funcionen sin fricción.
- **Repo**: GitHub (necesario tanto para Cloudflare Pages como para el login de Decap CMS).

## Requisitos previos (acción humana, no del agente)

1. Crear cuenta de GitHub (si no existe ya) — la usará el usuario para autenticarse en `/admin`.
2. Crear cuenta gratuita en Cloudflare (dashboard.cloudflare.com).
3. Crear cuenta gratuita en Web3Forms (web3forms.com) y obtener el **Access Key** — se necesita el email real de la empresa para que lleguen ahí los mensajes.

Sin estas 3 cosas no se puede completar el despliegue final; el agente puede avanzar con todo lo demás mientras tanto.

## Paso 1 — Estructura del proyecto

- Inicializar repo git local (`git init`).
- Crear estructura:
  - `index.html` — landing principal.
  - `/assets/` — imágenes, iconos.
  - `/css/` — estilos (Tailwind compilado o CDN, a decidir según necesidad de build).
  - `/admin/` — `index.html` + `config.yml` de Decap CMS.
  - `/content/` — archivos Markdown/JSON que Decap CMS edita (proyectos, servicios, textos de secciones, datos de contacto).
- Crear `README.md` corto con instrucciones de cómo el equipo entra a editar la web (link a `/admin`, cómo hacer login).

## Paso 2 — Maquetar la landing (diseño de referencia: mockup compartido)

Secciones, en este orden, replicando la imagen de referencia:
1. Header fijo: logo + nav (Inici, Serveis, Projectes, Nosaltres) + botón "Demana pressupost".
2. Hero: titular + subtítulo + 2 CTAs + imagen/foto de proyecto destacado.
3. Servicios: grid de tarjetas (Rehabilitació de Façanes, Reformes Integrals, Impermeabilització, Aïllament Tèrmic SATE, Comunitats de Veïns, +Serveis Especialitzats).
4. Quiénes somos: bloque oscuro con fotos + texto + cifras (proyectos completados, % satisfacción, años, subcontratas).
5. Proceso: 4 pasos (Consulta inicial, Pressupost detallat, Execució de l'obra, Lliurament i garantia).
6. Contacto: datos de la empresa (dirección, teléfono, email, horario) + formulario (Web3Forms).
7. Footer: enlaces, datos legales.

Paleta: crema `#F1EAE3`, azul del logo `#0094B2` (variante oscura `#006B80`), terracota `#B5623A`, negro-verdoso oscuro `#12211E` para secciones oscuras. Tipografía serif itálica para acentos ("solució", "la teva llar"), sans-serif para el resto.

Todo el texto e imágenes de esta maquetación deben salir de los archivos en `/content/`, no estar hardcodeados en el HTML — así Decap CMS puede editarlos.

## Paso 3 — Formulario de contacto (Web3Forms)

- Formulario HTML plano con `action="https://api.web3forms.com/submit"`, método POST, campo hidden `access_key` con la key obtenida en el paso previo.
- Campos: nombre, teléfono, email, tipo de servicio, mensaje.
- Añadir honeypot anti-spam (campo oculto que Web3Forms recomienda) y `redirect`/mensaje de éxito in-page vía `fetch` + JS simple, sin recargar página.
- Probar un envío real antes de dar por cerrado este paso.

## Paso 4 — Configurar Decap CMS

- `/admin/index.html`: carga el script de Decap CMS.
- `/admin/config.yml`: backend `github`, repo del proyecto, rama `main`; colecciones para:
  - Servicios (título, descripción, icono/imagen, orden).
  - Proyectos/galería (título, fotos, descripción corta).
  - Textos generales (hero, quiénes somos, cifras, proceso).
  - Datos de contacto (dirección, teléfono, email, horario).
- Configurar OAuth para GitHub: Decap CMS con backend `github` necesita un proveedor OAuth. Implementado en `worker.js`, que gestiona las rutas `/api/auth` y `/api/callback` usando un GitHub OAuth App (esto lo crea el usuario en GitHub Settings → Developer settings, es gratis) y las variables de entorno `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` configuradas en el proyecto de Cloudflare.
- Documentar en el README exactamente cómo entrar a `/admin` y qué se puede editar.

## Paso 5 — Desplegar en Cloudflare (Workers + Static Assets)

1. Subir el repo a GitHub (requiere que el usuario tenga la cuenta creada del paso previo).
2. En Cloudflare dashboard: Compute → Workers & Pages → Create → conectar el repo `milenialdev/webrrm`.
3. En "Set up your application": Build command vacío, Deploy command `npx wrangler deploy` (por defecto). El `wrangler.toml` del repo ya define los static assets y el Worker que los sirve.
4. Deploy. Verificar la URL `*.workers.dev` resultante.
5. Actualizar `admin/config.yml` (`base_url`) con la URL real.
6. Crear la GitHub OAuth App (Homepage URL y Callback URL = esa URL + `/api/callback`) y añadir `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` como variables de entorno del proyecto en Cloudflare.
7. Añadir esa URL a los dominios permitidos de la clave de Web3Forms.
8. Probar en producción: navegación, formulario, panel `/admin` con login real.

## Paso 6 — Entrega y prueba con el usuario

- Enviar la URL al usuario para que la revise junto con el familiar.
- Enseñar cómo entrar a `/admin`, editar un texto y ver que se publica solo (redeploy automático de Cloudflare Pages tras cada commit del CMS).
- Recoger feedback de diseño/contenido y ajustar.

## Paso 7 — Dominio propio (futuro, cuando estén contentos)

- Comprar dominio (en Cloudflare Registrar o donde prefieran).
- Cloudflare Pages → Custom domains → añadir dominio, Cloudflare gestiona el DNS automáticamente al estar en la misma cuenta.

## Notas para el agente que ejecute esto

- No crear cuentas externas (GitHub, Cloudflare, Web3Forms) en nombre del usuario — pedirle que las cree él y que pase las credenciales/keys necesarias en el chat.
- Todo el contenido debe vivir en `/content/`, nunca hardcodeado, para que el CMS funcione.
- Verificar visualmente en navegador (dev server o preview) cada sección contra el mockup antes de dar el paso por completado.
- Antes de hacer push a GitHub o desplegar, confirmar con el usuario.
