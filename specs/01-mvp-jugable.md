# SPEC 01 — MVP jugable de Arkanoid

> **Estado:** Borrador
> **Depende de:** —
> **Fecha:** 2026-10-05
> **Objetivo:** Un nivel de Arkanoid jugable en el navegador con paleta controlada por teclado, pelota, 78 bloques, vidas, puntuación y pantallas de Game Over y Victoria.

## Por qué existe esta spec

`README.md` dice que el juego es Python + Pygame. Los assets entregados (`spritesheet.js`, sonidos `.mp3`) son para navegador. Esta spec fija el stack en **HTML5 Canvas + JavaScript**, sin build ni dependencias.

## Alcance

**Dentro:**

- Aplanar el paquete de assets: mover `assets/assets/*` a `assets/` y borrar `assets/__MACOSX/` y todos los `.DS_Store`.
- `index.html` en la raíz con un `<canvas>` de 480x640 y scripts clásicos (sin ES modules).
- Paleta de 96x14 controlada con flechas izquierda/derecha (también `A`/`D`).
- Pelota de 12x12 a velocidad constante, que rebota en paredes laterales, techo, paleta y bloques.
- Rebote en la paleta con ángulo según el punto de impacto (centro = vertical, extremos = hasta 60°).
- 78 bloques: 6 filas x 13 columnas, de 32x16. Una fila por color, de arriba abajo: `red`, `yellow`, `cyan`, `magenta`, `hotpink`, `green`.
- Un bloque desaparece al primer golpe y suma 10 puntos.
- 3 vidas. Si la pelota cae por debajo del canvas, se pierde una vida.
- Pelota pegada a la paleta al inicio y tras perder una vida. `Espacio` la lanza.
- HUD con puntuación y vidas.
- Pantalla de Game Over (0 vidas) y de Victoria (0 bloques). `Enter` reinicia la partida.

**Fuera de alcance (para futuras specs):**

- Sonidos (`ball-bounce.mp3`, `break-sound.mp3`).
- Animación de explosión (`EXPLOSION_FRAMES`).
- Control con ratón.
- Menú de título y pausa.
- Varios niveles, bloques resistentes (`gray`) y powerups.
- Récords y persistencia.
- Actualizar `README.md` al nuevo stack.

## Modelo de datos

```js
// src/game.js
const CANVAS_W = 480;
const CANVAS_H = 640;

const state = {
  status: 'serving', // 'serving' | 'playing' | 'gameover' | 'won'
  score: 0,
  lives: 3,
  paddle: { x: 192, y: 600, w: 96, h: 14, speed: 420 },
  ball: { x: 0, y: 0, size: 12, vx: 0, vy: 0, speed: 300 },
  blocks: [/* { x, y, w: 32, h: 16, color: 'red', alive: true } */],
};

// src/input.js
const keys = { left: false, right: false, launch: false, restart: false };
```

Convenciones:

- Coordenadas con origen arriba a la izquierda.
- Velocidades en píxeles por segundo. El bucle usa `requestAnimationFrame` con delta time (`dt` en segundos, limitado a 0.05).
- La rejilla de bloques empieza en `x = 32`, `y = 64`. 13 columnas x 32 px = 416 px, con 32 px de margen a cada lado.
- Los sprites se pintan con `drawSprite(ctx, 'paddle' | 'ball' | 'block_<color>', x, y, w, h)` de `assets/spritesheet.js`.
- Los valores de `speed` son iniciales y se pueden ajustar durante la implementación.

## Plan de implementación

1. Aplanar assets: mover `assets/assets/*` a `assets/` y borrar `assets/__MACOSX/` y los `.DS_Store`. Prueba manual: existe `assets/spritesheet-breakout.png`.
2. Crear `index.html` con el `<canvas id="game" width="480" height="640">` y los scripts en orden: `assets/spritesheet.js`, `src/input.js`, `src/entities.js`, `src/game.js`, `src/main.js`. Crear `src/main.js` que llama a `loadSpritesheet` y arranca un bucle que pinta el fondo negro. Prueba manual: abrir `index.html`, canvas negro, sin errores en consola.
3. Crear `src/input.js` con el objeto `keys` y los listeners de `keydown`/`keyup` (flechas, `A`, `D`, `Espacio`, `Enter`).
4. Crear `src/entities.js` con la creación de la paleta, la pelota y la rejilla de 78 bloques. Pintarlos desde `src/game.js`. Prueba manual: se ven los 6 colores de bloques, la paleta y la pelota.
5. Mover la paleta con el teclado, limitada a los bordes del canvas. La pelota sigue pegada encima de la paleta (`serving`).
6. Lanzar la pelota con `Espacio` (`playing`). Rebotes en paredes laterales y techo.
7. Rebote en la paleta con ángulo según el punto de impacto. Velocidad constante.
8. Colisión con bloques: el bloque pasa a `alive: false`, la pelota rebota en el eje del impacto y se suman 10 puntos.
9. Pérdida de vida al caer la pelota: resta 1 vida y vuelve a `serving`. Con 0 vidas pasa a `gameover`. Con 0 bloques vivos pasa a `won`.
10. HUD (puntuación y vidas) y textos de Game Over y Victoria. `Enter` reinicia `state` a los valores iniciales.

