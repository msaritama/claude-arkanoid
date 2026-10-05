# SPEC 03 — Sonidos y niveles de dificultad

> **Estado:** Implementado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-10-05
> **Objetivo:** El juego reproduce `ball-bounce.mp3` y `break-sound.mp3` en los rebotes y roturas, y arranca con un menú donde se elige dificultad Fácil, Normal o Difícil con las teclas `1`/`2`/`3`.

## Alcance

**Dentro:**

- Nuevo archivo `src/audio.js` que carga `assets/sounds/ball-bounce.mp3` y `assets/sounds/break-sound.mp3` con `HTMLAudioElement`.
- Cada reproducción usa `cloneNode().play()`, para que los sonidos se puedan solapar.
- `ball-bounce.mp3` suena al rebotar en la paleta, en las paredes laterales y en el techo.
- `break-sound.mp3` suena al romper un bloque. Romper un bloque no reproduce además `ball-bounce.mp3`.
- Si el navegador rechaza `play()`, el error se ignora y el juego sigue.
- Tres dificultades: `easy`, `normal`, `hard`.
- La dificultad cambia la velocidad de la pelota y el ancho de la paleta. Las vidas siguen siendo 3.
- Nuevo estado `'menu'`. El juego arranca en el menú.
- En el menú, `1`, `2` y `3` (fila superior y teclado numérico) eligen dificultad y empiezan la partida en `serving`.
- `Enter` en Game Over o Victoria vuelve al menú.
- El HUD muestra la dificultad centrada entre PUNTOS y VIDAS: `FÁCIL`, `NORMAL` o `DIFÍCIL`.
- Las pantallas de Game Over y Victoria también muestran la dificultad.

**Fuera de alcance (para futuras specs):**

- Sonido al perder una vida, en Game Over o en Victoria.
- Música de fondo.
- Control de volumen y tecla de silencio.
- Web Audio API.
- Guardar la dificultad elegida entre sesiones.
- Cambiar las vidas, la velocidad de la paleta o la rejilla de bloques según la dificultad.
- Aumentar la velocidad durante la partida.
- Pausa y control con ratón.

## Modelo de datos

```js
// src/entities.js
const DIFFICULTIES = {
  easy:   { label: 'FÁCIL',   ballSpeed: 240, paddleWidth: 120 },
  normal: { label: 'NORMAL',  ballSpeed: 300, paddleWidth: 96 },
  hard:   { label: 'DIFÍCIL', ballSpeed: 380, paddleWidth: 72 },
};
// createPaddle(difficulty) -> { x: (CANVAS_W - w) / 2, y: 600, w: paddleWidth, h: 14, speed: 420 }
// createBall(paddle, difficulty) -> speed: ballSpeed
```

```js
// src/game.js
const state = {
  status: 'menu', // 'menu' | 'serving' | 'playing' | 'gameover' | 'won'
  difficulty: 'normal', // 'easy' | 'normal' | 'hard'
  // ...resto de campos de SPEC 01 y SPEC 02 sin cambios
};
// createInitialState(difficulty, status)
// startGame(difficulty) -> estado inicial con esa dificultad y status 'serving'
// resetGame()           -> estado inicial con status 'menu'
```

```js
// src/input.js
const keys = {
  left: false, right: false, launch: false, restart: false,
  easy: false, normal: false, hard: false,
};
// KEY_BINDINGS añade: Digit1/Numpad1 -> 'easy', Digit2/Numpad2 -> 'normal', Digit3/Numpad3 -> 'hard'
```

```js
// src/audio.js
const SOUNDS = {
  bounce: new Audio('assets/sounds/ball-bounce.mp3'),
  break: new Audio('assets/sounds/break-sound.mp3'),
};
// playSound(name) -> SOUNDS[name].cloneNode().play(), con .catch() que ignora el error
```

Convenciones:

- `ballSpeed` en píxeles por segundo, como en SPEC 01.
- Los valores de `DIFFICULTIES` son iniciales y se pueden ajustar durante la implementación.
- La paleta empieza centrada para cualquier ancho.
- En el menú se pintan los bloques de fondo y encima el panel del menú. El HUD no se pinta en el menú.

## Plan de implementación

1. Crear `src/audio.js` con `SOUNDS` y `playSound(name)`. Añadirlo en `index.html` entre `assets/spritesheet.js` y `src/input.js`. Prueba manual: el juego carga sin errores y `playSound('bounce')` en la consola suena.
2. Llamar a `playSound('bounce')` en `moveBall()` al rebotar en las paredes laterales y en el techo, y en `bounceOffPaddle()` al rebotar en la paleta.
3. Llamar a `playSound('break')` en `hitBlock()` al romper un bloque. Prueba manual: rebotes y roturas suenan.
4. Añadir `DIFFICULTIES` en `src/entities.js`. `createPaddle(difficulty)` y `createBall(paddle, difficulty)` usan sus valores. La paleta empieza centrada.
5. En `src/game.js`, `createInitialState(difficulty, status)` guarda `difficulty` y `status`. El estado inicial del juego es `createInitialState('normal', 'menu')`. Añadir `startGame(difficulty)`. `resetGame()` vuelve a `'menu'`.
6. Añadir `easy`, `normal` y `hard` a `keys` y a `KEY_BINDINGS` en `src/input.js`.
7. En `update(dt)`, en estado `'menu'`, las teclas `1`/`2`/`3` llaman a `startGame()`. Las explosiones siguen avanzando en cualquier estado.
8. Añadir `renderMenu(ctx)`: panel oscuro con el título `ARKANOID` y las líneas `1 - FÁCIL`, `2 - NORMAL`, `3 - DIFÍCIL`. Pintarlo en `render()` cuando el estado es `'menu'`, sin HUD. Prueba manual: al abrir el juego se ve el menú.
9. Mostrar la dificultad en el centro del HUD y en `renderMessage()` de Game Over y Victoria. Cambiar el texto de `renderMessage()` a `Pulsa Enter para volver al menú`.

