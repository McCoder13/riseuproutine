const morningTasks = [
  {
    title: "Prayer",
    description: "Start grounded before touching the rest of the dashboard.",
    minutes: "5 min"
  },
  {
    title: "Bible / quiet time",
    description: "Read, reflect, and keep the phone from taking over the first minutes.",
    minutes: "10 min"
  },
  {
    title: "Make bed",
    description: "Create one quick visible win before leaving the room.",
    minutes: "3 min"
  },
  {
    title: "Brush teeth",
    description: "Move through the basic hygiene step without checking feeds.",
    minutes: "4 min"
  },
  {
    title: "Get dressed",
    description: "Put on the clothes already chosen or pick the simplest clean option.",
    minutes: "8 min"
  },
  {
    title: "Check calendar",
    description: "Look only for fixed commitments, travel buffers, and first meeting time.",
    minutes: "3 min"
  },
  {
    title: "Review top priorities",
    description: "Choose the three outcomes that make today feel handled.",
    minutes: "5 min"
  },
  {
    title: "Start audio",
    description: "Open the morning playlist or podcast with a tap you control.",
    minutes: "1 min"
  }
];

const eveningTasks = [
  {
    title: "Review tomorrow",
    description: "Check tomorrow's calendar and identify anything that needs setup tonight.",
    minutes: "4 min"
  },
  {
    title: "Choose wake time",
    description: "Pick a realistic wake time based on the first commitment.",
    minutes: "2 min"
  },
  {
    title: "Set iPhone alarm",
    description: "Use the Clock app for the real alarm. This site only stores the reminder.",
    minutes: "2 min"
  },
  {
    title: "Pack essentials",
    description: "Set out anything needed for the morning or first trip out.",
    minutes: "5 min"
  },
  {
    title: "Pick clothes",
    description: "Remove one morning decision by choosing clothes tonight.",
    minutes: "3 min"
  },
  {
    title: "Reset room",
    description: "Clear the surface-level mess that would slow down tomorrow.",
    minutes: "6 min"
  },
  {
    title: "Prayer / journal",
    description: "Close the day with a short review and a clear stopping point.",
    minutes: "6 min"
  },
  {
    title: "Get ready for bed",
    description: "Finish the final steps and let the phone wind down too.",
    minutes: "8 min"
  }
];

const state = {
  routineKind: "morning",
  taskIndex: 0,
  isTransitioning: false,
  isTaskTransitioning: false
};

const storageKeys = {
  notes: "morningFlow.notes",
  wakeTime: "morningFlow.wakeTime",
  morningDone: "morningFlow.morningDone",
  eveningDone: "morningFlow.eveningDone"
};

const fontPairClasses = [
  "font-fraunces-space",
  "font-dm-space-mono",
  "font-bricolage-space",
  "font-fredoka-space-mono",
  "font-baloo-space"
];

const elements = {
  clockText: document.querySelector("#clockText"),
  cloudLayer: document.querySelector("#cloudLayer"),
  launchDate: document.querySelector("#launchDate"),
  launchTitle: document.querySelector("#launchTitle"),
  beginMorningButton: document.querySelector("#beginMorningButton"),
  routineView: document.querySelector("#routineView"),
  routineKindLabel: document.querySelector("#routineKindLabel"),
  progressText: document.querySelector("#progressText"),
  progressFill: document.querySelector("#progressFill"),
  taskTime: document.querySelector("#taskTime"),
  routineTitle: document.querySelector("#routineTitle"),
  taskDescription: document.querySelector("#taskDescription"),
  skipTaskButton: document.querySelector("#skipTaskButton"),
  completeTaskButton: document.querySelector("#completeTaskButton"),
  completionCopy: document.querySelector("#completionCopy"),
  finishRoutineButton: document.querySelector("#finishRoutineButton"),
  dashboardMode: document.querySelector("#dashboardMode"),
  dashboardSummary: document.querySelector("#dashboardSummary"),
  countdownText: document.querySelector("#countdownText"),
  notesInput: document.querySelector("#notesInput"),
  wakeForm: document.querySelector("#wakeForm"),
  wakeTimeInput: document.querySelector("#wakeTimeInput"),
  alarmReminder: document.querySelector("#alarmReminder"),
  openWakeButton: document.querySelector("#openWakeButton"),
  backToDashboardButton: document.querySelector("#backToDashboardButton"),
  resetDayButton: document.querySelector("#resetDayButton"),
  spotifyButton: document.querySelector("#spotifyButton"),
  views: Array.from(document.querySelectorAll(".view"))
};

const cloudDepths = [
  { layer: "near", scale: 1.2, width: 128, duration: 46, opacity: 0.92, blur: 0, topMin: 18, topMax: 42 },
  { layer: "mid", scale: 0.9, width: 106, duration: 58, opacity: 0.82, blur: 0.2, topMin: 14, topMax: 38 },
  { layer: "far", scale: 0.68, width: 88, duration: 72, opacity: 0.68, blur: 0.4, topMin: 10, topMax: 32 }
];

