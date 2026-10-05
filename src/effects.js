const EXPLOSION_FRAME_COUNT = 4;

function createExplosion(block) {
  return {
    x: block.x,
    y: block.y,
    w: block.w,
    h: block.h,
    color: block.color,
    elapsed: 0, // ms, igual que EXPLOSION_DURATION
  };
}

function updateExplosions(dt) {
  for (const explosion of state.explosions) {
    explosion.elapsed += dt * 1000;
  }
  state.explosions = state.explosions.filter(
    (explosion) => explosion.elapsed < EXPLOSION_DURATION
  );
}

function renderExplosions(ctx) {
  const frameDuration = EXPLOSION_DURATION / EXPLOSION_FRAME_COUNT;

  for (const explosion of state.explosions) {
    const index = Math.min(
      EXPLOSION_FRAME_COUNT - 1,
      Math.floor(explosion.elapsed / frameDuration)
    );
    const frame = EXPLOSION_FRAMES[explosion.color][index];
    drawFrame(ctx, frame, explosion.x, explosion.y, explosion.w, explosion.h);
  }
}
