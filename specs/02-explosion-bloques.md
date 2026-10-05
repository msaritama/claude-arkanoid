# SPEC 02 — Animación de explosión al romper bloques

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-05
> **Objetivo:** Al romper un bloque se reproduce en su posición la animación de explosión de 4 frames de su color, durante 150 ms en total.

## Alcance

**Dentro:**

- Nuevo archivo `src/effects.js` con la lógica y el pintado de las explosiones.
- Nuevo array `state.explosions` en el estado del juego.
- Al romper un bloque se crea una explosión con su posición, tamaño y color.
- La explosión usa `EXPLOSION_FRAMES.<color>` y `drawFrame` de `assets/spritesheet.js`.
- Duración total de `EXPLOSION_DURATION` (150 ms): 4 frames de 37.5 ms cada uno.
- Al terminar, la explosión se elimina de `state.explosions`.
- Las explosiones avanzan en cualquier estado (`serving`, `playing`, `gameover`, `won`).
- `Enter` (reinicio) vacía `state.explosions`.

**Fuera de alcance (para futuras specs):**

- Sonidos (`break-sound.mp3`, `ball-bounce.mp3`).
- Partículas, sacudida de pantalla u otros efectos.
- Retrasar la pantalla de Victoria hasta que acabe la última explosión.
- Bloques resistentes (`gray`) y su animación.
- Cambios en la puntuación o en la colisión.

## Modelo de datos

```js
// src/game.js — nuevo campo en createInitialState()
const state = {
  // ...campos de SPEC 01 sin cambios
  explosions: [/* { x, y, w, h, color: 'red', elapsed: 0 } */],
};
```

```js
// src/effects.js
const EXPLOSION_FRAME_COUNT = 4;
// Funciones globales:
// createExplosion(block)       -> { x, y, w, h, color, elapsed: 0 }
// updateExplosions(dt)         -> suma dt a elapsed y borra las terminadas
// renderExplosions(ctx)        -> pinta el frame actual de cada explosión
```

Convenciones:

- `elapsed` se guarda en milisegundos, porque `EXPLOSION_DURATION` está en milisegundos. `dt` llega en segundos: se suma `dt * 1000`.
- Índice de frame: `Math.min(3, Math.floor(elapsed / (EXPLOSION_DURATION / 4)))`.
- Una explosión termina cuando `elapsed >= EXPLOSION_DURATION`.
- `block.alive` pasa a `false` al instante, como en SPEC 01. La explosión es solo visual y no colisiona.
- Los bloques no cambian de estructura.

## Plan de implementación

1. Crear `src/effects.js` con `EXPLOSION_FRAME_COUNT`, `createExplosion`, `updateExplosions` y `renderExplosions`. Añadirlo en `index.html` entre `src/entities.js` y `src/game.js`. Prueba manual: el juego carga sin errores en consola y funciona igual que antes.
2. Añadir `explosions: []` a `createInitialState()` en `src/game.js`. Así `resetGame()` también lo vacía.
3. En `hitBlock()`, tras `block.alive = false`, añadir `createExplosion(block)` a `state.explosions`.
4. En `update(dt)`, llamar a `updateExplosions(dt)` al principio, antes del `return` de `gameover`/`won`.
5. En `render(ctx)`, llamar a `renderExplosions(ctx)` después de pintar los bloques y antes de la paleta, la pelota, el HUD y los mensajes. Prueba manual: romper un bloque muestra la explosión de su color en su posición.

## Criterios de aceptación

- [ ] Abrir `index.html` no muestra errores en la consola.
- [ ] Romper un bloque muestra en su posición una animación de 4 frames del mismo color que el bloque.
- [ ] La animación desaparece sola. Tras romper un bloque y esperar 1 segundo, `state.explosions.length` es `0` en la consola.
- [ ] Cada uno de los 6 colores (`red`, `yellow`, `cyan`, `magenta`, `hotpink`, `green`) usa sus propios frames.
- [ ] La pelota atraviesa la zona de un bloque que está explotando sin rebotar.
- [ ] La puntuación sigue sumando exactamente 10 puntos por bloque.
- [ ] Si la pelota cae mientras hay explosiones activas, terminan igualmente.
- [ ] Al romper el último bloque, la pantalla de Victoria aparece al instante.
- [ ] Tras `Enter` en Game Over o Victoria, `state.explosions.length` es `0`.
- [ ] La explosión dura lo mismo con monitores de 60 Hz y de 144 Hz.

## Decisiones

- **Sí:** 150 ms en total (37.5 ms por frame). Rápida y no frena el ritmo del juego.
- **No:** 150 ms por frame (600 ms en total). Acumula demasiadas explosiones en pantalla.
- **Sí:** el bloque deja de colisionar al instante. Mantiene la física de SPEC 01 y evita dobles rebotes.
- **No:** bloque sólido hasta acabar la animación.
- **Sí:** Victoria al instante. Decisión del usuario. La última explosión puede quedar tapada por la pantalla de Victoria.
- **No:** retrasar Victoria hasta el final de la explosión.
- **Sí:** array `state.explosions` aparte. Los bloques no cambian y solo se recorren las explosiones activas.
- **No:** campo de animación dentro de cada bloque.
- **Sí:** nuevo `src/effects.js`. `src/game.js` ya mezcla lógica y render.
- **No:** meter la lógica en `src/game.js`.
- **Sí:** las explosiones avanzan en cualquier estado. Ninguna queda congelada en pantalla.
- **No:** sonido de rotura en esta spec. Irá en una spec de audio junto con el rebote.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Unidades mezcladas: `dt` en segundos y `EXPLOSION_DURATION` en milisegundos | `elapsed` en milisegundos. Se suma `dt * 1000`. |
| `EXPLOSION_FRAMES.gray` reutiliza los frames de `red` | No afecta: no hay bloques `gray` en el juego actual. |
| La explosión se pinta encima de la paleta o la pelota | Pintar las explosiones justo después de los bloques y antes del resto. |

## Lo que **no** está en esta spec

- Sonidos.
- Partículas o sacudida de pantalla.
- Retraso de la pantalla de Victoria.
- Bloques resistentes (`gray`).
- Cambios en colisión o puntuación.

Cada uno, si se hace, irá en su propia spec.
