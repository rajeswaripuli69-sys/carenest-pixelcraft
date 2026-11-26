document.body.insertAdjacentHTML(
  "afterbegin",
  '<div style="background:#d1fae5;color:#065f46;padding:15px;text-align:center;font-weight:bold">CareNest JavaScript is EXECUTING</div>'
);
const STORAGE_KEY = "carenest_pixelcraft_v1";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const dateKey = () => new Date().toISOString().slice(0, 10);
const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const starterData = {
  medicines: [
    { id: "m1", name: "Vitamin D3", dose: "1 tablet", time: "Morning", instructions: "After breakfast", person: "Amma", active: true },
    { id: "m2", name: "Calcium", dose: "1 tablet", time: "Afternoon", instructions: "After lunch", person: "Amma", active: true },
    { id: "m3", name: "Daily supplement", dose: "1 capsule", time: "Night", instructions: "After dinner", person: "Amma", active: true }
  ],
  reports: [],
  taken: {},
  profile: { parentName: "Amma" }
};

let state = loadState();
let activePage = "home";
let activeFilter = "All";
let toastTimer;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return JSON.parse(JSON.stringify(starterData));
    const parsed = JSON.parse(saved);
    return { ...JSON.parse(JSON.stringify(starterData)), ...parsed };
  } catch (error) {
    console.warn("CareNest data could not be loaded:", error);
    return JSON.parse(JSON.stringify(starterData));
  }
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    showToast("Storage is full. Remove an uploaded report and try again.");
    console.error(error);
    return false;
  }
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function isTaken(id) {
  return Boolean(state.taken[dateKey()]?.[id]);
}
function markTaken(id) {
  state.taken[dateKey()] ||= {};
  state.taken[dateKey()][id] = !state.taken[dateKey()][id];
  saveState();
  render();
  showToast(state.taken[dateKey()][id] ? "Dose marked as taken." : "Dose status changed.");
}
function medicineCard(medicine, large = false) {
  const done = isTaken(medicine.id);
  return `<article class="${large ? "parent-dose" : "medicine-card"}">
    ${large ? '<span class="dose-emoji">♡</span>' : '<span class="medicine-symbol">✚</span>'}
    <div class="medicine-info">
      <strong>${escapeHTML(medicine.name)}</strong>
      <p>${escapeHTML(medicine.dose)} · ${escapeHTML(medicine.instructions || "As directed")}</p>
      ${large ? `<p>${escapeHTML(medicine.time)} · For ${escapeHTML(medicine.person)}</p>` : ""}
    </div>
    ${large ? "" : `<span class="time-label">${escapeHTML(medicine.time)}</span>`}
    <button class="taken-button ${done ? "done" : ""}" data-taken="${escapeHTML(medicine.id)}">${done ? "✓ Taken" : "Mark taken"}</button>
  </article>`;
}
function reportCard(report, compact = false) {
  return `<article class="report-card">
    <span class="report-symbol">▤</span>
    <div class="report-info">
      <strong>${escapeHTML(report.title)}</strong>
      <p>${escapeHTML(report.category)} · ${escapeHTML(report.date)}</p>
      <p>${escapeHTML(report.fileName)}</p>
    </div>
    <div class="report-actions">
      <button class="small-action" data-view-report="${escapeHTML(report.id)}">View</button>
      <button class="small-action" data-delete-report="${escapeHTML(report.id)}">Delete</button>
    </div>
  </article>`;
}
function updateDashboard() {
  const medicines = state.medicines.filter(m => m.active);
  const countTaken = medicines.filter(m => isTaken(m.id)).length;
  $("#medicineCount").textContent = medicines.length;
  $("#todayTaken").textContent = `${countTaken}/${medicines.length}`;
  $("#reportCount").textContent = state.reports.length;
  $("#todayMedicineList").innerHTML = medicines.length
    ? medicines.slice(0, 3).map(m => medicineCard(m)).join("")
    : `<div class="empty-state"><strong>No medicines added yet</strong>Add a medicine to start tracking the daily schedule.</div>`;
  $("#recentReports").innerHTML = state.reports.length
    ? state.reports.slice().sort((a,b) => b.createdAt - a.createdAt).slice(0,2).map(r => reportCard(r, true)).join("")
    : `<div class="empty-state"><strong>No reports uploaded</strong>Your family's medical documents will appear here.</div>`;
  $("#dateChip").textContent = new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short" });
  $("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" }).toUpperCase();
}
function pageHeader(kicker, title, subtitle) {
  return `<p class="eyebrow">${kicker}</p><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p>`;
}
function renderMedicines() {
  const medicines = state.medicines.filter(m => m.active);
  return `${pageHeader("DAILY CARE", "Medicines", "Keep the daily medicine schedule organized. Always follow the prescription provided by the healthcare professional.")}
    <div class="page-toolbar"><strong>${medicines.length} active medicines</strong><button class="button primary" id="addMedicinePage">＋ Add medicine</button></div>
    <div class="filter-row">${["All","Morning","Afternoon","Evening","Night"].map(f => `<button class="filter-chip ${activeFilter===f?"active":""}" data-filter="${f}">${f}</button>`).join("")}</div>
    <div class="medicine-list" id="allMedicineList">${medicines.filter(m => activeFilter==="All" || m.time===activeFilter).map(m => medicineCard(m)).join("") || `<div class="empty-state"><strong>No medicines in this time slot</strong>Choose another filter or add a medicine.</div>`}</div>
    <p class="accessibility-note">CareNest is an organizer, not a medical adviser. Confirm medicine names, dosage and timing with the parent's clinician or pharmacist.</p>`;
}
function renderRecords() {
  const reports = state.reports.slice().sort((a,b) => b.date.localeCompare(a.date));
  return `${pageHeader("FAMILY FILES", "Health records", "Keep important reports together so your family can find them when needed.")}
    <div class="page-toolbar"><strong>${reports.length} saved documents</strong><button class="button primary" id="addReportPage">＋ Upload report</button></div>
    <input class="search-input" id="reportSearch" type="search" placeholder="Search reports by title or category..." aria-label="Search reports">
    <div class="record-grid" id="allReports">${reports.map(r => reportCard(r)).join("") || `<div class="empty-state"><strong>Your report space is ready</strong>Upload a PDF or image (up to 1 MB) to add the first report.</div>`}</div>
    <p class="accessibility-note">Files are stored only in this browser using LocalStorage. This demo does not provide cloud backup or secure medical-record hosting. Avoid uploading sensitive real medical documents to this prototype.</p>`;
}
function renderParent() {
  const medicines = state.medicines.filter(m => m.active);
 return `${pageHeader("A SIMPLER VIEW", "Hello, " + escapeHTML(state.profile.parentName || "Amma"), "A clear, easy-to-read view of today's medicines.")} 
    <div class="parent-panel"><span class="banner-tag">YOUR DAILY HEALTH ROUTINE</span><h2>One step at a time.</h2><p>Check each medicine after taking it. If you are unsure, ask your family member or healthcare professional.</p></div>
    <div class="page-toolbar"><strong style="font-size:16px">Today's medicines</strong><span class="date-chip">${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span></div>
    <div class="parent-big-list">${medicines.map(m => medicineCard(m,true)).join("") || `<div class="empty-state"><strong>No medicines added</strong>Your family member can add the schedule.</div>`}</div>
    <p class="accessibility-note">Large text and simple actions are enabled in Parent Mode. Tap “Exit parent mode” below to return to the family dashboard.</p>
    <button class="button secondary" id="exitParentMode" style="width:100%;margin-top:12px">Exit parent mode</button>`;
}
function render() {
  if (activePage === "home") {
    $("#appMain").classList.remove("hidden");
    $("#pageMain").classList.add("hidden");
    updateDashboard();
  } else {
    $("#appMain").classList.add("hidden");
    $("#pageMain").classList.remove("hidden");
    $("#pageMain").innerHTML = activePage === "medicines" ? renderMedicines()
      : activePage === "records" ? renderRecords() : renderParent();
  }
  $$(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.nav === activePage));
  document.body.classList.toggle("large-mode", activePage === "parent");
}
function navigate(page) {
  activePage = page;
  activeFilter = "All";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function openDialog(id) {
  const dialog = document.getElementById(id);
  if (id === "reportDialog") $("#reportForm [name=date]").value = dateKey();
  dialog.showModal();
}
function addMedicine(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  if (!name) return showToast("Please enter a medicine name.");
  state.medicines.unshift({
    id: makeId(), name, dose: String(data.get("dose")).trim(),
    time: String(data.get("time")), instructions: String(data.get("instructions")).trim(),
    person: String(data.get("person")).trim() || "Parent", active: true
  });
  if (saveState()) {
    form.reset();
    $("#medicineDialog").close();
    render();
    showToast("Medicine added to the schedule.");
  }
}
function addReport(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const file = data.get("file");
  if (!(file instanceof File) || !file.size) return showToast("Please choose a PDF or image.");
  if (file.size > 1024 * 1024) return showToast("Please choose a file smaller than 1 MB.");
  const reader = new FileReader();
  reader.onload = () => {
    const report = {
      id: makeId(), title: String(data.get("title")).trim(),
      category: String(data.get("category")), date: String(data.get("date")),
      fileName: file.name, mimeType: file.type || "application/octet-stream",
      dataUrl: reader.result, createdAt: Date.now()
    };
    state.reports.unshift(report);
    if (saveState()) {
      form.reset();
      $("#reportDialog").close();
      render();
      showToast("Report saved on this device.");
    }
  };
  reader.onerror = () => showToast("The selected file could not be read.");
  reader.readAsDataURL(file);
}
function viewReport(id) {
  const report = state.reports.find(r => r.id === id);
  if (!report) return showToast("Report not found.");
  const tab = window.open();
  if (!tab) return showToast("Allow pop-ups to preview this report.");
  const safeName = escapeHTML(report.fileName);
  tab.document.write(`<!doctype html><html><head><title>${safeName}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:16px Arial;padding:20px;color:#173b40}iframe,img{max-width:100%;max-height:85vh}a{color:#147d73}</style></head><body><h3>${escapeHTML(report.title)}</h3><p>${safeName}</p>${report.mimeType.startsWith("image/") ? `<img src="${report.dataUrl}" alt="${safeName}">` : `<p><a href="${report.dataUrl}" download="${safeName}">Download / open PDF</a></p><iframe title="PDF preview" src="${report.dataUrl}" width="100%" height="650"></iframe>`}</body></html>`);
  tab.document.close();
}
function deleteReport(id) {
  if (!confirm("Delete this report from this device?")) return;
  state.reports = state.reports.filter(r => r.id !== id);
  saveState(); render(); showToast("Report deleted.");
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-nav]");
  if (nav) return navigate(nav.dataset.nav);

  const taken = event.target.closest("[data-taken]");
  if (taken) return markTaken(taken.dataset.taken);

  const filter = event.target.closest("[data-filter]");
  if (filter) { activeFilter = filter.dataset.filter; render(); return; }

  const view = event.target.closest("[data-view-report]");
  if (view) return viewReport(view.dataset.viewReport);

  const remove = event.target.closest("[data-delete-report]");
  if (remove) return deleteReport(remove.dataset.deleteReport);

  const close = event.target.closest("[data-close]");
  if (close) return document.getElementById(close.dataset.close).close();
});

