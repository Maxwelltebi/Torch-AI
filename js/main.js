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
    key: "year",
    label: "What year of study are you currently in?",
    options: [
      { value: "1st year", label: "1st year" },
      { value: "2nd year", label: "2nd year" },
      { value: "3rd year", label: "3rd year" },
      { value: "4th year", label: "4th year" },
      { value: "postgraduate", label: "Postgraduate" },
    ],
    type: "select",
  },
  {
    key: "workStyle",
    label: "Do you prefer working alone or in teams?",
    options: [
      { value: "alone", label: "Alone and independent" },
      { value: "teams", label: "In teams and collaborative" },
      { value: "mixed", label: "Mixed — doesn't matter much" },
    ],
    type: "select",
  },
  {
    key: "environment",
    label: "What kind of organization appeals to you most?",
    options: [
      { value: "startup", label: "Fast-paced startup" },
      { value: "corporation", label: "Large corporation" },
      { value: "healthcare", label: "Hospital or healthcare" },
      { value: "research", label: "Research institution" },
      { value: "government", label: "Government or public sector" },
    ],
    type: "select",
  },
  {
    key: "techComfort",
    label: "How comfortable are you with coding and technical tools?",
    options: [
      { value: "not-at-all", label: "Not at all" },
      { value: "a-little", label: "A little" },
      { value: "moderately", label: "Moderately comfortable" },
      { value: "very-comfortable", label: "Very comfortable" },
    ],
    type: "select",
  },
  {
    key: "techSkills",
    label: "Which technical skills or tools do you have experience with?",
    options: [
      { value: "python", label: "Python" },
      { value: "javascript", label: "JavaScript" },
      { value: "sql", label: "SQL / Databases" },
      { value: "data-analysis", label: "Data analysis (Excel, Tableau, etc.)" },
      { value: "cloud", label: "Cloud computing (AWS, Azure, GCP)" },
      { value: "design", label: "UI/UX design tools" },
      { value: "none-yet", label: "None yet" },
    ],
    type: "select",
  },
  {
    key: "experience",
    label: "What kind of projects or work experience have you completed?",
    options: [
      { value: "personal-projects", label: "Personal projects" },
      { value: "internships", label: "Internships or job experience" },
      { value: "academic-projects", label: "Academic team projects" },
      { value: "open-source", label: "Open-source contributions" },
      { value: "none", label: "None yet" },
    ],
    type: "select",
  },
  {
    key: "learningStyle",
    label: "How do you prefer to learn new skills?",
    options: [
      { value: "hands-on", label: "Hands-on learning by doing" },
      { value: "reading", label: "Reading, research & documentation" },
      { value: "mentorship", label: "Mentorship and guidance" },
      { value: "courses", label: "Structured courses and training" },
    ],
    type: "select",
  },
  {
    key: "problemSolving",
    label: "What's your typical problem-solving approach?",
    options: [
      { value: "analytical", label: "Analytical and data-driven" },
      { value: "creative", label: "Creative and experimental" },
      { value: "collaborative", label: "Collaborative and people-focused" },
      { value: "systematic", label: "Systematic and structured" },
    ],
    type: "select",
  },
  {
    key: "interests",
    label: "What topics or areas genuinely excite you?",
    placeholder: "e.g. AI, healthcare, sustainability, finance, design...",
    type: "text",
  },
  {
    key: "ambition",
    label: "Where do you see yourself in 10 years?",
    options: [
      { value: "leadership", label: "Leading a team or organization" },
      { value: "entrepreneurship", label: "Building my own company/startup" },
      { value: "expert", label: "Expert in my field" },
      { value: "impact", label: "Making a social or environmental impact" },
      { value: "balance", label: "Achieving work-life balance and fulfillment" },
    ],
    type: "select",
  },
  {
    key: "values",
    label: "What matters most to you in a career?",
    options: [
      { value: "impact", label: "Making an impact" },
      { value: "salary", label: "Competitive salary and growth" },
      { value: "stability", label: "Job stability" },
      { value: "innovation", label: "Innovation and continuous learning" },
      { value: "helping", label: "Helping people" },
    ],
    type: "select",
  },
  {
    key: "workLife",
    label: "How important is work-life balance to you?",
    options: [
      { value: "not-important", label: "Not important" },
      { value: "somewhat-important", label: "Somewhat important" },
      { value: "very-important", label: "Very important" },
      { value: "critical", label: "Critical" },
    ],
    type: "select",
  },
  {
    key: "strengths",
    label: "What are your greatest strengths?",
    options: [
      { value: "analytical", label: "Analytical thinking" },
      { value: "creativity", label: "Creativity and design" },
      { value: "leadership", label: "Leadership and communication" },
      { value: "problem-solving", label: "Problem-solving and coding" },
      { value: "detail", label: "Attention to detail and precision" },
    ],
    type: "select",
  },
  {
    key: "dislikes",
    label: "What do you want to avoid in a job?",
    options: [
      { value: "repetitive", label: "Repetitive or monotonous work" },
      { value: "people-heavy", label: "Too much people interaction" },
      { value: "stress", label: "High stress or intense demands" },
      { value: "autonomy", label: "Lack of autonomy or creativity" },
      { value: "meaningless", label: "Work that doesn't feel meaningful" },
    ],
    type: "select",
  },
  {
    key: "leadership",
    label: "Are you interested in leading teams?",
    options: [
      { value: "yes", label: "Yes, developing leadership skills" },
      { value: "no", label: "No, prefer individual contribution" },
      { value: "later", label: "Maybe later in my career" },
      { value: "unsure", label: "Unsure" },
    ],
    type: "select",
  },
  {
    key: "industry",
    label: "Which industry interests you most?",
    options: [
      { value: "tech", label: "Technology" },
      { value: "healthcare", label: "Healthcare" },
      { value: "finance", label: "Finance" },
      { value: "consulting", label: "Consulting" },
      { value: "public-sector", label: "Public sector / Government" },
      { value: "education", label: "Education" },
      { value: "other", label: "Other" },
    ],
    type: "select",
  },
  {
    key: "extra",
    label: "Anything else you'd like us to know? (Optional)",
    placeholder: "Share anything the quiz didn't cover...",
    type: "text",
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
