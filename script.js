const perguntas = document.querySelectorAll(".pergunta");
const progresso = document.getElementById("progresso");
const avancarBtn = document.getElementById("avancar");
const voltarBtn = document.getElementById("voltar");
const formulario = document.getElementById("formulario");
const mensagemFinal = document.getElementById("mensagem-final");

let perguntaAtual = 0;

// Atualiza a pergunta visível
function atualizarPergunta() {
  perguntas.forEach((pergunta, index) => {
    pergunta.classList.toggle("ativa", index === perguntaAtual);
  });

  // Atualiza progresso
  progresso.style.width = `${(perguntaAtual / (perguntas.length - 1)) * 100}%`;

  // Habilita/desabilita botões
  voltarBtn.disabled = perguntaAtual === 0;
  avancarBtn.textContent = perguntaAtual === perguntas.length - 1 ? "Enviar" : "Avançar";
}

// Avançar para a próxima pergunta ou enviar
avancarBtn.addEventListener("click", () => {
  if (perguntaAtual < perguntas.length - 1) {
    perguntaAtual++;
    atualizarPergunta();
  } else {
    enviarFormulario();
  }
});

// Voltar para a pergunta anterior
voltarBtn.addEventListener("click", () => {
  if (perguntaAtual > 0) {
    perguntaAtual--;
    atualizarPergunta();
  }
});

// Envio do formulário
function enviarFormulario() {
  const respostas = {};
  perguntas.forEach((pergunta) => {
    const input = pergunta.querySelector("input, textarea");
    respostas[input.name] = input.value;
  });

  // Envia para o webhook
  fetch("https://discord.com/api/webhooks/1397640296698740826/UJqim4Wfp-MZyAkRGy9f4YacQLac5yeeDxWaFl3TzucovKWS3ga44ChNrtRGFqdd5p9N", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: "Novo formulário enviado!",
      embeds: [{
        title: "Respostas do Formulário",
        description: JSON.stringify(respostas, null, 2),
        color: 65280 // Verde
      }]
    })
  });

  // Exibe mensagem final
  formulario.style.display = "none";
  mensagemFinal.classList.remove("oculto");
}

// Bloqueia Ctrl+C e Ctrl+V
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v")) {
    e.preventDefault();
    alert("Ctrl+C e Ctrl+V estão bloqueados!");
  }
});

// Inicializa
atualizarPergunta();