let nextCloudTimer;

function getMode(now = new Date()) {
  const hour = now.getHours();

  if (hour < 5) return "Night / Tomorrow Prep";
  if (hour < 10) return localStorage.getItem(storageKeys.morningDone) ? "Morning Dashboard" : "Morning Launch";
  if (hour < 13) return "Midday Dashboard";
  if (hour < 17) return "Afternoon Dashboard";
  if (hour < 21) return "Daily Dashboard";
  return "Night / Tomorrow Prep";
}

function formatClock(now = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);
}

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  const lastDigit = day % 10;

  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";
  return "th";
}

function formatLaunchDate(now = new Date()) {
  const month = new Intl.DateTimeFormat(undefined, { month: "long" }).format(now);
  const day = now.getDate();
  const year = now.getFullYear();

  return [`${month} ${day}${getDaySuffix(day)}`, `${year}`];
}

function updateSceneMode(now = new Date()) {
  document.body.classList.remove("is-night");
}

function applyFontPair(pair) {
  const selectedPair = pair || "bricolage-space";
  document.body.classList.remove(...fontPairClasses);
  document.body.classList.add(`font-${selectedPair}`);
}

function getRandomNumber(min, max) {
  return min + Math.random() * (max - min);
}

function createCloud(startProgress = 0) {
  const depth = cloudDepths[Math.floor(Math.random() * cloudDepths.length)];
  const cloud = document.createElement("span");
  const duration = getRandomNumber(depth.duration - 7, depth.duration + 7);

  cloud.className = `cloud cloud-${depth.layer}`;
  cloud.style.setProperty("--cloud-top", `${getRandomNumber(depth.topMin, depth.topMax).toFixed(1)}%`);
  cloud.style.setProperty("--cloud-width", `${getRandomNumber(depth.width - 14, depth.width + 18).toFixed(0)}px`);
  cloud.style.setProperty("--cloud-scale", getRandomNumber(depth.scale - 0.08, depth.scale + 0.08).toFixed(2));
  cloud.style.setProperty("--cloud-duration", `${duration.toFixed(1)}s`);
  cloud.style.setProperty("--cloud-opacity", getRandomNumber(depth.opacity - 0.08, depth.opacity + 0.05).toFixed(2));
  cloud.style.setProperty("--cloud-blur", `${depth.blur}px`);
  cloud.style.animationDelay = startProgress ? `${(-duration * startProgress).toFixed(1)}s` : "0s";
  cloud.addEventListener("animationend", () => cloud.remove(), { once: true });

  elements.cloudLayer.append(cloud);
}

function scheduleNextCloud() {
  window.clearTimeout(nextCloudTimer);
  nextCloudTimer = window.setTimeout(() => {
    createCloud();
    scheduleNextCloud();
  }, getRandomNumber(9000, 15000));
}

function startClouds() {
  [0.02, 0.28, 0.56, 0.82].forEach((progress) => createCloud(progress));
  scheduleNextCloud();
}

function setActiveView(viewId) {
  const morningComplete = Boolean(localStorage.getItem(storageKeys.morningDone));
  const gatedViews = ["dashboardView", "wakeView"];
  const nextViewId = gatedViews.includes(viewId) && !morningComplete ? "launchView" : viewId;

  document.body.classList.toggle("is-launch-view", nextViewId === "launchView");
  elements.views.forEach((view) => {
    view.classList.toggle("is-active", view.id === nextViewId);
  });
}

function playRoutineIntro() {
  elements.routineView.classList.remove("routine-entering");
  requestAnimationFrame(() => {
    elements.routineView.classList.add("routine-entering");
    window.setTimeout(() => {
      elements.routineView.classList.remove("routine-entering");
    }, 1100);
  });
}

function updateTimeUI() {
  const now = new Date();
  const mode = getMode(now);

  updateSceneMode(now);
  elements.clockText.textContent = formatClock(now);
  const [dateLine, yearLine] = formatLaunchDate(now);
  elements.launchDate.replaceChildren(
    Object.assign(document.createElement("span"), { textContent: dateLine }),
    Object.assign(document.createElement("span"), { textContent: yearLine })
  );
  elements.dashboardMode.textContent = mode.includes("Dashboard") ? mode : "Daily Dashboard";

  if (mode === "Night / Tomorrow Prep") {
    elements.dashboardSummary.textContent = "Keep tomorrow simple: wake time, alarm, and essentials ready.";
  } else if (mode === "Afternoon Dashboard") {
    elements.dashboardSummary.textContent = "Use the afternoon view to protect the remaining priority work.";
  } else if (mode === "Midday Dashboard") {
    elements.dashboardSummary.textContent = "Check commitments and adjust without losing the day to admin.";
  } else {
    elements.dashboardSummary.textContent = "Keep the next move visible without turning the morning into inbox time.";
  }

  const wakeTime = localStorage.getItem(storageKeys.wakeTime);
  elements.countdownText.textContent = wakeTime ? `Wake target ${wakeTime}` : "No event loaded";
}

