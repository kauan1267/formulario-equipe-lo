const formSlides = document.querySelectorAll(".form-slide");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const progress = document.getElementById("progress");
const timerEl = document.getElementById("timer");

let currentSlide = 0;
let totalSlides = formSlides.length;
let timeLeft = 1440; // 24 minutos
let ctrlBlocked = false;

// Timer
const timerInterval = setInterval(() => {
  timeLeft--;
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  timerEl.textContent = `${minutes}:${seconds}`;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    alert("Tempo esgotado!");
    document.getElementById("logForm").submit();
  }
}, 1000);

// Navegação
function showSlide(n) {
  formSlides[currentSlide].classList.remove("active");
  currentSlide = n;
  formSlides[currentSlide].classList.add("active");

  // progress bar
  progress.style.width = ((currentSlide + 1) / totalSlides) * 100 + "%";

  // Botões
  prevBtn.style.display = currentSlide === 0 ? "none" : "inline-block";
  nextBtn.style.display = currentSlide === totalSlides - 1 ? "none" : "inline-block";
  submitBtn.style.display = currentSlide === totalSlides - 1 ? "inline-block" : "none";

  // Bloquear Ctrl+C e Ctrl+V após 2ª pergunta
  if (currentSlide >= 1 && !ctrlBlocked) {
    ctrlBlocked = true;
    document.addEventListener("copy", e => e.preventDefault());
    document.addEventListener("paste", e => e.preventDefault());
  }
}
showSlide(0);

nextBtn.addEventListener("click", () => {
  if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
});
prevBtn.addEventListener("click", () => {
  if (currentSlide > 0) showSlide(currentSlide - 1);
});

// Enviar para o webhook
document.getElementById("logForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = new FormData(this);
  let message = "**📋 Formulário LOG enviado!**\n\n";
  let count = 1;

  for (let [key, value] of data.entries()) {
    message += `**${count}.** ${value}\n`;
    count++;
  }

  await fetch("https://discord.com/api/webhooks/1397640296698740826/UJqim4Wfp-MZyAkRGy9f4YacQLac5yeeDxWaFl3TzucovKWS3ga44ChNrtRGFqdd5p9N", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message })
  });

  alert("✅ Formulário enviado com sucesso!");
  location.reload();
});
