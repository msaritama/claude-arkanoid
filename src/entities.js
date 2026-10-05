const BLOCK_COLORS = ['red', 'yellow', 'cyan', 'magenta', 'hotpink', 'green'];
const BLOCK_COLS = 13;
const BLOCK_W = 32;
const BLOCK_H = 16;
const GRID_X = 32;
const GRID_Y = 64;

function createPaddle() {
  return { x: 192, y: 600, w: 96, h: 14, speed: 420 };
}

function createBall(paddle) {
  const size = 12;
  return {
    x: paddle.x + paddle.w / 2 - size / 2,
    y: paddle.y - size,
    size,
    vx: 0,
    vy: 0,
    speed: 300,
  };
}

function createBlocks() {
  const blocks = [];
  BLOCK_COLORS.forEach((color, row) => {
    for (let col = 0; col < BLOCK_COLS; col++) {
      blocks.push({
        x: GRID_X + col * BLOCK_W,
        y: GRID_Y + row * BLOCK_H,
        w: BLOCK_W,
        h: BLOCK_H,
        color,
        alive: true,
      });
    }
  });
  return blocks;
}
