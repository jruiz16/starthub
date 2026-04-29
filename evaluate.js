/**
 * evaluate.js — Start-Hub 3X+ Platform
 * Módulo 1: Mi Evaluación  (individual JSON export)
 * Módulo 2: Consolidación  (multi-file import + consensus + CSV export)
 *
 * Data format for exported JSON:
 * {
 *   meta: { evaluator: string, role: string, exportedAt: ISO-string, version: "1.0" },
 *   evaluations: [
 *     {
 *       id: string,        // "PR-01"
 *       title: string,
 *       phase: string,     // "EXplorar+" | "EXpandir+" | "EXcalar+"
 *       area: string,
 *       priority: string,  // "Crítica" | "Alta" | "Media-Alta" | "Media"
 *       modified: boolean  // true if user changed from original
 *     },
 *     …
 *   ]
 * }
 */

'use strict';

// ─── Constants ──────────────────────────────────────────────────────────────

const PHASES    = ['EXplorar+', 'EXpandir+', 'EXcalar+'];
const AREAS     = [
  'Planeación Estratégica', 'Operaciones Digitales', 'Branding y Relaciones',
  'Marketing de Producto', 'Fidelización y CRM', 'Estrategia Corporativa',
  'Marketing de Resultados', 'Inteligencia de Negocios', 'Innovación Tecnológica',
  'Gestión Operativa', 'Revenue Management', 'Identidad Visual',
  'Estrategia de Marca', 'Arquitectura Digital', 'Diseño de Producto',
  'Gestión de Activos', 'Auditoría y Riesgos', 'Comercio Exterior',
  'Crecimiento y Conversión', 'Eficiencia Operativa', 'Logística e Importaciones'
];
const PRIORITIES = ['Crítica', 'Alta', 'Media-Alta', 'Media'];

// ─── Helper: phase / priority CSS class ─────────────────────────────────────

function phaseClass(p)    { return p==='EXplorar+'?'explorar':p==='EXpandir+'?'expandir':'excalar'; }
function priorityClass(p) { return p==='Crítica'?'critica':p==='Alta'?'alta':p==='Media-Alta'?'media-alta':'media'; }

function buildOptions(list, selected) {
  return list.map(v =>
    `<option value="${v}"${v===selected?' selected':''}>${v}</option>`
  ).join('');
}

// ─── Module 1 state ─────────────────────────────────────────────────────────

/**
 * evalState: Map<serviceId, { phase, area, priority }>
 * Initialized from the global `services` array (defined in app.js).
 */
const evalState = new Map();

function initEvalState() {
  if (typeof services === 'undefined') return;
  services.forEach(s => {
    evalState.set(s.id, { phase: s.phase, area: s.area, priority: s.priority, obs: '' });
  });
}

// ─── Module 1: Render evaluation table ──────────────────────────────────────

function renderEvalTable() {
  if (typeof services === 'undefined') return;
  const tbody = document.getElementById('evalTableBody');
  if (!tbody) return;

  tbody.innerHTML = services.map(s => {
    const state = evalState.get(s.id);
    const modified = state.phase !== s.phase || state.area !== s.area || state.priority !== s.priority;

    return `
      <tr data-id="${s.id}" class="${modified ? 'eval-row-modified' : ''}">
        <td class="td-id">${s.id}</td>
        <td class="td-title">${s.title}</td>
        <td>
          <select class="eval-select" data-id="${s.id}" data-field="phase" aria-label="Fase de ${s.title}">
            ${buildOptions(PHASES, state.phase)}
          </select>
        </td>
        <td>
          <select class="eval-select" data-id="${s.id}" data-field="area" aria-label="Área de ${s.title}">
            ${buildOptions(AREAS, state.area)}
          </select>
        </td>
        <td>
          <select class="eval-select" data-id="${s.id}" data-field="priority" aria-label="Prioridad de ${s.title}">
            ${buildOptions(PRIORITIES, state.priority)}
          </select>
        </td>
        <td>
          <input type="text" class="eval-input-obs search-input" style="padding:.4rem .75rem;font-size:.8rem;height:auto;" data-id="${s.id}" placeholder="Observación..." value="${state.obs}">
        </td>
      </tr>`;
  }).join('');

  // Attach change listeners
  tbody.querySelectorAll('.eval-select').forEach(sel => {
    sel.addEventListener('change', handleEvalChange);
  });
  
  tbody.querySelectorAll('.eval-input-obs').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const id = e.target.dataset.id;
      const state = evalState.get(id);
      if (state) state.obs = e.target.value;
    });
  });
}

function handleEvalChange(e) {
  const { id, field } = e.target.dataset;
  const state = evalState.get(id);
  if (state) {
    state[field] = e.target.value;
    // Re-apply modified class without full re-render (performance)
    const row = e.target.closest('tr');
    const orig = services.find(s => s.id === id);
    const isModified = state.phase !== orig.phase || state.area !== orig.area || state.priority !== orig.priority;
    row.classList.toggle('eval-row-modified', isModified);
  }
}

// ─── Module 1: Export JSON ───────────────────────────────────────────────────

/**
 * Collects current evalState and triggers a .json download.
 * @param {string} evaluatorName
 * @param {string} evaluatorRole
 */
