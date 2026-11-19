// CARBONCUT Interactive Quiz State Machine, Carbon Footprint Calculator & CRUD Array

const AUDIT_QUESTIONS = [
  {
    question: "In greenhouse gas accounting, what does Scope 2 cover?",
    options: [
      { key: "A", label: "Direct tailpipe emissions from company-owned delivery trucks" },
      { key: "B", label: "Indirect emissions from purchased electricity, steam, and cooling" },
      { key: "C", label: "End-of-life landfill disposal of sold packaging" },
      { key: "D", label: "Personal weekend flights taken by employees" }
    ],
    answerIdx: 1,
    note: "Scope 2 covers purchased electricity—contracting a Solar PPA directly reduces Scope 2 CO₂e."
  },
  {
    question: "Which standardized unit expresses all greenhouse gases on a single warming scale?",
    options: [
      { key: "A", label: "Kilowatt-Hours Equivalent (kWhe)" },
      { key: "B", label: "Particulate Density Index (PDI)" },
      { key: "C", label: "Carbon Dioxide Equivalent (CO₂e)" },
      { key: "D", label: "British Thermal Units (BTU)" }
    ],
    answerIdx: 2,
    note: "CO₂e normalizes CO₂, methane, and nitrous oxide using their Global Warming Potential."
  },
  {
    question: "What is the recommended first action in a credible decarbonization roadmap?",
    options: [
      { key: "A", label: "Measure baseline emissions and cut direct energy & fleet waste first" },
      { key: "B", label: "Buy low-cost unverified offsets without auditing energy consumption" },
      { key: "C", label: "Increase diesel generator runtime during peak tariff hours" },
      { key: "D", label: "Exclude Scope 3 supplier freight from annual disclosures" }
    ],
    answerIdx: 0,
    note: "Measure first, abate operational emissions second, and retire verified removal credits last."
  },
  {
    question: "Which coastal ecosystem stores carbon up to 4x faster per hectare than terrestrial forests?",
    options: [
      { key: "A", label: "Urban concrete industrial parks" },
      { key: "B", label: "Blue Carbon ecosystems (Mangroves & Tidal Seagrass)" },
      { key: "C", label: "Open-pit aggregate quarries" },
      { key: "D", label: "Irrigated golf course turf" }
    ],
    answerIdx: 1,
    note: "Mangroves lock carbon in both woody biomass and oxygen-poor coastal sediments."
  },
  {
    question: "What does Science Based Targets initiative (SBTi) Net-Zero require by 2050?",
    options: [
      { key: "A", label: "10% operational cuts paired with 90% avoidance offsets" },
      { key: "B", label: "Complete shutdown of all grid-connected equipment" },
      { key: "C", label: "At least 90% deep value-chain decarbonization plus permanent carbon removal" },
      { key: "D", label: "Publishing an annual sustainability brochure without targets" }
    ],
    answerIdx: 2,
    note: "Net-Zero requires >90% actual value-chain reductions before neutralizing residual emissions."
  }
];

let qIdx = 0;
let totalScore = 0;
let isLocked = false;

function loadQuestionView() {
  const current = AUDIT_QUESTIONS[qIdx];
  const total = AUDIT_QUESTIONS.length;
  isLocked = false;

  document.getElementById("qCounterText").textContent = `Question ${qIdx + 1}/${total}`;
  const pct = Math.round(((qIdx + 1) / total) * 100);
  const bar = document.getElementById("qProgressFill");
  bar.style.width = `${pct}%`;
  bar.parentElement.setAttribute("aria-valuenow", pct);

  document.getElementById("qTitleText").textContent = current.question;
  document.getElementById("answerHintText").textContent = "Choose A, B, C, or D to check your answer.";

  const nextBtn = document.getElementById("nextStepBtn");
  nextBtn.disabled = true;
  nextBtn.textContent = qIdx === total - 1 ? "Finish Assessment" : "Next Question →";

  const host = document.getElementById("choiceButtonsHost");
  host.innerHTML = "";

  current.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cc-choice-btn";
    btn.innerHTML = `
      <span class="cc-choice-badge">${opt.key}</span>
      <span class="cc-choice-label">${escapeHtml(opt.label)}</span>
    `;
    btn.onclick = () => evaluateChoice(idx, btn);
    host.appendChild(btn);
  });
}

function evaluateChoice(chosenIdx, btnEl) {
  if (isLocked) return;
  isLocked = true;

  const current = AUDIT_QUESTIONS[qIdx];
  const buttons = document.querySelectorAll(".cc-choice-btn");
  buttons.forEach(b => (b.disabled = true));

  if (chosenIdx === current.answerIdx) {
    btnEl.classList.add("correct-choice");
    totalScore += 100;
    document.getElementById("liveScoreText").textContent = totalScore;
    document.getElementById("answerHintText").textContent = `Correct (+100)! ${current.note}`;
  } else {
    btnEl.classList.add("wrong-choice");
    buttons[current.answerIdx].classList.add("correct-choice");
    document.getElementById("answerHintText").textContent = `Incorrect. ${current.note}`;
  }

  document.getElementById("nextStepBtn").disabled = false;
}

