# CLAUDE.md

Este archivo guía a Claude Code (claude.ai/code) cuando trabaja con el código de este repositorio.

## Idioma

Responder siempre al usuario en español en este proyecto. Specs, textos del juego y documentación también van en español.

## Proyecto

Clon de Arkanoid/Breakout, lección 04 del curso. Se construye con **desarrollo guiado por specs** (`specs/`): cada funcionalidad nace como spec, se aprueba y luego se implementa en su propia rama.

Stack (fijado en SPEC 01): **HTML5 Canvas + JavaScript plano**, sin build, sin dependencias, sin ES modules. `README.md` todavía dice Python + Pygame: está desactualizado y su corrección quedó fuera de alcance de SPEC 01.

No hay gestor de paquetes, linter ni tests automáticos. Para ejecutar, abrir `index.html` en el navegador (funciona con `file://`, no necesita servidor). La verificación es manual, contra los criterios de aceptación de cada spec.

## Estructura

```
index.html            canvas 480x640 y <script> en orden de carga
assets/               spritesheet.js, spritesheet-breakout.png, sounds/*.mp3
src/audio.js          SOUNDS y playSound(name)
src/input.js          keys y KEY_BINDINGS (teclado)
src/entities.js       constantes de la rejilla, DIFFICULTIES, createPaddle/createBall/createBlocks
src/effects.js        explosiones de bloques (createExplosion, updateExplosions, renderExplosions)
src/game.js           state global, update(dt), física, colisiones y render (HUD, menú, mensajes)
src/main.js           requestAnimationFrame, dt limitado a MAX_DT = 0.05 s
specs/                specs numeradas y .spec-config.yml
.claude/skills/       skills spec y spec-impl
```

## Arquitectura

- Todos los scripts son clásicos y comparten el ámbito global. El orden en `index.html` importa: `assets/spritesheet.js`, `src/audio.js`, `src/input.js`, `src/entities.js`, `src/effects.js`, `src/game.js`, `src/main.js`. Un archivo nuevo se añade en la posición que fije su spec.
- Hay un único objeto `state` en `src/game.js`. `state.status` es una máquina de estados: `'menu' | 'serving' | 'playing' | 'gameover' | 'won'`. El juego arranca en `'menu'`.
- Flujo: `menu` (teclas `1`/`2`/`3` eligen dificultad) → `serving` (pelota pegada a la paleta, `Espacio` lanza) → `playing` → `gameover` / `won` (`Enter` vuelve al menú).
- `createInitialState(difficulty, status)`, `startGame(difficulty)` y `resetGame()` construyen el estado. No mutar a mano campos sueltos para reiniciar.
- Unidades: velocidades en píxeles por segundo, multiplicadas por `dt` en segundos. Origen de coordenadas arriba a la izquierda.
- Los valores ajustables viven en constantes (`DIFFICULTIES`, `BLOCK_*`, `GRID_*`, `MAX_BOUNCE_ANGLE`, `MAX_DT`), no repartidos en la lógica.
- Las explosiones avanzan en cualquier estado del juego.

## Assets

- `assets/spritesheet.js` define globales: `SPRITES`, `EXPLOSION_FRAMES.<color>` (4 frames), `EXPLOSION_DURATION` (150 ms), `loadSpritesheet(cb)`, `drawSprite(ctx, name, x, y, w, h)` y `drawFrame(ctx, frame, x, y, w, h)`. Los nombres de bloque son `block_<color>`, p. ej. `block_red`.
- Colores de bloque: `gray`, `red`, `yellow`, `cyan`, `magenta`, `hotpink`, `green`. `gray` todavía no se usa.
- Sonidos: `assets/sounds/ball-bounce.mp3` y `break-sound.mp3`, reproducidos con `HTMLAudioElement` y `cloneNode().play()`. No usar Web Audio API ni `fetch()`: fallan con `file://`.
- No modificar `assets/spritesheet.js`: es parte del paquete entregado.

## Flujo de trabajo: desarrollo guiado por specs

Las funcionalidades se construyen con dos skills que invoca el usuario (`disable-model-invocation: true`; nunca ejecutarlas automáticamente):

1. `/spec <funcionalidad en una frase>`: hace preguntas de aclaración y escribe `specs/NN-slug.md` con estado `Borrador`. Plantilla: `.claude/skills/spec/template.md`.
2. El usuario cambia manualmente el estado a `Aprobado`. El agente nunca lo hace.
3. `/spec-impl NN-slug`: rechaza specs no aprobadas, crea o cambia a la rama `spec-NN-slug` (`specs/.spec-config.yml` tiene `AutoCreateBranch: true`) e implementa el plan paso a paso, pausando después de cada paso para revisar el diff. Nunca hace commit automáticamente.

Reglas al implementar:

- Seguir exactamente la spec aprobada. Los pedidos fuera de alcance van a una spec futura, no a la rama actual.
- Respetar la sección "Fuera de alcance" de cada spec, incluidas las de specs anteriores.
- Un cambio que contradiga una decisión de una spec anterior necesita una spec nueva que lo justifique.
- Al terminar el último paso de una spec, proponer los cambios necesarios en `CLAUDE.md` antes del commit: añadir la spec al "Historial de specs" (una línea: número, título y archivos nuevos), y revisar archivos nuevos en `src/`, globales, estados de `state.status`, orden de scripts, convenciones o decisiones que afecten a todo el proyecto. Si no hace falta ningún cambio, decirlo explícitamente.

## Convenciones de las specs

Las specs existentes están en español. Mantener el mismo formato:

- Nombre: `specs/NN-slug.md`, numeración correlativa de dos dígitos.
- Cabecera en blockquote: `**Estado:**`, `**Depende de:**`, `**Fecha:**`, `**Objetivo:**` (una sola frase).
- Estados válidos: `Borrador`, `En revisión`, `Aprobado`, `Implementado`, `Obsoleto`.
- Secciones en este orden: `Por qué existe esta spec` (opcional), `Alcance` (con **Dentro:** y **Fuera de alcance (para futuras specs):**), `Modelo de datos`, `Plan de implementación`, `Criterios de aceptación`, `Decisiones` (líneas **Sí:**/**No:** con motivo), `Riesgos` (opcional, tabla), `Lo que **no** está en esta spec`.
- Nombres concretos: rutas de archivo, nombres de función y teclas exactas. Sin TODOs.

## Historial de specs

El estado de cada spec está en su cabecera `**Estado:**` y los pendientes en sus secciones "Fuera de alcance". No duplicarlos aquí.

- SPEC 01 — MVP jugable: paleta, pelota, 78 bloques, vidas, puntos, Game Over/Victoria.
- SPEC 02 — Explosión al romper bloques (`src/effects.js`).
- SPEC 03 — Sonidos y dificultad (`src/audio.js`, menú `1`/`2`/`3`).