$("#parentModeButton").addEventListener("click", () => navigate("parent"));
$("#quickAddButton").addEventListener("click", () => openDialog("medicineDialog"));
$("#medicineForm").addEventListener("submit", addMedicine);
$("#reportForm").addEventListener("submit", addReport);
$("#pageMain").addEventListener("click", event => {
  if (event.target.closest("#addMedicinePage")) openDialog("medicineDialog");
  if (event.target.closest("#addReportPage")) openDialog("reportDialog");
  if (event.target.closest("#exitParentMode")) navigate("home");
});
$("#pageMain").addEventListener("input", event => {
  if (event.target.id !== "reportSearch") return;
  const query = event.target.value.toLowerCase().trim();
  const filtered = state.reports.filter(r => `${r.title} ${r.category} ${r.fileName}`.toLowerCase().includes(query));
  $("#allReports").innerHTML = filtered.map(r => reportCard(r)).join("") || `<div class="empty-state"><strong>No matching reports</strong>Try another search term.</div>`;
});
$("#profileButton").addEventListener("click", () => {
  const current = state.profile.parentName || "Amma";
  const next = prompt("Enter the parent's display name:", current);
  if (next === null) return;
  if (!next.trim()) return showToast("Name cannot be empty.");
  state.profile.parentName = next.trim().slice(0,40);
  saveState(); render(); showToast("Parent name updated.");
});

render();
