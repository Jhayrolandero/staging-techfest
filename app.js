const recordStore = {
  101: {
    owner: "guest",
    title: "Volunteer checklist",
    classification: "public",
    body: "Badge pickup starts at 08:30. Bring campus pass and challenge token.",
    payload: "Y2FjaGVfd2FybXVwX25vdGU=",
  },
  203: {
    owner: "guest",
    title: "Venue map delta",
    classification: "public",
    body: "South wing pods are renumbered. Use the corridor display for updates.",
    payload: "cG9kX3JlbWFwXzIwMjY=",
  },
  726: {
    owner: "staff",
    title: "Analyst retention packet",
    classification: "internal",
    body: "This packet was not linked from the UI but remains queryable by record id.",
    payload: "VEVDSEZFU1QyNntpZG9yX2lzX2p1c3RfdW5hdXRob3JpemVkX2xvb2t1cH0=",
  },
};

const adminProfiles = {
  attendee: {
    label: "Attendee",
    status: "Limited console access",
  },
  reviewer: {
    label: "Reviewer",
    status: "Can inspect submitted packets",
  },
  admin: {
    label: "Administrator",
    status: "Control plane unlocked",
    flag: "TECHFEST26{client_side_trust_is_not_auth}",
  },
};

function byId(id) {
  return document.getElementById(id);
}

function setText(node, text) {
  if (node) {
    node.textContent = text;
  }
}

function renderRecordPage() {
  const form = byId("record-form");
  const input = byId("record-id");
  const userNode = byId("active-user");
  const result = byId("record-result");
  if (!form || !input || !result) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const currentUser = params.get("user") || "guest";
  const requestedId = params.get("record") || "101";
  setText(userNode, currentUser);
  input.value = requestedId;

  function renderRecord(id) {
    const record = recordStore[id];
    if (!record) {
      result.innerHTML = `
        <strong>Record lookup failed</strong>
        <p class="muted">No packet exists for id ${id}.</p>
      `;
      return;
    }

    result.innerHTML = `
      <strong>${record.title}</strong>
      <p class="muted">${record.body}</p>
      <div class="pill-row" style="margin-top: 1rem">
        <span class="pill">owner: ${record.owner}</span>
        <span class="pill">classification: ${record.classification}</span>
        <span class="pill">viewer: ${currentUser}</span>
      </div>
      <div class="secret">${record.payload}</div>
    `;
  }

  renderRecord(requestedId);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = new URL(window.location.href);
    next.searchParams.set("user", currentUser);
    next.searchParams.set("record", input.value.trim());
    window.location.href = next.toString();
  });
}

function renderAdminPage() {
  const stateNode = byId("admin-state");
  const result = byId("admin-result");
  const form = byId("admin-form");
  const hintNode = byId("panel-trace");
  if (!stateNode || !result || !form) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || "attendee";
  const view = params.get("view") || "summary";
  const profile = adminProfiles[role] || adminProfiles.attendee;

  setText(stateNode, `${profile.label} | ${profile.status}`);
  if (hintNode) {
    hintNode.textContent = `view=${view} | role=${role}`;
  }

  if (role === "admin" && view === "control") {
    result.innerHTML = `
      <strong>Control plane</strong>
      <p class="muted">Administrative mode accepted. Review the recovered credential below.</p>
      <div class="secret">${profile.flag}</div>
    `;
  } else {
    result.innerHTML = `
      <strong>Restricted console</strong>
      <p class="muted">This panel only exposes summary telemetry for the current session.</p>
      <div class="pill-row" style="margin-top: 1rem">
        <span class="pill">role: ${role}</span>
        <span class="pill">view: ${view}</span>
      </div>
    `;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = new URL(window.location.href);
    next.searchParams.set("role", byId("role-input").value.trim() || "attendee");
    next.searchParams.set("view", byId("view-input").value.trim() || "summary");
    window.location.href = next.toString();
  });
}

renderRecordPage();
renderAdminPage();
