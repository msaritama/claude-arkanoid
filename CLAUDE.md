# CLAUDE.md

Este archivo guía a Claude Code (claude.ai/code) cuando trabaja con el código de este repositorio.

## Idioma

Responder siempre al usuario en español en este proyecto.

## Estado actual

Clon de Arkanoid/Breakout, lección 04 del curso. **Todavía no existe código fuente del juego.** La carpeta solo contiene:

- `README.md`: descripción de un párrafo (en español).
- `assets/`: paquete de assets entregado (descomprimido de un archivo de macOS).
- `.claude/skills/`: las skills `spec` y `spec-impl` (instaladas vía `skills-lock.json`, origen `Klerith/fernando-skills`).

No hay sistema de build, gestor de paquetes, linter ni tests. Todavía no es un repo git; `/spec-impl` lo necesita (crea ramas `spec-NN-slug`), así que hay que hacer `git init` antes de implementar.

## Conflicto de stack: resolver antes de programar

`README.md` dice que el juego es **Python + Pygame**, pero los assets entregados son **JS para navegador**: `assets/assets/spritesheet.js` usa `Image`, `document.createElement('canvas')` y `CanvasRenderingContext2D.drawImage`. Los assets solo funcionan con un juego en HTML5 Canvas. Confirmar el stack con el usuario (o en la spec) en vez de elegir uno sin avisar.

## Paquete de assets

- Los assets reales están en `assets/assets/` (doble anidación). `assets/__MACOSX/` y los archivos `.DS_Store` son basura del archivo comprimido: ignorarlos.
- `spritesheet.js` define globales (sin módulos): `SPRITES` (paddle, ball, `blocks.<color>`), `EXPLOSION_FRAMES.<color>` (4 frames cada uno), `EXPLOSION_DURATION` (150 ms), además de `loadSpritesheet(cb)`, `drawSprite(ctx, name, x, y, w, h)` (los nombres de bloques son `block_<color>`, p. ej. `block_red`) y `drawFrame(ctx, frame, x, y, w, h)`.
- Colores de bloques: `gray`, `red`, `yellow`, `cyan`, `magenta`, `hotpink`, `green`.
- `loadSpritesheet` carga `'assets/spritesheet-breakout.png'` relativo a la página HTML. Con la anidación actual, la página debe estar dentro de la carpeta `assets/` exterior, o hay que aplanar la carpeta de assets. Decidirlo al crear el HTML de entrada.
- Sonidos: `assets/assets/sounds/ball-bounce.mp3`, `break-sound.mp3`.

## Flujo de trabajo: desarrollo guiado por specs

Las funcionalidades se construyen con dos skills que invoca el usuario (`disable-model-invocation: true`; nunca ejecutarlas automáticamente):

1. `/spec <funcionalidad en una frase>`: hace preguntas de aclaración y luego escribe `specs/NN-slug.md` con estado `Draft` (o en español `Borrador`). También crea `specs/.spec-config.yml` (`AutoCreateBranch: true`). Plantilla: `.claude/skills/spec/template.md`.
2. El usuario cambia manualmente el estado a `Approved`/`Aprobado`. El agente nunca lo hace.
3. `/spec-impl NN-slug`: rechaza specs no aprobadas, crea o cambia a la rama `spec-NN-slug` e implementa el plan paso a paso, pausando después de cada paso para revisar el diff. Nunca hace commit automáticamente.

Al implementar, seguir exactamente la spec aprobada. Los pedidos fuera de alcance van a una spec futura, no a la rama actual. Las specs deben usar el mismo idioma (español/inglés) que las specs existentes en `specs/`.
