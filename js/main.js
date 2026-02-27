// main.js — UI state management and screen navigation

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  currentScreen: "welcome", // welcome | questions | loading | results | browse
  currentQuestion: 0,
  answers: {},
  result: null,
};

const QUESTIONS = [
  {
    key: "major",
    label: "What is your major or field of study?",
    placeholder: "e.g. Computer Science, Pharmacy, Business Administration...",
    type: "text",
  },
  {
    key: "interests",
    label: "What activities or topics excite you most?",
    placeholder: "e.g. building apps, analyzing trends, working with patients...",
    type: "text",
  },
  {
    key: "environment",
    label: "What kind of work environment do you prefer?",
    options: [
      { value: "fast-paced startup", label: "Fast-paced startup" },
      { value: "large corporation or hospital", label: "Large organization" },
      { value: "research or academia", label: "Research / Academia" },
      { value: "remote and independent", label: "Remote & independent" },
      { value: "collaborative team setting", label: "Collaborative team" },
    ],
    type: "select",
  },
  {
    key: "goal",
    label: "What is your primary career goal?",
    options: [
      { value: "build products that reach millions", label: "Build impactful products" },
      { value: "drive business growth and strategy", label: "Drive business strategy" },
      { value: "advance healthcare and patient outcomes", label: "Advance healthcare" },
      { value: "protect systems and digital infrastructure", label: "Protect systems" },
      { value: "conduct research and discover new things", label: "Conduct research" },
    ],
    type: "select",
  },
  {
    key: "strength",
    label: "What is your strongest skill or quality?",
    options: [
      { value: "analytical and data-driven thinking", label: "Analytical thinking" },
      { value: "creativity and design sense", label: "Creativity & design" },
      { value: "communication and leadership", label: "Communication & leadership" },
      { value: "technical and engineering skills", label: "Technical skills" },
      { value: "attention to detail and precision", label: "Attention to detail" },
    ],
    type: "select",
  },
];

// ─── DOM helpers ─────────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showScreen(name) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  const target = $(`#screen-${name}`);
  if (target) {
    target.classList.add("active");
    target.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  state.currentScreen = name;
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
function initWelcome() {
  $("#btn-find-path").addEventListener("click", () => {
    state.currentQuestion = 0;
    state.answers = {};
    renderQuestion();
    showScreen("questions");
  });

  $("#btn-browse").addEventListener("click", () => {
    renderBrowse();
    showScreen("browse");
  });

  // logo click returns to home
  document.querySelectorAll('.logo').forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => showScreen('welcome'));
  });
}

// ─── Question Flow ────────────────────────────────────────────────────────────
function renderQuestion() {
  const q = QUESTIONS[state.currentQuestion];
  const total = QUESTIONS.length;
  const idx = state.currentQuestion;

  // Progress
  $("#q-progress-text").textContent = `Question ${idx + 1} of ${total}`;
  $("#q-progress-fill").style.width = `${((idx + 1) / total) * 100}%`;

  // Label
  $("#q-label").textContent = q.label;

  // Input area
  const inputArea = $("#q-input-area");
  inputArea.innerHTML = "";

  if (q.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "q-text-input";
    input.placeholder = q.placeholder;
    input.value = state.answers[q.key] || "";
    input.addEventListener("input", () => {
      state.answers[q.key] = input.value.trim();
      updateNextBtn();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && state.answers[q.key]) handleNext();
    });
    inputArea.appendChild(input);
    setTimeout(() => input.focus(), 100);
  } else {
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "q-option-btn";
      btn.textContent = opt.label;
      if (state.answers[q.key] === opt.value) btn.classList.add("selected");
      btn.addEventListener("click", () => {
        $$(".q-option-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.answers[q.key] = opt.value;
        updateNextBtn();
      });
      inputArea.appendChild(btn);
    });
  }

  // Back button
  const backBtn = $("#q-back");
  backBtn.style.visibility = idx === 0 ? "hidden" : "visible";

  updateNextBtn();
}

function updateNextBtn() {
  const q = QUESTIONS[state.currentQuestion];
  const hasAnswer = !!state.answers[q.key];
  const nextBtn = $("#q-next");
  const isLast = state.currentQuestion === QUESTIONS.length - 1;
  nextBtn.textContent = isLast ? "Find My Path" : "Next";
  nextBtn.disabled = !hasAnswer;
}

function handleNext() {
  const isLast = state.currentQuestion === QUESTIONS.length - 1;
  if (isLast) {
    submitAnswers();
  } else {
    state.currentQuestion++;
    renderQuestion();
  }
}

