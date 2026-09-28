# agents.md — Web Rehabilitacions Ruiz Marin

Documento guía paso a paso para construir y desplegar la web. Pensado para que un agente (Claude Code) lo siga secuencialmente. Cada paso indica si requiere acción humana (cuenta externa, credenciales) o si el agente puede ejecutarlo solo.

## Stack decidido

- **Hosting**: Cloudflare Pages (gratis, `*.pages.dev`; dominio propio se añadirá más adelante).
- **Contenido editable**: Decap CMS (panel en `/admin`, login con GitHub), backend git → cada guardado en el CMS crea un commit que Cloudflare Pages redeploya automáticamente.
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

Paleta: crema `#F1EAE3`, teal `#1B6B75`/`#0F4C56`, terracota `#B5623A`, negro-verdoso oscuro `#12211E` para secciones oscuras. Tipografía serif itálica para acentos ("solució", "la teva llar"), sans-serif para el resto.

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
- Configurar OAuth para GitHub: Decap CMS con backend `github` necesita un proveedor OAuth. Usar el proxy gratuito que ofrece Cloudflare Pages/Netlify o, si no, montar uno mínimo con una Cloudflare Pages Function (`/api/auth`, `/api/callback`) usando un GitHub OAuth App (esto lo crea el usuario en GitHub Settings → Developer settings, es gratis).
- Documentar en el README exactamente cómo entrar a `/admin` y qué se puede editar.

## Paso 5 — Desplegar en Cloudflare Pages

1. Subir el repo a GitHub (requiere que el usuario tenga la cuenta creada del paso previo).
2. En Cloudflare dashboard: Pages → Create a project → Connect to Git → seleccionar el repo.
3. Build settings: sin framework (o el build command de Tailwind si aplica), output directory `/` (o `dist` si hay build).
4. Deploy. Verificar la URL `*.pages.dev`.
5. Probar en producción: navegación, formulario, panel `/admin` con login real.

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