## Criterios de aceptación

- [ ] Abrir `index.html` no muestra errores en la consola.
- [ ] Al abrir el juego aparece el menú con `ARKANOID` y las tres dificultades.
- [ ] En el menú, `Espacio` y las flechas no inician la partida.
- [ ] `1` empieza una partida con pelota a 240 px/s y paleta de 120 px.
- [ ] `2` empieza una partida con pelota a 300 px/s y paleta de 96 px.
- [ ] `3` empieza una partida con pelota a 380 px/s y paleta de 72 px.
- [ ] `Numpad1`, `Numpad2` y `Numpad3` funcionan igual que `1`, `2` y `3`.
- [ ] En las tres dificultades la partida empieza con 3 vidas, 0 puntos y 78 bloques.
- [ ] La paleta empieza centrada en las tres dificultades.
- [ ] El HUD muestra `FÁCIL`, `NORMAL` o `DIFÍCIL` según la tecla pulsada.
- [ ] Rebotar en la paleta, en una pared lateral o en el techo reproduce `ball-bounce.mp3`.
- [ ] Romper un bloque reproduce `break-sound.mp3` y no reproduce `ball-bounce.mp3`.
- [ ] Romper dos bloques seguidos reproduce dos sonidos solapados sin cortar el primero.
- [ ] Perder una vida no reproduce ningún sonido.
- [ ] Game Over y Victoria muestran la dificultad de la partida.
- [ ] `Enter` en Game Over o Victoria vuelve al menú.
- [ ] Si se borra `assets/sounds/`, el juego sigue funcionando sin sonido.

## Decisiones

- **Sí:** una sola spec para sonidos y dificultad. Decisión del usuario. Ambas son pequeñas.
- **No:** dos specs separadas.
- **Sí:** `HTMLAudioElement` con `cloneNode().play()`. Funciona con `file://` y permite solapar sonidos.
- **No:** un único `Audio` por sonido reiniciando `currentTime`. Las roturas rápidas cortan el sonido anterior.
- **No:** Web Audio API. `fetch()` de los `.mp3` falla con `file://` y exigiría servidor local.
- **Sí:** sonido de rebote en paleta, paredes y techo. Sonido de rotura en bloques.
- **No:** tecla de silencio ni control de volumen. Queda para otra spec.
- **Sí:** la dificultad cambia la velocidad de la pelota y el ancho de la paleta.
- **No:** cambiar las vidas por dificultad.
- **Sí:** Normal usa los valores de SPEC 01 (300 px/s, 96 px). El juego actual pasa a ser la dificultad Normal.
- **Sí:** menú de inicio con `1`/`2`/`3`. Es el primer menú del juego y cubre el "menú de título" que SPEC 01 dejó fuera.
- **No:** elegir dificultad con `1`/`2`/`3` durante `serving` sin pantalla propia.
- **Sí:** `Enter` en Game Over o Victoria vuelve al menú. Permite cambiar de dificultad entre partidas.
- **No:** guardar la dificultad en `localStorage`. La persistencia irá con los récords.
- **Sí:** `DIFFICULTIES` en `src/entities.js`, junto a las otras constantes de creación de entidades.
- **Sí:** nuevo `src/audio.js`. Separa la carga de audio de la lógica del juego.
- **Sí:** el primer sonido llega después de una tecla del menú. Cumple la política de autoplay de los navegadores.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El navegador bloquea `play()` sin interacción previa (autoplay) | El primer sonido llega tras pulsar `1`/`2`/`3`. `playSound()` captura el rechazo con `.catch()`. |
| A 380 px/s la pelota atraviesa bloques (tunneling) | Con `dt` limitado a 0.05 s, avanza como máximo 19 px por frame, más que el alto de un bloque (16 px). Si se ve tunneling, bajar `MAX_DT` en `src/main.js` a 0.04 (15.2 px). |
| Muchos `cloneNode()` simultáneos acumulan elementos de audio | Los clones no se guardan en ninguna referencia y el navegador los libera al terminar. |
| `Enter` sigue pulsado al volver al menú | El menú solo responde a `1`/`2`/`3`, así que `Enter` no tiene efecto allí. |

## Lo que **no** está en esta spec

- Sonidos de vida perdida, Game Over o Victoria.
- Música, volumen y silencio.
- Persistencia de la dificultad.
- Cambios de vidas, velocidad de paleta o bloques por dificultad.
- Aceleración progresiva de la pelota.
- Pausa y control con ratón.

Cada uno, si se hace, irá en su propia spec.
