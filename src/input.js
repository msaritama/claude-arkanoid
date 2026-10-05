const keys = {
  left: false, right: false, launch: false, restart: false,
  easy: false, normal: false, hard: false,
};

const KEY_BINDINGS = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'launch',
  Enter: 'restart',
  Digit1: 'easy',
  Numpad1: 'easy',
  Digit2: 'normal',
  Numpad2: 'normal',
  Digit3: 'hard',
  Numpad3: 'hard',
};

function setKey(event, pressed) {
  const action = KEY_BINDINGS[event.code];
  if (!action) return;
  event.preventDefault();
  keys[action] = pressed;
}

window.addEventListener('keydown', (event) => setKey(event, true));
window.addEventListener('keyup', (event) => setKey(event, false));
