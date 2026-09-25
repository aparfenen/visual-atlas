const state = {
  data: [],
  kind: "all",
  query: ""
};

const grid = document.querySelector("#atlas-grid");
const filters = document.querySelector("#kind-filters");
const search = document.querySelector("#search-input");
const empty = document.querySelector("#empty-state");
const dialog = document.querySelector("#object-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector("#dialog-close");

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[ch]));

const prettyKind = kind =>
  kind.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

function searchable(object) {
  return [
    object.id,
    object.title,
    object.kind,
    object.summary,
    object.visualQuestion,
    object.observation,
    ...(object.materials || []),
    ...(object.tags || [])
  ].filter(Boolean).join(" ").toLowerCase();
}

function visibleObjects() {
  return state.data.filter(object => {
    const kindMatch = state.kind === "all" || object.kind === state.kind;
    const queryMatch = !state.query || searchable(object).includes(state.query);
    return kindMatch && queryMatch;
  });
}

function renderFilters() {
  const kinds = ["all", ...new Set(state.data.map(o => o.kind))];
  filters.innerHTML = kinds.map(kind => `
    <button
      class="filter-button"
      data-kind="${escapeHtml(kind)}"
      aria-pressed="${state.kind === kind}"
    >${kind === "all" ? "All" : prettyKind(kind)}</button>
  `).join("");

  filters.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      state.kind = button.dataset.kind;
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const objects = visibleObjects();

  grid.innerHTML = objects.map(object => `
    <button class="card" data-id="${escapeHtml(object.id)}">
      <div class="card-top">
        <div>
          <p class="card-kind">${escapeHtml(prettyKind(object.kind))}</p>
          <h2 class="card-title">${escapeHtml(object.title)}</h2>
        </div>
        <span class="card-id">${escapeHtml(object.id)}</span>
      </div>

      <p class="card-summary">${escapeHtml(object.summary || "")}</p>

      ${object.visualQuestion ? `
        <p class="card-question">${escapeHtml(object.visualQuestion)}</p>
      ` : ""}

      <span class="status">${escapeHtml(object.status)}</span>
    </button>
  `).join("");

  empty.hidden = objects.length !== 0;

  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openObject(card.dataset.id));
  });
}

function field(label, value) {
  if (value === null || value === undefined || value === "" ||
      (Array.isArray(value) && value.length === 0)) return "";

  const content = Array.isArray(value)
    ? `<div class="tag-list">${value.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>`
    : `<p class="field-value">${escapeHtml(value)}</p>`;

  return `
    <div class="field">
      <span class="field-label">${escapeHtml(label)}</span>
      ${content}
    </div>
  `;
}

function openObject(id) {
  const object = state.data.find(item => item.id === id);
  if (!object) return;

  const source = object.source?.label
    ? object.source.url
      ? `<a href="${escapeHtml(object.source.url)}" target="_blank" rel="noreferrer">${escapeHtml(object.source.label)}</a>`
      : escapeHtml(object.source.label)
    : null;

  dialogContent.innerHTML = `
    <article class="dialog-body">
      <p class="card-kind">${escapeHtml(prettyKind(object.kind))} · ${escapeHtml(object.id)}</p>
      <h2>${escapeHtml(object.title)}</h2>
      ${field("Date", object.date)}
      ${field("Status", object.status)}
      ${field("Summary", object.summary)}
      ${field("Visual question", object.visualQuestion)}
      ${field("Observation", object.observation)}
      ${field("Materials", object.materials)}
      ${field("Tags", object.tags)}
      ${source ? `
        <div class="field">
          <span class="field-label">Source</span>
          <p class="field-value">${source}</p>
        </div>
      ` : ""}
      ${field("Related", object.relations)}
      ${object.demo ? field("Record", "Demo object — replace with a real atlas entry.") : ""}
    </article>
  `;

  dialog.showModal();
}

search.addEventListener("input", event => {
  state.query = event.target.value.trim().toLowerCase();
  renderGrid();
});

dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

async function init() {
  try {
    const response = await fetch("data/atlas.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();

    state.data = payload.objects || [];
    document.querySelector("#object-count").textContent =
      `${state.data.length} ${state.data.length === 1 ? "object" : "objects"}`;
    document.querySelector("#public-count").textContent =
      `${state.data.filter(o => o.public).length} public`;

    renderFilters();
    renderGrid();
  } catch (error) {
    grid.innerHTML = `
      <p class="empty-state">
        Could not load <code>data/atlas.json</code>. Run this project through a small local web server rather than opening the HTML file directly.
      </p>
    `;
    console.error(error);
  }
}

init();
