const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const MAX_DT = 0.05;
let lastTime = 0;

function loop(time) {
  const dt = Math.min((time - lastTime) / 1000, MAX_DT);
  lastTime = time;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(loop);
}

loadSpritesheet(() => {
  requestAnimationFrame((time) => {
    lastTime = time;
    requestAnimationFrame(loop);
  });
});