function initQuestions() {
  $("#q-next").addEventListener("click", handleNext);
  $("#q-back").addEventListener("click", () => {
    if (state.currentQuestion > 0) {
      state.currentQuestion--;
      renderQuestion();
    }
  });
}

// ─── Submit & Loading ─────────────────────────────────────────────────────────
async function submitAnswers() {
  showScreen("loading");
  try {
    const result = await getCareerRecommendation(state.answers);
    state.result = result;
    renderResults(result);
    showScreen("results");
  } catch (err) {
    showScreen("questions");
    showToast("Something went wrong: " + err.message);
  }
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function renderResults(result) {
  const kit = getKitById(result.recommendedId);
  const alt = getKitById(result.alternativeId);

  if (!kit) {
    showToast("Could not find recommended kit. Please try again.");
    showScreen("welcome");
    return;
  }

  $("#result-field-badge").textContent = kit.field;
  $("#result-title").textContent = kit.title;
  $("#result-description").textContent = kit.description;
  $("#result-reasoning").textContent = result.reasoning;

  // Skills
  const skillsEl = $("#result-skills");
  skillsEl.innerHTML = kit.skills
    .map((s) => `<span class="skill-tag">${s}</span>`)
    .join("");

  // CTA
  const kitBtn = $("#result-kit-btn");
  kitBtn.href = kit.kitLink;

  // Alternative
  if (alt) {
    $("#result-alt-title").textContent = alt.title;
    $("#result-alt-field").textContent = alt.field;
    $("#result-alt-link").href = alt.kitLink;
    $("#result-alt-link").addEventListener("click", (e) => {
      e.preventDefault();
      window.open(alt.kitLink, "_blank");
    });
    $("#result-alternative").style.display = "flex";
  } else {
    $("#result-alternative").style.display = "none";
  }
}

function initResults() {
  $("#btn-retake").addEventListener("click", () => {
    state.currentQuestion = 0;
    state.answers = {};
    renderQuestion();
    showScreen("questions");
  });

  $("#btn-browse-from-results").addEventListener("click", () => {
    renderBrowse();
    showScreen("browse");
  });
}

// ─── Browse All Kits ──────────────────────────────────────────────────────────
function renderBrowse() {
  const container = $("#browse-fields");
  container.innerHTML = "";

  FIELDS.forEach((field) => {
    const kits = getKitsByField(field.slug);
    const section = document.createElement("div");
    section.className = "browse-field-section";

    section.innerHTML = `
      <div class="browse-field-header">
        <i data-lucide="${field.icon}" class="field-icon"></i>
        <h3>${field.label}</h3>
        <span class="kit-count">${kits.length} kits</span>
      </div>
      <div class="browse-kits-grid">
        ${kits
          .map(
            (k) => `
          <a class="browse-kit-card" href="${k.kitLink}" target="_blank" rel="noopener">
            <div class="bkc-header">
              <span class="bkc-title">${k.title}</span>
              <i data-lucide="external-link" class="bkc-icon"></i>
            </div>
            <p class="bkc-desc">${k.description}</p>
            <div class="bkc-skills">
              ${k.skills.slice(0, 3).map((s) => `<span class="skill-tag small">${s}</span>`).join("")}
            </div>
          </a>
        `
          )
          .join("")}
      </div>
    `;

    container.appendChild(section);
  });

  // Re-init lucide icons
  if (window.lucide) lucide.createIcons();
}

function initBrowse() {
  $("#btn-back-from-browse").addEventListener("click", () => {
    showScreen("welcome");
  });

  $("#btn-find-from-browse").addEventListener("click", () => {
    state.currentQuestion = 0;
    state.answers = {};
    renderQuestion();
    showScreen("questions");
  });
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function showToast(message) {
  let toast = $("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initWelcome();
  initQuestions();
  initResults();
  initBrowse();
  showScreen("welcome");

  initTheme();
  if (window.lucide) lucide.createIcons();
});

// ─── Theme toggle ───────────────────────────────────────────────────────────
function initTheme() {
  const buttons = document.querySelectorAll('.theme-toggle');
  if (buttons.length === 0) return;

  const setTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateIcons(theme);
  };

  const updateIcons = (theme) => {
    buttons.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', theme === 'light' ? 'sun' : 'moon');
    });
    if (window.lucide) lucide.createIcons();
  };

  // load stored or default (fall back to system preference)
  const stored = localStorage.getItem('theme');
  let initial;
  if (stored === 'light' || stored === 'dark') {
    initial = stored;
  } else {
    initial = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  setTheme(initial);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(current);
    });
  });
}