function exportUserEvaluation(evaluatorName, evaluatorRole) {
  const payload = {
    meta: {
      evaluator: evaluatorName.trim(),
      role:      evaluatorRole.trim(),
      exportedAt: new Date().toISOString(),
      version:   '1.0'
    },
    evaluations: services.map(s => {
      const state = evalState.get(s.id);
      return {
        id:       s.id,
        title:    s.title,
        phase:    state.phase,
        area:     state.area,
        priority: state.priority,
        obs:      state.obs,
        modified: state.phase !== s.phase || state.area !== s.area || state.priority !== s.priority || !!state.obs
      };
    })
  };

  const name   = evaluatorName.trim().replace(/\s+/g, '_') || 'Evaluador';
  const date   = new Date().toISOString().slice(0, 10);
  const fileName = `evaluacion_${name}_${date}.json`;

  downloadBlob(JSON.stringify(payload, null, 2), 'application/json', fileName);
  return payload;
}

// ─── Module 2 state ─────────────────────────────────────────────────────────

/** Loaded evaluation payloads */
const loadedEvaluations = [];

// ─── Module 2: File reading ──────────────────────────────────────────────────

/**
 * Reads a list of File objects, parses JSON, and adds valid ones to loadedEvaluations.
 * @param {FileList|File[]} fileList
 */
function processUploadedFiles(fileList) {
  const promises = Array.from(fileList).map(file => {
    return new Promise((resolve) => {
      if (!file.name.endsWith('.json')) {
        resolve({ ok: false, name: file.name, error: 'No es un archivo .json' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          // Basic validation
          if (!data.meta || !Array.isArray(data.evaluations)) {
            resolve({ ok: false, name: file.name, error: 'Formato JSON inválido' });
            return;
          }
          // Avoid duplicate evaluators
          const already = loadedEvaluations.find(ev =>
            ev.meta.evaluator === data.meta.evaluator && ev.meta.exportedAt === data.meta.exportedAt
          );
          if (already) {
            resolve({ ok: false, name: file.name, error: 'Evaluación duplicada' });
            return;
          }
          loadedEvaluations.push(data);
          resolve({ ok: true, name: file.name, evaluator: data.meta.evaluator });
        } catch (_) {
          resolve({ ok: false, name: file.name, error: 'Error al parsear JSON' });
        }
      };
      reader.onerror = () => resolve({ ok: false, name: file.name, error: 'Error de lectura' });
      reader.readAsText(file);
    });
  });

  return Promise.all(promises);
}

// ─── Module 2: Consensus algorithm ──────────────────────────────────────────

/**
 * Calculates the mode (most frequent value) from an array of strings.
 * Returns { winner, count, total, isTie }.
 */
function calcMode(values) {
  const freq = {};
  values.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const maxCount = Math.max(...Object.values(freq));
  const winners  = Object.keys(freq).filter(k => freq[k] === maxCount);
  return {
    winner:  winners[0],
    count:   maxCount,
    total:   values.length,
    isTie:   winners.length > 1,
    isUnanimous: maxCount === values.length,
    allWinners: winners
  };
}

/**
 * Runs the consolidation across all loadedEvaluations.
 * Returns an array of consolidated records, one per service.
 */
function consolidateEvaluations() {
  if (loadedEvaluations.length === 0) return [];

  // Build a map: serviceId → { title, phases[], areas[], priorities[], votes[] }
  const serviceMap = {};

  loadedEvaluations.forEach(ev => {
    ev.evaluations.forEach(item => {
      if (!serviceMap[item.id]) {
        serviceMap[item.id] = { id: item.id, title: item.title, phases: [], areas: [], priorities: [], votes: [] };
      }
      serviceMap[item.id].phases.push(item.phase);
      serviceMap[item.id].areas.push(item.area);
      serviceMap[item.id].priorities.push(item.priority);
      serviceMap[item.id].votes.push({
        evaluator: ev.meta.evaluator,
        phase: item.phase,
        area: item.area,
        priority: item.priority,
        obs: item.obs || ''
      });
    });
  });

  return Object.values(serviceMap).map(svc => {
    const phaseResult    = calcMode(svc.phases);
    const areaResult     = calcMode(svc.areas);
    const priorityResult = calcMode(svc.priorities);

    const totalVoters = loadedEvaluations.length;
    const isSingle = totalVoters === 1;
    const isUnanimous = phaseResult.isUnanimous && areaResult.isUnanimous && priorityResult.isUnanimous;

    return {
      id:              svc.id,
      title:           svc.title,
      phase:           phaseResult.winner,
      phaseUnanimous:  phaseResult.isUnanimous,
      area:            areaResult.winner,
      areaUnanimous:   areaResult.isUnanimous,
      priority:        priorityResult.winner,
      priorityUnanimous: priorityResult.isUnanimous,
      totalVoters,
      isSingle,
      isUnanimous,
      consensusLevel: isSingle ? 'single' : (isUnanimous ? 'ok' : 'review'),
      votes: svc.votes
    };
  });
}

// ─── Module 2: Render consolidated table ────────────────────────────────────

function renderConsolidatedTable(data) {
  const tbody = document.getElementById('consolidatedBody');
  const count = document.getElementById('consolidatedCount');
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty" style="padding:2rem;text-align:center;color:var(--text-muted);">Sin datos para mostrar.</td></tr>`;
    return;
  }

  count.textContent = `${data.length} servicios consolidados · ${loadedEvaluations.length} evaluador${loadedEvaluations.length !== 1 ? 'es' : ''}`;

  const consensusLabels = { ok: '✓ Consenso', review: '⚠ Revisar', single: '◆ Un evaluador' };

  tbody.innerHTML = data.map(r => `
    <tr style="cursor:pointer;" onclick="openConsModal('${r.id}')" title="Haz clic para ver detalles">
      <td class="td-id">${r.id}</td>
      <td class="td-title">${r.title}</td>
      <td><span class="phase-badge ${phaseClass(r.phase)}"><span class="chip-dot phase-${phaseClass(r.phase)}"></span>${r.phase}</span>
          ${!r.phaseUnanimous && !r.isSingle ? `<span style="color:var(--critica);font-weight:bold;margin-left:4px;" title="Sin consenso">*</span>` : ''}</td>
      <td class="td-area">${r.area}
          ${!r.areaUnanimous && !r.isSingle ? `<span style="color:var(--critica);font-weight:bold;margin-left:4px;" title="Sin consenso">*</span>` : ''}</td>
      <td><span class="priority-badge ${priorityClass(r.priority)}">${r.priority}</span>
          ${!r.priorityUnanimous && !r.isSingle ? `<span style="color:var(--critica);font-weight:bold;margin-left:4px;" title="Sin consenso">*</span>` : ''}</td>
      <td>
        <span class="consensus-badge ${r.consensusLevel}">${consensusLabels[r.consensusLevel]}</span>
        <span style="display:block;font-size:.75rem;color:var(--text-muted);margin-top:.25rem;">
          Evaluado por ${r.totalVoters} persona${r.totalVoters !== 1 ? 's' : ''}
        </span>
      </td>
    </tr>`).join('');
}