## Criterios de aceptación

- [ ] Abrir `index.html` muestra el canvas de 480x640 sin errores en la consola.
- [ ] `assets/assets/`, `assets/__MACOSX/` y los `.DS_Store` ya no existen.
- [ ] Se ven 78 bloques en 6 filas, una por color, en el orden `red`, `yellow`, `cyan`, `magenta`, `hotpink`, `green`.
- [ ] Las flechas y `A`/`D` mueven la paleta. La paleta no sale del canvas.
- [ ] Antes de lanzar, la pelota se mueve pegada a la paleta.
- [ ] `Espacio` lanza la pelota hacia arriba.
- [ ] La pelota rebota en las paredes laterales y en el techo.
- [ ] Golpear la paleta cerca de un extremo desvía la pelota hacia ese lado. Golpear el centro la devuelve casi vertical.
- [ ] Romper un bloque lo elimina y suma exactamente 10 puntos en el HUD.
- [ ] Al caer la pelota se resta 1 vida en el HUD y la pelota vuelve a la paleta.
- [ ] Al perder la tercera vida aparece "Game Over".
- [ ] Al romper los 78 bloques aparece la pantalla de Victoria con 780 puntos.
- [ ] En Game Over o Victoria, `Enter` reinicia con 3 vidas, 0 puntos y 78 bloques.
- [ ] La velocidad de la pelota es la misma con monitores de 60 Hz y de 144 Hz.

## Decisiones

- **Sí:** HTML5 Canvas + JS. `spritesheet.js` funciona sin cambios.
- **No:** Python + Pygame. Habría que reescribir los recortes del spritesheet.
- **Sí:** aplanar `assets/`. La ruta `'assets/spritesheet-breakout.png'` de `spritesheet.js` funciona desde `index.html` en la raíz sin editar el archivo entregado.
- **No:** editar la ruta dentro de `spritesheet.js`. Preferimos no tocar los assets entregados.
- **Sí:** scripts clásicos con globales. Es coherente con `spritesheet.js` y funciona con `file://`, sin servidor.
- **No:** ES modules. Exigen servidor local.
- **No:** un único archivo JS. Crece mal.
- **Sí:** solo teclado. El ratón queda para otra spec.
- **Sí:** ángulo según punto de impacto en la paleta. Permite apuntar y evita bucles de rebote predecibles.
- **No:** reflexión simple en la paleta.
- **Sí:** paleta escalada a 96x14 (unos 20% del ancho). El sprite nativo de 162 px hace el juego demasiado fácil.
- **Sí:** delta time en px/s. La velocidad no depende de la frecuencia del monitor.
- **No:** sonidos, explosión, menú y pausa en el MVP. Se dejan para specs futuras.
- **No:** actualizar `README.md` en esta spec. Decisión del usuario.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| La pelota atraviesa un bloque o la paleta en un frame largo (tunneling) | `dt` limitado a 0.05 s. A 300 px/s la pelota avanza como máximo 15 px por frame, menos que el alto de un bloque (16 px). |
| La pelota golpea dos bloques en el mismo frame e invierte la dirección dos veces | Procesar como máximo una colisión con bloques por frame. |
| `/spec-impl` necesita un repo git y la carpeta todavía no lo es | Ejecutar `git init` y hacer un commit inicial antes de `/spec-impl`. |

## Lo que **no** está en esta spec

- Sonidos y animación de explosión.
- Control con ratón.
- Menú de título y pausa.
- Varios niveles, bloques resistentes y powerups.
- Récords y persistencia.
- Cambios en `README.md`.

Cada uno, si se hace, irá en su propia spec.
