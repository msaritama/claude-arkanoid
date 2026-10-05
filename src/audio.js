const SOUNDS = {
  bounce: new Audio('assets/sounds/ball-bounce.mp3'),
  break: new Audio('assets/sounds/break-sound.mp3'),
};

// Cada reproducción usa un clon, así los sonidos se pueden solapar.
function playSound(name) {
  SOUNDS[name].cloneNode().play().catch(() => {});
}
