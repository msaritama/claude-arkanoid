const CANVAS_W = 480;
const CANVAS_H = 640;
const MAX_BOUNCE_ANGLE = Math.PI / 3; // 60°

function createInitialState() {
  const paddle = createPaddle();
  return {
    status: 'serving', // 'serving' | 'playing' | 'gameover' | 'won'
    score: 0,
    lives: 3,
    paddle,
    ball: createBall(paddle),
    blocks: createBlocks(),
  };
}

const state = createInitialState();

function resetGame() {
  Object.assign(state, createInitialState());
}

function update(dt) {
  if (state.status === 'gameover' || state.status === 'won') {
    if (keys.restart) resetGame();
    return;
  }

  movePaddle(dt);

  if (state.status === 'serving') {
    stickBallToPaddle();
    if (keys.launch) launchBall();
  } else if (state.status === 'playing') {
    moveBall(dt);
  }
}

function launchBall() {
  const { ball } = state;
  ball.vx = 0;
  ball.vy = -ball.speed;
  state.status = 'playing';
}

function moveBall(dt) {
  const { ball } = state;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.x < 0) {
    ball.x = 0;
    ball.vx = Math.abs(ball.vx);
  } else if (ball.x + ball.size > CANVAS_W) {
    ball.x = CANVAS_W - ball.size;
    ball.vx = -Math.abs(ball.vx);
  }

  if (ball.y < 0) {
    ball.y = 0;
    ball.vy = Math.abs(ball.vy);
  }

  bounceOffPaddle();
  hitBlock();

  if (state.blocks.every((block) => !block.alive)) {
    state.status = 'won';
  } else if (ball.y > CANVAS_H) {
    loseLife();
  }
}

function loseLife() {
  const { ball } = state;
  state.lives -= 1;
  ball.vx = 0;
  ball.vy = 0;
  state.status = state.lives > 0 ? 'serving' : 'gameover';
}

// Como máximo una colisión con bloques por frame.
function hitBlock() {
  const { ball } = state;

  for (const block of state.blocks) {
    if (!block.alive) continue;

    const overlapX =
      Math.min(ball.x + ball.size, block.x + block.w) - Math.max(ball.x, block.x);
    const overlapY =
      Math.min(ball.y + ball.size, block.y + block.h) - Math.max(ball.y, block.y);
    if (overlapX <= 0 || overlapY <= 0) continue;

    block.alive = false;
    state.score += 10;

    // El eje con menor solapamiento es el del impacto.
    if (overlapX < overlapY) {
      const fromLeft = ball.x + ball.size / 2 < block.x + block.w / 2;
      ball.vx = fromLeft ? -Math.abs(ball.vx) : Math.abs(ball.vx);
    } else {
      const fromAbove = ball.y + ball.size / 2 < block.y + block.h / 2;
      ball.vy = fromAbove ? -Math.abs(ball.vy) : Math.abs(ball.vy);
    }
    return;
  }
}

function bounceOffPaddle() {
  const { paddle, ball } = state;
  if (ball.vy <= 0) return;

  const overlaps =
    ball.x + ball.size > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y &&
    ball.y < paddle.y + paddle.h;
  if (!overlaps) return;

  // -1 = extremo izquierdo, 0 = centro, 1 = extremo derecho.
  const ballCenter = ball.x + ball.size / 2;
  const paddleCenter = paddle.x + paddle.w / 2;
  const offset = Math.max(-1, Math.min(1, (ballCenter - paddleCenter) / (paddle.w / 2)));
  const angle = offset * MAX_BOUNCE_ANGLE;

  ball.vx = ball.speed * Math.sin(angle);
  ball.vy = -ball.speed * Math.cos(angle);
  ball.y = paddle.y - ball.size;
}

function movePaddle(dt) {
  const { paddle } = state;
  let direction = 0;
  if (keys.left) direction -= 1;
  if (keys.right) direction += 1;

  paddle.x += direction * paddle.speed * dt;
  paddle.x = Math.max(0, Math.min(CANVAS_W - paddle.w, paddle.x));
}

function stickBallToPaddle() {
  const { paddle, ball } = state;
  ball.x = paddle.x + paddle.w / 2 - ball.size / 2;
  ball.y = paddle.y - ball.size;
}

function render(ctx) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  for (const block of state.blocks) {
    if (!block.alive) continue;
    drawSprite(ctx, `block_${block.color}`, block.x, block.y, block.w, block.h);
  }

  const { paddle, ball } = state;
  drawSprite(ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h);
  drawSprite(ctx, 'ball', ball.x, ball.y, ball.size, ball.size);

  renderHud(ctx);

  if (state.status === 'gameover') {
    renderMessage(ctx, 'GAME OVER');
  } else if (state.status === 'won') {
    renderMessage(ctx, '¡VICTORIA!');
  }
}

function renderHud(ctx) {
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(`PUNTOS: ${state.score}`, 16, 20);
  ctx.textAlign = 'right';
  ctx.fillText(`VIDAS: ${state.lives}`, CANVAS_W - 16, 20);
}

function renderMessage(ctx, title) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 40px monospace';
  ctx.fillText(title, CANVAS_W / 2, CANVAS_H / 2 - 40);
  ctx.font = '20px monospace';
  ctx.fillText(`Puntos: ${state.score}`, CANVAS_W / 2, CANVAS_H / 2 + 10);
  ctx.font = '16px monospace';
  ctx.fillText('Pulsa Enter para reiniciar', CANVAS_W / 2, CANVAS_H / 2 + 50);
}
