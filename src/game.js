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
