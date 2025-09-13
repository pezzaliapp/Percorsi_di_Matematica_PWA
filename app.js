// app.js aggiornato v6.3f

// Struttura quiz: ogni Anno/Grado contiene più Percorsi con domande proprie
const quizData = {
  "2ª primaria": {
    "Addizioni con cambio": [
      { domanda: "42 + 44 = ?", opzioni: ["85","86","87","96"], risposta: "86" }
    ],
    "Informatica: hardware/software (base)": [
      { domanda: "Il mouse è...", opzioni: ["Hardware","Software","Virus","Cartella"], risposta: "Hardware" }
    ]
  },
  "1ª liceo": {
    "Informatica: sistemi operativi e software": [
      { domanda: "Il kernel appartiene a...", opzioni: ["Firmware","Applicazione","Sistema operativo","Driver video"], risposta: "Sistema operativo" }
    ]
  },
  "5ª liceo": {
    "Informatica: sicurezza e privacy (avanzato)": [
      { domanda: "Il phishing è...", opzioni: ["Tentativo di furto credenziali con messaggi ingannevoli","Firma digitale","Backup online","Firewall hardware"], risposta: "Tentativo di furto credenziali con messaggi ingannevoli" },
      { domanda: "La crittografia serve a...", opzioni: ["Proteggere la confidenzialità dei dati","Velocizzare la rete","Stampare documenti","Comprimere immagini"], risposta: "Proteggere la confidenzialità dei dati" }
    ]
  }
};

let currentQuizSet = [];
let currentQuestionIndex = 0;
let score = 0;

// Popola i select con Anni/Gradi e Percorsi
function fillSelectors() {
  const gradeSelect = document.getElementById("gradeSelect");
  const pathSelect = document.getElementById("pathSelect");
  gradeSelect.innerHTML = "";
  pathSelect.innerHTML = "";

  Object.keys(quizData).forEach(grade => {
    const opt = document.createElement("option");
    opt.value = grade;
    opt.textContent = grade;
    gradeSelect.appendChild(opt);
  });

  gradeSelect.addEventListener("change", () => {
    const selected = gradeSelect.value;
    pathSelect.innerHTML = "";
    if (quizData[selected]) {
      Object.keys(quizData[selected]).forEach(path => {
        const opt = document.createElement("option");
        opt.value = path;
        opt.textContent = path;
        pathSelect.appendChild(opt);
      });
    }
  });

  gradeSelect.dispatchEvent(new Event("change"));
}

function startQuiz() {
  const grade = document.getElementById("gradeSelect").value;
  const path = document.getElementById("pathSelect").value;

  if (!quizData[grade] || !quizData[grade][path]) {
    alert("Percorso non disponibile");
    return;
  }

  currentQuizSet = quizData[grade][path];
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  if (currentQuestionIndex >= currentQuizSet.length) {
    container.innerHTML = `<h3>Quiz terminato</h3><p>Punteggio: ${score}/${currentQuizSet.length}</p>`;
    return;
  }

  const q = currentQuizSet[currentQuestionIndex];
  const qEl = document.createElement("div");
  qEl.innerHTML = `<h3>${q.domanda}</h3>`;

  q.opzioni.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "btn";
    btn.onclick = () => {
      if (opt === q.risposta) score++;
      currentQuestionIndex++;
      showQuestion();
    };
    qEl.appendChild(btn);
  });

  container.appendChild(qEl);
}

function howToPlay() {
  alert("Seleziona anno e percorso, rispondi ai quiz e accumula stelle!");
}

function resetProgress() {
  localStorage.clear();
  alert("Progressi ripristinati");
}

function toggleLIM() {
  alert("Modalità LIM attivata/disattivata");
}

function installApp() {
  alert("Per installare la PWA usa il menu del browser → Aggiungi a schermata Home.");
}

// Inizializza
window.onload = fillSelectors;