// ─── Module 2: Export CSV ────────────────────────────────────────────────────

/**
 * Exports the consolidated data to a CSV file.
 * @param {Array} consolidatedData
 */
function exportFinalToCSV(consolidatedData) {
  const headers = ['ID', 'Propuesta', 'Fase Consenso', 'Área Consenso', 'Prioridad Consenso', 'Total Evaluadores', 'Estado Consenso'];

  const statusMap = { ok: 'Consenso', review: 'Requiere Revisión', single: 'Un Evaluador' };

  const rows = consolidatedData.map(r => [
    r.id,
    `"${r.title.replace(/"/g, '""')}"`,
    r.phase,
    `"${r.area.replace(/"/g, '""')}"`,
    r.priority,
    r.totalVoters,
    statusMap[r.consensusLevel]
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const date = new Date().toISOString().slice(0, 10);
  downloadBlob('\uFEFF' + csv, 'text/csv;charset=utf-8;', `consolidado_3X+_${date}.csv`);
}

// ─── Shared util: download blob ──────────────────────────────────────────────

function downloadBlob(content, mimeType, fileName) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── Module 1 UI wiring ──────────────────────────────────────────────────────

function setupEvalModule() {
  initEvalState();
  renderEvalTable();

  const exportBtn = document.getElementById('exportEvalBtn');
  const msgEl     = document.getElementById('evalIdentityMsg');

  if (!exportBtn) return;

  exportBtn.addEventListener('click', () => {
    const name = document.getElementById('evalName').value.trim();
    const role = document.getElementById('evalRole').value.trim();

    if (!name) {
      showMsg(msgEl, 'error', 'Por favor ingresa tu nombre antes de exportar.');
      document.getElementById('evalName').focus();
      return;
    }
    exportUserEvaluation(name, role);
    showMsg(msgEl, 'success', `✓ Evaluación de ${name} exportada correctamente.`);
  });
}

function showMsg(el, type, text) {
  el.textContent = text;
  el.className   = `eval-msg ${type}`;
  el.style.display = 'block';
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// ─── Module 2 UI wiring ──────────────────────────────────────────────────────

function setupConsolidateModule() {
  const dropZone    = document.getElementById('dropZone');
  const fileInput   = document.getElementById('fileInput');
  const browseBtn   = document.getElementById('browseFilesBtn');
  const fileListWr  = document.getElementById('fileListWrapper');
  const fileTagList = document.getElementById('fileTagList');
  const filesCount  = document.getElementById('filesLoadedCount');
  const clearBtn    = document.getElementById('clearFilesBtn');
  const consolidateBtn = document.getElementById('consolidateBtn');
  const resultsDiv  = document.getElementById('consolidatedResults');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  if (!dropZone) return;

  let lastConsolidated = [];

  // ── Drag & Drop ──
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });
  dropZone.addEventListener('click', () => fileInput.click());
  browseBtn.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  // ── Handle file reads ──
  async function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    const results = await processUploadedFiles(fileList);
    fileInput.value = ''; // reset so same file can be re-added after clear

    results.forEach(r => {
      const tag = document.createElement('span');
      tag.className = `file-tag${r.ok ? '' : ' file-tag-error'}`;
      tag.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${r.ok
            ? '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'
            : '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>'
          }
        </svg>
        ${r.ok ? `${r.name} <em style="opacity:.7;font-size:.7rem;">(${r.evaluator})</em>` : `${r.name} — ${r.error}`}
        <span class="file-tag-remove" title="Eliminar" data-name="${r.name}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </span>`;
      fileTagList.appendChild(tag);

      // Remove button
      tag.querySelector('.file-tag-remove').addEventListener('click', () => {
        const idx = loadedEvaluations.findIndex(ev => ev.meta.evaluator === r.evaluator);
        if (idx !== -1) loadedEvaluations.splice(idx, 1);
        tag.remove();
        updateFileUI();
      });
    });

    updateFileUI();
  }

  function updateFileUI() {
    const count = loadedEvaluations.length;
    filesCount.textContent = `${count} archivo${count !== 1 ? 's' : ''} cargado${count !== 1 ? 's' : ''}`;
    fileListWr.style.display = (fileTagList.children.length > 0) ? 'block' : 'none';
    if (count === 0) {
      resultsDiv.style.display = 'none';
    }
  }

  // ── Clear ──
  clearBtn.addEventListener('click', () => {
    loadedEvaluations.length = 0;
    fileTagList.innerHTML = '';
    resultsDiv.style.display = 'none';
    updateFileUI();
  });

  // ── Consolidate ──
  consolidateBtn.addEventListener('click', () => {
    if (loadedEvaluations.length === 0) return;
    lastConsolidated = consolidateEvaluations();
    window._lastConsolidated = lastConsolidated; // store globally for the modal
    renderConsolidatedTable(lastConsolidated);
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── Export CSV ──
  exportCsvBtn.addEventListener('click', () => {
    if (lastConsolidated.length > 0) exportFinalToCSV(lastConsolidated);
  });
}

// ─── Modal details view ──────────────────────────────────────────────────────
window.openConsModal = function(id) {
  const consModalOverlay = document.getElementById('consModalOverlay');
  
  if (!window._lastConsolidated) return;
  const data = window._lastConsolidated.find(r => r.id === id);
  if(!data) return;
  
  const orig = typeof services !== 'undefined' ? services.find(s => s.id === id) : null;
  
  document.getElementById('consModalId').textContent = data.id;
  document.getElementById('consModalPhaseBadge').className = `phase-badge ${phaseClass(data.phase)}`;
  document.getElementById('consModalPhaseBadge').textContent = data.consensusLevel === 'ok' ? 'Consenso Total' : (data.consensusLevel === 'single' ? 'Evaluación Única' : 'Diferencias Detectadas');
  document.getElementById('consModalTitle').textContent = data.title;
  
  let origHtml = '';
  if (orig) {
      origHtml = `
      <div style="margin-bottom: 1.5rem; padding: 1rem; border-radius: var(--radius-md); background: rgba(124, 92, 252, 0.05); border: 1px dashed var(--accent);">
          <h5 style="font-size:.8rem; text-transform:uppercase; color:var(--accent-light); margin-bottom:.5rem; letter-spacing:1px;">Valor Original en Matriz</h5>
          <div style="display:flex; gap:1.5rem; flex-wrap:wrap;">
              <div>
                  <span style="display:block; font-size:.7rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">FASE</span>
                  <span class="phase-badge ${phaseClass(orig.phase)}">${orig.phase}</span>
              </div>
              <div>
                  <span style="display:block; font-size:.7rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">ÁREA</span>
                  <span style="font-size:.85rem; color:var(--text-primary); display:inline-block; padding:.25rem 0;">${orig.area}</span>
              </div>
              <div>
                  <span style="display:block; font-size:.7rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">PRIORIDAD</span>
                  <span class="priority-badge ${priorityClass(orig.priority)}">${orig.priority}</span>
              </div>
          </div>
      </div>
      `;
  }
  
  const votesHtml = data.votes.map(v => `
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem;border-bottom:1px solid var(--border);padding-bottom:.5rem;">
              <span style="font-weight:bold;color:var(--text-primary);">${v.evaluator}</span>
          </div>
          <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:.75rem;">
              <div>
                  <span style="display:block; font-size:.7rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">FASE</span>
                  <span class="phase-badge ${phaseClass(v.phase)}">${v.phase}</span>
              </div>
              <div>
                  <span style="display:block; font-size:.7rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">ÁREA</span>
                  <span style="font-size:.85rem; color:var(--text-primary); display:inline-block; padding:.25rem 0;">${v.area}</span>
              </div>
              <div>
                  <span style="display:block; font-size:.7rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">PRIORIDAD</span>
                  <span class="priority-badge ${priorityClass(v.priority)}">${v.priority}</span>
              </div>
          </div>
          ${v.obs ? `
            <div style="margin-top:.5rem;">
                <span style="display:block; font-size:.7rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">OBSERVACIÓN</span>
                <div style="font-size:.85rem;color:var(--text-secondary);background:var(--bg-secondary);padding:.75rem;border-radius:var(--radius-sm);border:1px solid var(--border);">💬 "${v.obs}"</div>
            </div>` : ''}
      </div>
  `).join('');
  
  document.getElementById('consModalVotes').innerHTML = origHtml + votesHtml;
  
  consModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('consModalClose')?.addEventListener('click', () => {
      document.getElementById('consModalOverlay').classList.remove('open');
      document.body.style.overflow = '';
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 3: BLUEPRINT EDITOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * editorState: Map<serviceId, { desc, components[], justification, kpis[] }>
 * Initialized from the global `services` array.
 */
const editorState = new Map();

function initEditorState() {
  if (typeof services === 'undefined') return;
  services.forEach(s => {
    editorState.set(s.id, {
      desc:          s.desc || '',
      components:    [...(s.components || [])],
      justification: '',  // new field — starts empty
      kpis:          [...(s.kpis || [])]
    });
  });
}

// ─── Render editor cards ─────────────────────────────────────────────────────

function renderEditorCards() {
  if (typeof services === 'undefined') return;
  const container = document.getElementById('editorCardList');
  if (!container) return;

  const countEl = document.getElementById('editorCount');
  if (countEl) countEl.textContent = `${services.length} servicios`;

  container.innerHTML = services.map(s => {
    const state = editorState.get(s.id);
    return `
    <div class="editor-card" data-editor-id="${s.id}">
      <div class="editor-card-header" onclick="toggleEditorCard('${s.id}')">
        <div class="editor-card-header-left">
          <span class="editor-card-id">${s.id}</span>
          <span class="editor-card-title">${s.title}</span>
        </div>
        <div class="editor-card-badges">
          <span class="phase-badge ${phaseClass(s.phase)}"><span class="chip-dot phase-${phaseClass(s.phase)}"></span>${s.phase}</span>
          <span class="priority-badge ${priorityClass(s.priority)}">${s.priority}</span>
        </div>
        <div class="editor-card-chevron">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
      <div class="editor-card-body">
        ${renderEditorField(s.id, 'desc', 'Descripción', 'textarea', state.desc, s.desc)}
        ${renderEditorListField(s.id, 'components', 'Componentes / Ruta', state.components)}
        ${renderEditorField(s.id, 'justification', 'Justificación Estratégica', 'textarea', state.justification, '')}
        ${renderEditorListField(s.id, 'kpis', 'KPIs Críticos', state.kpis)}
      </div>
    </div>`;
  }).join('');

  // Attach textarea change listeners
  container.querySelectorAll('.editor-textarea').forEach(ta => {
    ta.addEventListener('input', e => {
      const { editorId, field } = e.target.dataset;
      const st = editorState.get(editorId);
      if (st) st[field] = e.target.value;
    });
  });

  // Attach list item input listeners
  container.querySelectorAll('.editor-list-input').forEach(inp => {
    inp.addEventListener('input', e => {
      const { editorId, field, index } = e.target.dataset;
      const st = editorState.get(editorId);
      if (st && st[field]) st[field][parseInt(index)] = e.target.value;
    });
  });
}

function renderEditorField(id, field, label, type, value, originalValue) {
  const icon = field === 'desc'
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>';

  return `
  <div class="editor-field">
    <label class="editor-field-label">
      ${icon} ${label}
      ${originalValue === '' && field !== 'justification' ? '' : ''}
    </label>
    <textarea class="editor-textarea"
      data-editor-id="${id}"
      data-field="${field}"
      placeholder="${field === 'justification' ? '¿Por qué este servicio es importante para la aceleradora? Escribe la justificación aquí...' : 'Escribe aquí...'}"
    >${value}</textarea>
  </div>`;
}

function renderEditorListField(id, field, label, items) {
  const icon = field === 'components'
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>';

  const listItems = items.map((item, i) => `
    <div class="editor-list-item">
      <input type="text" class="editor-list-input"
        value="${item.replace(/"/g, '&quot;')}"
        data-editor-id="${id}"
        data-field="${field}"
        data-index="${i}"
        placeholder="Elemento ${i + 1}">
      <span class="editor-list-remove" onclick="removeEditorListItem('${id}','${field}',${i})" title="Eliminar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </span>
    </div>`).join('');

  return `
  <div class="editor-field">
    <label class="editor-field-label">${icon} ${label}</label>
    <div class="editor-list" id="editor-list-${id}-${field}">
      ${listItems}
    </div>
    <button class="editor-list-add" onclick="addEditorListItem('${id}','${field}')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      Agregar ${field === 'components' ? 'componente' : 'KPI'}
    </button>
  </div>`;
}

// ─── Editor: toggle accordion ────────────────────────────────────────────────

window.toggleEditorCard = function(id) {
  const card = document.querySelector(`.editor-card[data-editor-id="${id}"]`);
  if (card) card.classList.toggle('open');
};

// ─── Editor: add/remove list items ───────────────────────────────────────────

window.addEditorListItem = function(id, field) {
  const st = editorState.get(id);
  if (!st) return;
  st[field].push('');
  // Re-render just this card's list
  reRenderEditorList(id, field);
};

window.removeEditorListItem = function(id, field, index) {
  const st = editorState.get(id);
  if (!st) return;
  st[field].splice(index, 1);
  reRenderEditorList(id, field);
};

function reRenderEditorList(id, field) {
  const st = editorState.get(id);
  if (!st) return;
  const container = document.getElementById(`editor-list-${id}-${field}`);
  if (!container) return;

  container.innerHTML = st[field].map((item, i) => `
    <div class="editor-list-item">
      <input type="text" class="editor-list-input"
        value="${item.replace(/"/g, '&quot;')}"
        data-editor-id="${id}"
        data-field="${field}"
        data-index="${i}"
        placeholder="Elemento ${i + 1}">
      <span class="editor-list-remove" onclick="removeEditorListItem('${id}','${field}',${i})" title="Eliminar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </span>
    </div>`).join('');

  // Re-attach input listeners
  container.querySelectorAll('.editor-list-input').forEach(inp => {
    inp.addEventListener('input', e => {
      const { editorId, field: f, index } = e.target.dataset;
      const s = editorState.get(editorId);
      if (s && s[f]) s[f][parseInt(index)] = e.target.value;
    });
  });

  // Focus the new empty item
  const inputs = container.querySelectorAll('.editor-list-input');
  if (inputs.length > 0) inputs[inputs.length - 1].focus();
}

// ─── Editor: Export JSON ─────────────────────────────────────────────────────

function exportBlueprintJSON(editorName, editorRole) {
  const payload = {
    meta: {
      editor:     editorName,
      role:       editorRole,
      exportedAt: new Date().toISOString(),
      type:       'blueprint_edit',
      version:    '1.0'
    },
    services: services.map(s => {
      const state = editorState.get(s.id);
      return {
        id:            s.id,
        title:         s.title,
        phase:         s.phase,
        area:          s.area,
        priority:      s.priority,
        desc:          state.desc,
        components:    state.components.filter(c => c.trim()),
        justification: state.justification,
        kpis:          state.kpis.filter(k => k.trim())
      };
    })
  };

  const name = editorName.replace(/\s+/g, '_') || 'Editor';
  const date = new Date().toISOString().slice(0, 10);
  downloadBlob(JSON.stringify(payload, null, 2), 'application/json', `blueprint_${name}_${date}.json`);
  return payload;
}

// ─── Editor: Export CSV ──────────────────────────────────────────────────────

function exportBlueprintCSV() {
  const headers = ['ID', 'Título', 'Fase', 'Área', 'Prioridad', 'Descripción', 'Componentes / Ruta', 'Justificación', 'KPIs'];

  const rows = services.map(s => {
    const state = editorState.get(s.id);
    return [
      s.id,
      `"${s.title.replace(/"/g, '""')}"`,
      s.phase,
      `"${s.area.replace(/"/g, '""')}"`,
      s.priority,
      `"${state.desc.replace(/"/g, '""')}"`,
      `"${state.components.filter(c => c.trim()).join(' | ').replace(/"/g, '""')}"`,
      `"${state.justification.replace(/"/g, '""')}"`,
      `"${state.kpis.filter(k => k.trim()).join(' | ').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const date = new Date().toISOString().slice(0, 10);
  downloadBlob('\uFEFF' + csv, 'text/csv;charset=utf-8;', `blueprint_3X+_${date}.csv`);
}

// ─── Editor: Setup ───────────────────────────────────────────────────────────

function setupEditorModule() {
  initEditorState();
  renderEditorCards();

  const jsonBtn = document.getElementById('exportBlueprintJson');
  const csvBtn  = document.getElementById('exportBlueprintCsv');
  const msgEl   = document.getElementById('editorMsg');
  const expandAll  = document.getElementById('editorExpandAll');
  const collapseAll = document.getElementById('editorCollapseAll');

  if (jsonBtn) {
    jsonBtn.addEventListener('click', () => {
      const name = document.getElementById('editorName').value.trim();
      const role = document.getElementById('editorRole').value.trim();
      if (!name) {
        showMsg(msgEl, 'error', 'Ingresa tu nombre antes de exportar.');
        document.getElementById('editorName').focus();
        return;
      }
      exportBlueprintJSON(name, role);
      showMsg(msgEl, 'success', `✓ Blueprint exportado como JSON por ${name}.`);
    });
  }

  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      exportBlueprintCSV();
      showMsg(msgEl, 'success', '✓ Blueprint exportado como CSV.');
    });
  }

  if (expandAll) {
    expandAll.addEventListener('click', () => {
      document.querySelectorAll('.editor-card').forEach(c => c.classList.add('open'));
    });
  }

  if (collapseAll) {
    collapseAll.addEventListener('click', () => {
      document.querySelectorAll('.editor-card').forEach(c => c.classList.remove('open'));
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 4: DIAGNÓSTICO DE EMPRESA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * diagState:
 *   company:  { name, sector, website, contact, description }
 *   assets:   [{ name, phase }]
 *   checklist: Map<serviceId, { checked: bool, obs: string }>
 */
const diagState = {
  company: { name: '', sector: '', website: '', contact: '', description: '' },
  assets: [],
  checklist: new Map()
};

let diagFilterPhase = 'all';

function initDiagState() {
  if (typeof services === 'undefined') return;
  services.forEach(s => {
    diagState.checklist.set(s.id, { checked: false, obs: '' });
  });
}

// ─── Checklist rendering ─────────────────────────────────────────────────────

function renderDiagChecklist() {
  if (typeof services === 'undefined') return;
  const container = document.getElementById('diagChecklist');
  if (!container) return;

  container.innerHTML = services.map(s => {
    const state = diagState.checklist.get(s.id);
    return `
    <div class="diag-check-item ${state.checked ? 'checked' : ''}" data-diag-id="${s.id}" data-diag-phase="${s.phase}" data-diag-checked="${state.checked}">
      <div class="diag-check-toggle" onclick="toggleDiagCheck('${s.id}')">
        <div class="check-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
      </div>
      <div class="diag-check-content">
        <div class="diag-check-top">
          <span style="font-family:var(--font-display);font-weight:700;color:var(--accent-light);font-size:.8rem;">${s.id}</span>
          <span class="diag-check-title">${s.title}</span>
          <span class="phase-badge ${phaseClass(s.phase)}" style="font-size:.65rem;padding:.15rem .5rem;">${s.phase}</span>
          <span class="priority-badge ${priorityClass(s.priority)}" style="font-size:.65rem;padding:.15rem .5rem;">${s.priority}</span>
        </div>
        <input type="text" class="diag-check-obs" data-diag-id="${s.id}"
          placeholder="Observaciones..."
          value="${state.obs}">
      </div>
    </div>`;
  }).join('');

  // Observation listeners
  container.querySelectorAll('.diag-check-obs').forEach(inp => {
    inp.addEventListener('input', e => {
      const id = e.target.dataset.diagId;
      const st = diagState.checklist.get(id);
      if (st) st.obs = e.target.value;
    });
  });

  applyDiagFilter();
}

window.toggleDiagCheck = function(id) {
  const st = diagState.checklist.get(id);
  if (!st) return;
  st.checked = !st.checked;

  const item = document.querySelector(`.diag-check-item[data-diag-id="${id}"]`);
  if (item) {
    item.classList.toggle('checked', st.checked);
    item.dataset.diagChecked = st.checked;
  }
  updateDiagProgress();
  applyDiagFilter();
};

// ─── Checklist filter ────────────────────────────────────────────────────────

function applyDiagFilter() {
  const items = document.querySelectorAll('.diag-check-item');
  items.forEach(item => {
    const phase = item.dataset.diagPhase;
    const checked = item.dataset.diagChecked === 'true';

    let show = true;
    if (diagFilterPhase === 'checked')        show = checked;
    else if (diagFilterPhase === 'unchecked') show = !checked;
    else if (diagFilterPhase !== 'all')       show = (phase === diagFilterPhase);

    item.classList.toggle('hidden', !show);
  });
}

// ─── Progress bars ───────────────────────────────────────────────────────────

function updateDiagProgress() {
  if (typeof services === 'undefined') return;

  const phases = { 'EXplorar+': { total: 0, checked: 0 }, 'EXpandir+': { total: 0, checked: 0 }, 'EXcalar+': { total: 0, checked: 0 } };

  services.forEach(s => {
    if (phases[s.phase]) {
      phases[s.phase].total++;
      if (diagState.checklist.get(s.id)?.checked) phases[s.phase].checked++;
    }
  });

  const phaseMap = { 'EXplorar+': 'Explorar', 'EXpandir+': 'Expandir', 'EXcalar+': 'Excalar' };

  let totalChecked = 0, totalCount = 0;

  Object.entries(phases).forEach(([phase, data]) => {
    const key = phaseMap[phase];
    const pct = data.total > 0 ? Math.round((data.checked / data.total) * 100) : 0;
    const pctEl = document.getElementById(`diagPct${key}`);
    const barEl = document.getElementById(`diagBar${key}`);
    const detEl = document.getElementById(`diagDetail${key}`);

    if (pctEl) pctEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;
    if (detEl) detEl.textContent = `${data.checked} de ${data.total} servicios`;

    totalChecked += data.checked;
    totalCount += data.total;
  });

  const totalPct = totalCount > 0 ? Math.round((totalChecked / totalCount) * 100) : 0;
  const tPct = document.getElementById('diagPctTotal');
  const tBar = document.getElementById('diagBarTotal');
  const tDet = document.getElementById('diagDetailTotal');
  if (tPct) tPct.textContent = `${totalPct}%`;
  if (tBar) tBar.style.width = `${totalPct}%`;
  if (tDet) tDet.textContent = `${totalChecked} de ${totalCount} servicios`;
}

// ─── Asset inventory ─────────────────────────────────────────────────────────

function renderDiagAssets() {
  const container = document.getElementById('diagAssetList');
  if (!container) return;

  container.innerHTML = diagState.assets.map((a, i) => `
    <div class="diag-asset-row">
      <input type="text" class="search-input" value="${a.name.replace(/"/g, '&quot;')}" data-idx="${i}" placeholder="Nombre del proceso o herramienta...">
      <select class="eval-select" data-idx="${i}">
        <option value="EXplorar+"${a.phase === 'EXplorar+' ? ' selected' : ''}>EXplorar+</option>
        <option value="EXpandir+"${a.phase === 'EXpandir+' ? ' selected' : ''}>EXpandir+</option>
        <option value="EXcalar+"${a.phase === 'EXcalar+' ? ' selected' : ''}>EXcalar+</option>
      </select>
      <span class="editor-list-remove" onclick="removeDiagAsset(${i})" title="Eliminar" style="justify-self:center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </span>
    </div>`).join('');

  container.querySelectorAll('.search-input').forEach(inp => {
    inp.addEventListener('input', e => {
      diagState.assets[parseInt(e.target.dataset.idx)].name = e.target.value;
    });
  });

  container.querySelectorAll('.eval-select').forEach(sel => {
    sel.addEventListener('change', e => {
      diagState.assets[parseInt(e.target.dataset.idx)].phase = e.target.value;
    });
  });
}

window.removeDiagAsset = function(index) {
  diagState.assets.splice(index, 1);
  renderDiagAssets();
};

// ─── Export functions ────────────────────────────────────────────────────────

function collectDiagCompany() {
  diagState.company.name        = document.getElementById('diagCompanyName')?.value || '';
  diagState.company.sector      = document.getElementById('diagSector')?.value || '';
  diagState.company.website     = document.getElementById('diagWebsite')?.value || '';
  diagState.company.contact     = document.getElementById('diagContact')?.value || '';
  diagState.company.description = document.getElementById('diagDescription')?.value || '';
}

function exportDiagJSON() {
  collectDiagCompany();

  const checklist = [];
  if (typeof services !== 'undefined') {
    services.forEach(s => {
      const st = diagState.checklist.get(s.id);
      checklist.push({
        id: s.id, title: s.title, phase: s.phase, area: s.area, priority: s.priority,
        hasIt: st.checked, observation: st.obs
      });
    });
  }

  const payload = {
    meta: { exportedAt: new Date().toISOString(), type: 'diagnostico_3x', version: '1.0' },
    company: { ...diagState.company },
    assets: diagState.assets.filter(a => a.name.trim()),
    checklist,
    summary: {
      totalServices: checklist.length,
      coveredServices: checklist.filter(c => c.hasIt).length,
      coveragePercent: checklist.length > 0 ? Math.round((checklist.filter(c => c.hasIt).length / checklist.length) * 100) : 0
    }
  };

  const name = diagState.company.name.trim().replace(/\s+/g, '_') || 'Empresa';
  const date = new Date().toISOString().slice(0, 10);
  downloadBlob(JSON.stringify(payload, null, 2), 'application/json', `diagnostico_${name}_${date}.json`);
}

function exportDiagCSV() {
  collectDiagCompany();

  const info = [
    `Empresa,${diagState.company.name}`,
    `Sector,${diagState.company.sector}`,
    `Website,${diagState.company.website}`,
    `Contacto,${diagState.company.contact}`,
    `"Descripción","${(diagState.company.description || '').replace(/"/g, '""')}"`,
    ''
  ];

  const headers = 'ID,Servicio,Fase,Área,Prioridad,¿Lo Tiene?,Observación';
  const rows = [];
  if (typeof services !== 'undefined') {
    services.forEach(s => {
      const st = diagState.checklist.get(s.id);
      rows.push([
        s.id,
        `"${s.title.replace(/"/g, '""')}"`,
        s.phase,
        `"${s.area.replace(/"/g, '""')}"`,
        s.priority,
        st.checked ? 'Sí' : 'No',
        `"${(st.obs || '').replace(/"/g, '""')}"`
      ].join(','));
    });
  }

  const csv = [...info, headers, ...rows].join('\n');
  const name = diagState.company.name.trim().replace(/\s+/g, '_') || 'Empresa';
  const date = new Date().toISOString().slice(0, 10);
  downloadBlob('\uFEFF' + csv, 'text/csv;charset=utf-8;', `diagnostico_${name}_${date}.csv`);
}

// ─── Setup ───────────────────────────────────────────────────────────────────

function setupDiagModule() {
  initDiagState();
  renderDiagChecklist();
  updateDiagProgress();

  // Add asset button
  const addBtn = document.getElementById('diagAddAsset');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      diagState.assets.push({ name: '', phase: 'EXplorar+' });
      renderDiagAssets();
    });
  }

  // Filter chips
  document.querySelectorAll('[data-diag-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-diag-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      diagFilterPhase = chip.dataset.diagFilter;
      applyDiagFilter();
    });
  });

  // Export
  const msgEl = document.getElementById('diagExportMsg');

  document.getElementById('diagExportJson')?.addEventListener('click', () => {
    const name = document.getElementById('diagCompanyName')?.value.trim();
    if (!name) {
      showMsg(msgEl, 'error', 'Ingresa el nombre de la empresa antes de exportar.');
      document.getElementById('diagCompanyName')?.focus();
      return;
    }
    exportDiagJSON();
    showMsg(msgEl, 'success', `✓ Diagnóstico de "${name}" exportado como JSON.`);
  });

  document.getElementById('diagExportCsv')?.addEventListener('click', () => {
    const name = document.getElementById('diagCompanyName')?.value.trim();
    if (!name) {
      showMsg(msgEl, 'error', 'Ingresa el nombre de la empresa antes de exportar.');
      document.getElementById('diagCompanyName')?.focus();
      return;
    }
    exportDiagCSV();
    showMsg(msgEl, 'success', `✓ Reporte CSV de "${name}" exportado correctamente.`);
  });
}

// ─── Bootstrap ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  setupEvalModule();
  setupConsolidateModule();
  setupEditorModule();
  setupDiagModule();
});
