const keys = { left: false, right: false, launch: false, restart: false };

const KEY_BINDINGS = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'launch',
  Enter: 'restart',
};

function setKey(event, pressed) {
  const action = KEY_BINDINGS[event.code];
  if (!action) return;
  event.preventDefault();
  keys[action] = pressed;
}

window.addEventListener('keydown', (event) => setKey(event, true));
window.addEventListener('keyup', (event) => setKey(event, false));