function goNextQuestion() {
  if (qIdx < AUDIT_QUESTIONS.length - 1) {
    qIdx++;
    loadQuestionView();
  } else {
    document.getElementById("activeQuestionPane").hidden = true;
    const resPane = document.getElementById("quizResultPane");
    resPane.hidden = false;
    document.getElementById("finalPointsOut").textContent = totalScore;

    const verdict = document.getElementById("verdictSummaryText");
    if (totalScore >= 400) {
      verdict.textContent = "Net-Zero Leader: Strong mastery of Scope 1–3 carbon tracking. Ready for verified Blue Carbon & Solar PPA retirement.";
    } else if (totalScore >= 200) {
      verdict.textContent = "Emerging Decarbonizer: Solid foundation. Begin with a Scope 2 grid audit and LED/HVAC efficiency upgrades.";
    } else {
      verdict.textContent = "Baseline Starter: Start by quantifying monthly electricity & fleet CO₂e in the tracker below.";
    }
  }
}

function resetQuizFlow() {
  qIdx = 0;
  totalScore = 0;
  document.getElementById("liveScoreText").textContent = "0";
  document.getElementById("quizResultPane").hidden = true;
  document.getElementById("activeQuestionPane").hidden = false;
  loadQuestionView();
}

function saveQuizActionToList() {
  reductionTasks.unshift({
    id: Date.now(),
    text: `Execute CARBONCUT Audit Roadmap (Readiness Score: ${totalScore}/500)`,
    done: false
  });
  saveTaskStorage();
  renderTaskList();
  document.getElementById("reduction-tasks").scrollIntoView({ behavior: "smooth" });
}

// Carbon Footprint Calculator
function recalcEmissions() {
  const kwh = Number(document.getElementById("powerSlider").value);
  const km = Number(document.getElementById("fleetSlider").value);
  const ops = Number(document.getElementById("opsTierSelect").value);

  document.getElementById("powerValLabel").textContent = kwh;
  document.getElementById("fleetValLabel").textContent = km;

  const monthly = Math.round((kwh * 0.72) + (km * 4.33 * 0.21) + ops);
  const annual = ((monthly * 12) / 1000).toFixed(2);

  document.getElementById("monthlyKgVal").textContent = monthly;
  document.getElementById("annualTonnesVal").textContent = annual;

  const chip = document.getElementById("adviceChip");
  if (monthly < 450) {
    chip.textContent = "Low Footprint — Aligned with 1.5°C Net-Zero pathway";
  } else if (monthly <= 750) {
    chip.textContent = "Moderate — 22% reduction achievable via Solar PPA";
  } else {
    chip.textContent = "High Impact — Immediate energy & fleet electrification advised";
  }
}

// CRUD Action Checklist
const INITIAL_TASKS = [
  { id: 1, text: "Complete 5-question CARBONCUT Scope 1–3 readiness quiz", done: true },
  { id: 2, text: "Transition 50% facility electricity to verified Solar PPA", done: false },
  { id: 3, text: "Retire 3.5 tonnes CO₂e via Coastal Mangrove restoration", done: false }
];

let reductionTasks = JSON.parse(localStorage.getItem("carboncut_readiness_v2_tasks")) || [...INITIAL_TASKS];

function saveTaskStorage() {
  localStorage.setItem("carboncut_readiness_v2_tasks", JSON.stringify(reductionTasks));
}

// READ
function renderTaskList() {
  const ul = document.getElementById("taskUlHost");
  const label = document.getElementById("crudCountLabel");
  ul.innerHTML = "";

  const doneCount = reductionTasks.filter(t => t.done).length;
  label.textContent = `${doneCount} of ${reductionTasks.length} reduction tasks completed`;

  if (reductionTasks.length === 0) {
    ul.innerHTML = `<li class="cc-task-row"><span>No reduction tasks yet. Add one above!</span></li>`;
    return;
  }

  reductionTasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = "cc-task-row";
    li.innerHTML = `
      <div class="cc-task-left">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${idx})" />
        <span class="${task.done ? "cc-done" : ""}">${escapeHtml(task.text)}</span>
      </div>
      <div class="cc-row-actions">
        <button type="button" class="cc-mini-btn" onclick="editTask(${idx})">Edit</button>
        <button type="button" class="cc-mini-btn del" onclick="deleteTask(${idx})">Delete</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

// CREATE (onclick="addTask()")
function addTask() {
  const box = document.getElementById("newTaskBox");
  const text = box.value.trim();
  if (!text) {
    box.focus();
    return;
  }
  reductionTasks.unshift({ id: Date.now(), text, done: false });
  box.value = "";
  saveTaskStorage();
  renderTaskList();
}

// UPDATE
function toggleTask(idx) {
  reductionTasks[idx].done = !reductionTasks[idx].done;
  saveTaskStorage();
  renderTaskList();
}

function editTask(idx) {
  const updated = prompt("Edit carbon reduction task:", reductionTasks[idx].text);
  if (updated !== null && updated.trim() !== "") {
    reductionTasks[idx].text = updated.trim();
    saveTaskStorage();
    renderTaskList();
  }
}

// DELETE
function deleteTask(idx) {
  reductionTasks.splice(idx, 1);
  saveTaskStorage();
  renderTaskList();
}

function restoreDefaultTasks() {
  reductionTasks = [...INITIAL_TASKS];
  saveTaskStorage();
  renderTaskList();
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

document.getElementById("newTaskBox").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

loadQuestionView();
recalcEmissions();
renderTaskList();
