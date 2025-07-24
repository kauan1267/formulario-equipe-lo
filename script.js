const form = document.getElementById('logForm');
const screens = [...document.querySelectorAll('.screen')];
const timerEl = document.getElementById('timer');
const bar = document.getElementById('bar');
let current = 0;
let timeLeft = 24 * 60; // 24 minutes in seconds
const totalScreens = screens.length;

// Show initial screen
screens[current].classList.add('active');
updateProgressBar();

function updateProgressBar() {
  const progressPercent = ((current + 1) / totalScreens) * 100;
  bar.style.width = progressPercent + '%';
}

// Show screen by index
function showScreen(index) {
  if (index < 0 || index >= totalScreens) return;
  screens[current].classList.remove('active');
  current = index;
  screens[current].classList.add('active');
  updateProgressBar();
}

// Next and Previous buttons
document.querySelectorAll('.next').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!validateScreen(current)) return;
    showScreen(current + 1);
    if (current >= 1) {
      enableCopyPasteBlock();
    }
  });
});
document.querySelectorAll('.prev').forEach(btn => {
  btn.addEventListener('click', () => {
    showScreen(current - 1);
  });
});

// Validate all inputs in current screen
function validateScreen(screenIndex) {
  const inputs = screens[screenIndex].querySelectorAll('input,textarea');
  for (const input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }
  return true;
}

// Timer countdown
const interval = setInterval(() => {
  timeLeft--;
  if (timeLeft < 0) {
    clearInterval(interval);
    alert('O tempo acabou! O formulário será enviado automaticamente.');
    submitForm();
    return;
  }
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  timerEl.textContent = `${minutes}:${seconds}`;
}, 1000);

// Block Ctrl+C / Ctrl+V from screen 2 on
function enableCopyPasteBlock() {
  document.addEventListener('keydown', blockCopyPaste);
}
function blockCopyPaste(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
    e.preventDefault();
  }
}

// Prevent copy/paste via context menu
form.addEventListener('copy', e => {
  if (current >= 1) e.preventDefault();
});
form.addEventListener('paste', e => {
  if (current >= 1) e.preventDefault();
});

// Form submit
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateScreen(current)) return;
  clearInterval(interval);
  submitForm();
});

function submitForm() {
  const formData = new FormData(form);
  const dataObj = {};
  for (const [key, val] of formData.entries()) {
    dataObj[key] = val.trim();
  }

  const content = `**Formulário Equipe LOG enviado:**\n\n` +
    Object.entries(dataObj)
      .map(([key, val]) => `**${key}**: ${val}`)
      .join('\n');

  fetch('https://discord.com/api/webhooks/1397640296698740826/UJqim4Wfp-MZyAkRGy9f4YacQLac5yeeDxWaFl3TzucovKWS3ga44ChNrtRGFqdd5p9N', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  .then(res => {
    if (res.ok) {
      alert('Formulário enviado
