const BLOCK_COLORS = ['red', 'yellow', 'cyan', 'magenta', 'hotpink', 'green'];
const BLOCK_COLS = 13;
const BLOCK_W = 32;
const BLOCK_H = 16;
const GRID_X = 32;
const GRID_Y = 64;

const DIFFICULTIES = {
  easy:   { label: 'FÁCIL',   ballSpeed: 240, paddleWidth: 120 },
  normal: { label: 'NORMAL',  ballSpeed: 300, paddleWidth: 96 },
  hard:   { label: 'DIFÍCIL', ballSpeed: 380, paddleWidth: 72 },
};

function createPaddle(difficulty) {
  const w = DIFFICULTIES[difficulty].paddleWidth;
  return { x: (CANVAS_W - w) / 2, y: 600, w, h: 14, speed: 420 };
}

function createBall(paddle, difficulty) {
  const size = 12;
  return {
    x: paddle.x + paddle.w / 2 - size / 2,
    y: paddle.y - size,
    size,
    vx: 0,
    vy: 0,
    speed: DIFFICULTIES[difficulty].ballSpeed,
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
