const CANVAS_W = 480;
const CANVAS_H = 640;

const state = {
  status: 'serving', // 'serving' | 'playing' | 'gameover' | 'won'
  score: 0,
  lives: 3,
  paddle: createPaddle(),
  ball: null,
  blocks: createBlocks(),
};
state.ball = createBall(state.paddle);

function update(dt) {
  movePaddle(dt);

  if (state.status === 'serving') {
    stickBallToPaddle();
  }
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
}
