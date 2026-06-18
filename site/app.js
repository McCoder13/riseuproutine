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
  taskIndex: 0
};

const storageKeys = {
  notes: "morningFlow.notes",
  wakeTime: "morningFlow.wakeTime",
  morningDone: "morningFlow.morningDone",
  eveningDone: "morningFlow.eveningDone"
};

const elements = {
  clockText: document.querySelector("#clockText"),
  focusLine: document.querySelector("#focusLine"),
  launchTitle: document.querySelector("#launchTitle"),
  beginMorningButton: document.querySelector("#beginMorningButton"),
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

function updateSceneMode(now = new Date()) {
  const hour = now.getHours();
  const isNight = hour >= 20 || hour < 5;
  document.body.classList.toggle("is-night", isNight);
}

function setActiveView(viewId) {
  const morningComplete = Boolean(localStorage.getItem(storageKeys.morningDone));
  const gatedViews = ["dashboardView", "wakeView"];
  const nextViewId = gatedViews.includes(viewId) && !morningComplete ? "launchView" : viewId;

  elements.views.forEach((view) => {
    view.classList.toggle("is-active", view.id === nextViewId);
  });
}

function updateTimeUI() {
  const now = new Date();
  const mode = getMode(now);

  updateSceneMode(now);
  elements.clockText.textContent = formatClock(now);
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
  elements.focusLine.textContent = "Start with quiet, then move one step at a time.";
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
  state.routineKind = kind;
  state.taskIndex = 0;
  renderTask();
  setActiveView("routineView");
}

function advanceTask() {
  const tasks = getActiveTasks();
  state.taskIndex += 1;

  if (state.taskIndex >= tasks.length) {
    const key = state.routineKind === "evening" ? storageKeys.eveningDone : storageKeys.morningDone;
    localStorage.setItem(key, new Date().toISOString());
    elements.completionCopy.textContent = state.routineKind === "evening"
      ? "Tomorrow has a clearer runway. Finish by setting the real iPhone alarm."
      : "You are set for the next part of the day.";
    setActiveView(state.routineKind === "evening" ? "wakeView" : "completionView");
    updateTimeUI();
    return;
  }

  renderTask();
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