function getActiveTasks() {
  return state.routineKind === "evening" ? eveningTasks : morningTasks;
}

function renderTask() {
  const tasks = getActiveTasks();
  const task = tasks[state.taskIndex];
  const progress = ((state.taskIndex + 1) / tasks.length) * 100;

  elements.routineKindLabel.textContent = state.routineKind === "evening" ? "Evening Routine" : "Morning Routine";
  elements.progressText.textContent = `${state.taskIndex + 1} of ${tasks.length}`;
  elements.progressFill.style.width = `${progress}%`;
  elements.taskTime.textContent = task.minutes;
  elements.routineTitle.textContent = task.title;
  elements.taskDescription.textContent = task.description;
}

function startRoutine(kind) {
  if (state.isTransitioning) return;
  state.isTransitioning = true;
  state.routineKind = kind;
  state.taskIndex = 0;
  renderTask();

  document.body.classList.add("launch-transitioning");
  window.setTimeout(() => {
    setActiveView("routineView");
    playRoutineIntro();
    document.body.classList.remove("launch-transitioning");
    state.isTransitioning = false;
  }, 620);
}

function advanceTask() {
  if (state.isTaskTransitioning) return;
  const tasks = getActiveTasks();
  const nextTaskIndex = state.taskIndex + 1;

  if (nextTaskIndex >= tasks.length) {
    const key = state.routineKind === "evening" ? storageKeys.eveningDone : storageKeys.morningDone;
    localStorage.setItem(key, new Date().toISOString());
    elements.completionCopy.textContent = state.routineKind === "evening"
      ? "Tomorrow has a clearer runway. Finish by setting the real iPhone alarm."
      : "You are set for the next part of the day.";
    setActiveView(state.routineKind === "evening" ? "wakeView" : "completionView");
    updateTimeUI();
    return;
  }

  state.isTaskTransitioning = true;
  elements.routineView.classList.remove("task-transition-entering");
  elements.routineView.classList.add("task-transitioning");

  window.setTimeout(() => {
    state.taskIndex = nextTaskIndex;
    renderTask();
    elements.routineView.classList.remove("task-transitioning");
    elements.routineView.classList.add("task-transition-entering");

    window.setTimeout(() => {
      elements.routineView.classList.remove("task-transition-entering");
      state.isTaskTransitioning = false;
    }, 520);
  }, 310);
}

function saveWakeTime(event) {
  event.preventDefault();
  const wakeTime = elements.wakeTimeInput.value;
  localStorage.setItem(storageKeys.wakeTime, wakeTime);
  elements.alarmReminder.textContent = `Saved ${wakeTime}. Now set the matching iPhone alarm in the Clock app.`;
  updateTimeUI();
}

function resetRoutineProgress() {
  localStorage.removeItem(storageKeys.morningDone);
  localStorage.removeItem(storageKeys.eveningDone);
  state.taskIndex = 0;
  updateTimeUI();
  setActiveView("launchView");
}

function restoreLocalData() {
  elements.notesInput.value = localStorage.getItem(storageKeys.notes) || "";
  elements.wakeTimeInput.value = localStorage.getItem(storageKeys.wakeTime) || "06:30";
  applyFontPair();
}

function wireEvents() {
  elements.beginMorningButton.addEventListener("click", () => startRoutine("morning"));
  elements.skipTaskButton.addEventListener("click", advanceTask);
  elements.completeTaskButton.addEventListener("click", advanceTask);
  elements.finishRoutineButton.addEventListener("click", () => setActiveView("dashboardView"));
  elements.wakeForm.addEventListener("submit", saveWakeTime);
  elements.openWakeButton.addEventListener("click", () => setActiveView("wakeView"));
  elements.backToDashboardButton.addEventListener("click", () => setActiveView("dashboardView"));
  elements.resetDayButton.addEventListener("click", resetRoutineProgress);
  elements.spotifyButton.addEventListener("click", () => {
    window.location.href = "https://open.spotify.com/";
  });
  elements.notesInput.addEventListener("input", () => {
    localStorage.setItem(storageKeys.notes, elements.notesInput.value);
  });
}

function boot() {
  restoreLocalData();
  wireEvents();
  startClouds();
  updateTimeUI();
  setInterval(updateTimeUI, 1000);

  if (localStorage.getItem(storageKeys.morningDone)) {
    setActiveView("dashboardView");
  } else {
    setActiveView("launchView");
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

boot();
