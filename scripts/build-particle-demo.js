#!/usr/bin/env node
// Build clinic-demo-particle.html from real Particle sandbox data
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const d = require(path.join(root, 'sandbox-data/elvira-valadez-flat.json'));
let html = fs.readFileSync(path.join(root, 'clinic-demo.html'), 'utf8');

// 1. Title
html = html.replace(
  "<title>MyPulseScan \u2014 See What\u2019s Possible</title>",
  "<title>MyPulseScan \u2014 Real Particle Sandbox Data (Elvira Valadez)</title>"
);
// Fallback if chars differ
html = html.replace(
  '<title>MyPulseScan',
  '<title>MyPulseScan [Particle Sandbox]'
);

// 2. Patient header
html = html.replace('<div class="patient-avatar">SM</div>', '<div class="patient-avatar">EV</div>');
html = html.replace('<div class="patient-name">Sarah Mitchell</div>', '<div class="patient-name">Elvira Valadez</div>');
html = html.replace(
  'DOB: 03/15/1978',
  'DOB: 12/26/1970'
);
html = html.replace('Phoenix, AZ', 'Boston, MA');
html = html.replace('48 years old', '55 years old');
html = html.replace('MRN: PMH-2024-08412', 'Particle Sandbox Patient');
html = html.replace(
  /<strong style="color:var\(--accent-teal-bright\);">6 providers<\/strong>/,
  '<strong style="color:var(--accent-teal-bright);">' + d.recordSources.length + ' record sources</strong>'
);
html = html.replace(
  /<strong style="color:var\(--accent-teal-bright\);">3 health networks<\/strong>/,
  '<strong style="color:var(--accent-teal-bright);">' + d.organizations.length + ' organizations</strong>'
);
html = html.replace('Last updated: 04/12/2026', 'Real Particle Health Sandbox Data');

// 3. Form fields
html = html.replace('value="Sarah"', 'value="Elvira"');
html = html.replace('value="Mitchell"', 'value="Valadez"');
html = html.replace('value="03/15/1978"', 'value="12/26/1970"');
html = html.replace('value="Phoenix"', 'value="Boston"');
html = html.replace('value="AZ"', 'value="MA"');

// 4. AI Summary
const aiText = d.aIOutputs[0].text;
const afterDisclaimer = aiText.split('**Patient Demographics:**');
let clinicalSummary = afterDisclaimer.length > 1
  ? 'Patient Demographics: ' + afterDisclaimer[1].substring(0, 1200)
  : aiText.substring(0, 1200);
clinicalSummary = clinicalSummary
  .replace(/\*\*/g, '')
  .replace(/\*/g, '')
  .replace(/\n/g, ' ')
  .replace(/\s+/g, ' ')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .trim();

const aiSummaryMatch = html.match(/<div class="ai-summary-text">[\s\S]*?<\/div>/);
if (aiSummaryMatch) {
  html = html.replace(aiSummaryMatch[0],
    '<div class="ai-summary-text">' + clinicalSummary + '</div>');
}

// 5. Tab counts
const tabReplacements = [
  ['Allergies <span class="tab-count">4</span>', 'Allergies <span class="tab-count">3</span>'],
  ['Medications <span class="tab-count">11</span>', 'Medications <span class="tab-count">11</span>'],
  ['Labs <span class="tab-count">23</span>', 'Labs <span class="tab-count">36</span>'],
  ['Problems <span class="tab-count">8</span>', 'Problems <span class="tab-count">16</span>'],
  ['Encounters <span class="tab-count">14</span>', 'Encounters <span class="tab-count">90</span>'],
  ['Immunizations <span class="tab-count">6</span>', 'Immunizations <span class="tab-count">13</span>'],
  ['Procedures <span class="tab-count">3</span>', 'Procedures <span class="tab-count">9</span>'],
  ['Vitals <span class="tab-count">18</span>', 'Vitals <span class="tab-count">217</span>'],
  ['Social History <span class="tab-count">4</span>', 'Social History <span class="tab-count">0</span>'],
  ['Family History <span class="tab-count">4</span>', 'Family History <span class="tab-count">0</span>'],
];
tabReplacements.forEach(([old, rep]) => { html = html.replace(old, rep); });

// 6. Build data tables

// --- ALLERGIES ---
const allergyRecord = d.allergies[0];
const allergenNames = [...new Set(
  allergyRecord.allergy_code_snomed_name.split(',').map(s => s.trim()).filter(s => s.length > 2)
)];
let allergyRows = '';
allergenNames.forEach(name => {
  const isSevere = name.toLowerCase().includes('penicillin');
  const badge = isSevere
    ? '<span class="critical-val">SEVERE</span>'
    : '<span class="active-badge">Moderate</span>';
  const tdClass = isSevere ? 'critical-val' : 'val';
  allergyRows += `<tr><td class="${tdClass}">${name}</td><td>\u2014</td><td>${badge}</td><td class="source-col">Particle</td><td class="source-col">\u2014</td></tr>\n`;
});

// --- MEDICATIONS ---
const seenMeds = new Set();
let medRows = '';
d.medications.forEach(m => {
  const raw = (m.medication_code_rxnorm_name || m.medication_name.split(',')[0].trim());
  const name = raw.split(',')[0].trim();
  if (seenMeds.has(name.toLowerCase()) || name.length < 3) return;
  seenMeds.add(name.toLowerCase());
  const status = m.medication_statement_status;
  const badge = status === 'active'
    ? '<span class="active-badge">Active</span>'
    : '<span class="resolved-badge">Completed</span>';
  const start = m.medication_statement_start_time ? m.medication_statement_start_time.split('T')[0] : '\u2014';
  const end = m.medication_statement_end_time ? m.medication_statement_end_time.split('T')[0] : '\u2014';
  const dose = m.medication_statement_dose_value || '\u2014';
  const unit = m.medication_statement_dose_unit === 'no_unit' ? '' : (m.medication_statement_dose_unit || '');
  medRows += `<tr><td class="val">${name}</td><td>${dose} ${unit}</td><td>${badge}</td><td class="source-col">${start}</td><td class="source-col">${end}</td><td class="source-col">Particle</td></tr>\n`;
});

// --- PROBLEMS ---
const seenProbs = new Set();
let probRows = '';
d.problems.forEach(p => {
  const name = p.condition_name.split(',')[0].trim();
  if (seenProbs.has(name.toLowerCase()) || name.length < 3) return;
  seenProbs.add(name.toLowerCase());
  const icd10 = (p.condition_code_icd10 || '').split(',')[0].trim();
  const status = p.condition_clinical_status;
  const badge = status === 'active'
    ? '<span class="active-badge">Active</span>'
    : '<span class="resolved-badge">Resolved</span>';
  const onset = p.condition_onset_date ? p.condition_onset_date.split('T')[0] : '\u2014';
  probRows += `<tr><td class="val">${name}</td><td>${icd10}</td><td>${badge}</td><td class="source-col">${onset}</td><td class="source-col">\u2014</td><td class="source-col">Particle</td></tr>\n`;
});

// --- ENCOUNTERS (first 20 of 90) ---
let encRows = '';
const sortedEnc = [...d.encounters].sort((a, b) => (b.encounter_start_time || '').localeCompare(a.encounter_start_time || ''));
sortedEnc.slice(0, 20).forEach(e => {
  const date = e.encounter_start_time ? e.encounter_start_time.split('T')[0] : '\u2014';
  const type = (e.encounter_type_name || e.encounter_type_code_icd10_name || '\u2014').substring(0, 60);
  const end = e.encounter_end_time ? e.encounter_end_time.split('T')[0] : '\u2014';
  encRows += `<tr><td class="val">${date}</td><td>${type}</td><td class="source-col">${end}</td><td class="source-col">\u2014</td><td class="source-col">\u2014</td><td class="source-col">Particle</td></tr>\n`;
});

// --- IMMUNIZATIONS ---
let immRows = '';
const seenImms = new Set();
d.immunizations.forEach(im => {
  const name = im.immunization_name || '\u2014';
  const date = im.immunization_occurrence_time ? im.immunization_occurrence_time.split('T')[0] : '\u2014';
  const key = name + date;
  if (seenImms.has(key)) return;
  seenImms.add(key);
  const ndc = im.immunization_code_ndc_name || '\u2014';
  immRows += `<tr><td class="val">${name}</td><td>${ndc}</td><td>\u2014</td><td class="source-col">${date}</td><td>\u2014</td><td class="source-col">Particle</td></tr>\n`;
});

// --- PROCEDURES ---
let procRows = '';
d.procedures.forEach(p => {
  const name = p.procedure_name || '\u2014';
  const cpt = p.procedure_code_cpt || '\u2014';
  const date = p.procedure_date_time ? p.procedure_date_time.split('T')[0] : '\u2014';
  const snomed = (p.procedure_code_snomed_name || '\u2014').substring(0, 50);
  procRows += `<tr><td class="val">${name}</td><td>${cpt}</td><td class="source-col">${date}</td><td>${snomed}</td><td>\u2014</td><td class="source-col">Particle</td></tr>\n`;
});

// --- VITALS (first 20 of 217) ---
let vitalRows = '';
const sortedVitals = [...d.vitalSigns].sort((a, b) => (b.vital_sign_observation_time || '').localeCompare(a.vital_sign_observation_time || ''));
sortedVitals.slice(0, 20).forEach(v => {
  const name = v.vital_sign_observation_name || '\u2014';
  const value = v.vital_sign_observation_value || '\u2014';
  const unit = v.vital_sign_observation_unit || '';
  const date = v.vital_sign_observation_time ? v.vital_sign_observation_time.split('T')[0] : '\u2014';
  vitalRows += `<tr><td class="val">${name}</td><td class="val">${value} ${unit}</td><td class="ref-range">\u2014</td><td>\u2014</td><td class="source-col">${date}</td><td class="source-col">Particle</td></tr>\n`;
});

// --- LABS (deduplicated, most recent per test) ---
const labsByName = {};
d.labs.forEach(l => {
  const name = l.lab_name.split(',')[0].trim();
  if (!name || name.length < 2) return;
  const ts = l.lab_timestamp || '';
  if (!labsByName[name] || ts > labsByName[name].ts) {
    labsByName[name] = {
      name, value: l.lab_value || l.lab_value_quantity || l.lab_value_string || '\u2014',
      unit: l.lab_unit || '', loinc: (l.lab_code_loinc || '').split(',')[0].trim(),
      ts, date: ts ? ts.split('T')[0] : '\u2014'
    };
  }
});
const labs = Object.values(labsByName).sort((a, b) => b.ts.localeCompare(a.ts));
let labRows = '';
labs.forEach(l => {
  labRows += `<tr><td class="val">${l.name}</td><td class="val">${l.value} ${l.unit}</td><td class="ref-range">\u2014</td><td>\u2014</td><td class="source-col">${l.loinc}</td><td class="source-col">${l.date}</td><td class="source-col">Particle</td></tr>\n`;
});

// 7. Replace all table sections using regex
function replaceSection(html, tabId, panelContent) {
  // Match from <!-- TAB: ... --> to the closing </div>\n        </div>
  const re = new RegExp('<!-- TAB: ' + tabId + ' -->[\\s\\S]*?(?=<!-- TAB:|<div class="trust-badge")', 'g');
  return html.replace(re, panelContent + '\n\n        ');
}

html = replaceSection(html, 'Allergies',
  `<!-- TAB: Allergies -->
        <div class="snapshot-panel active" id="panel-allergies">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Allergen</th><th>Reaction</th><th>Severity</th><th>Source</th><th>Reported</th></tr></thead>
              <tbody>${allergyRows}</tbody>
            </table>
          </div>
        </div>`);

html = replaceSection(html, 'Medications',
  `<!-- TAB: Medications -->
        <div class="snapshot-panel" id="panel-medications">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Medication</th><th>Dose</th><th>Status</th><th>Start</th><th>End</th><th>Source</th></tr></thead>
              <tbody>${medRows}</tbody>
            </table>
          </div>
        </div>`);

html = replaceSection(html, 'Labs',
  `<!-- TAB: Labs -->
        <div class="snapshot-panel" id="panel-labs">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Test</th><th>Result</th><th>Ref Range</th><th>Flag</th><th>LOINC</th><th>Date</th><th>Source</th></tr></thead>
              <tbody>${labRows}</tbody>
            </table>
            <div class="table-footer">${labs.length} unique lab results (deduplicated, most recent per test) \u00b7 Particle Sandbox</div>
          </div>
        </div>`);

html = replaceSection(html, 'Problems',
  `<!-- TAB: Problems -->
        <div class="snapshot-panel" id="panel-problems">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Diagnosis</th><th>ICD-10</th><th>Status</th><th>Onset</th><th>Resolved</th><th>Source</th></tr></thead>
              <tbody>${probRows}</tbody>
            </table>
            <div class="table-footer">${seenProbs.size} unique conditions (deduplicated from 26 records) \u00b7 Particle Sandbox</div>
          </div>
        </div>`);

html = replaceSection(html, 'Encounters',
  `<!-- TAB: Encounters -->
        <div class="snapshot-panel" id="panel-encounters">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Date</th><th>Type</th><th>End Date</th><th>Provider</th><th>Notes</th><th>Source</th></tr></thead>
              <tbody>${encRows}</tbody>
            </table>
            <div class="table-footer">Showing 20 of 90 encounters \u00b7 Ordered by date descending \u00b7 Particle Sandbox</div>
          </div>
        </div>`);

html = replaceSection(html, 'Immunizations',
  `<!-- TAB: Immunizations -->
        <div class="snapshot-panel" id="panel-immunizations">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Vaccine</th><th>Product</th><th>Lot</th><th>Date</th><th>Site</th><th>Source</th></tr></thead>
              <tbody>${immRows}</tbody>
            </table>
          </div>
        </div>`);

html = replaceSection(html, 'Procedures',
  `<!-- TAB: Procedures -->
        <div class="snapshot-panel" id="panel-procedures">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Procedure</th><th>CPT</th><th>Date</th><th>Description</th><th>Provider</th><th>Source</th></tr></thead>
              <tbody>${procRows}</tbody>
            </table>
          </div>
        </div>`);

html = replaceSection(html, 'Vitals',
  `<!-- TAB: Vitals -->
        <div class="snapshot-panel" id="panel-vitals">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Vital Sign</th><th>Value</th><th>Ref Range</th><th>Flag</th><th>Date</th><th>Source</th></tr></thead>
              <tbody>${vitalRows}</tbody>
            </table>
            <div class="table-footer">Showing 20 of 217 vital sign readings \u00b7 Particle Sandbox</div>
          </div>
        </div>`);

html = replaceSection(html, 'Social History',
  `<!-- TAB: Social History -->
        <div class="snapshot-panel" id="panel-social">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Category</th><th>Detail</th><th>Additional Info</th><th>Last Screened</th><th>Source</th></tr></thead>
              <tbody>
                <tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-3);">No social history records in sandbox data \u2014 AI summary includes social history from clinical notes</td></tr>
              </tbody>
            </table>
          </div>
        </div>`);

html = replaceSection(html, 'Family History',
  `<!-- TAB: Family History -->
        <div class="snapshot-panel" id="panel-family">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Relation</th><th>Condition</th><th>ICD-10</th><th>Age at Dx</th><th>Outcome</th><th>Source</th></tr></thead>
              <tbody>
                <tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-3);">No family history records in sandbox data</td></tr>
              </tbody>
            </table>
          </div>
        </div>`);

// 8. Trust badge
html = html.replace(
  /Powered by Particle Health.*?Surescripts/,
  'Real data from Particle Health Sandbox \u2014 ' + d.recordSources.length + ' record sources \u00b7 ' + d.documentReferences.length + ' documents \u00b7 ' + d.aICitations.length + ' AI citations \u00b7 Queried via API v2'
);

// 9. Voiceover s3
html = html.replace(
  /s3: "In seconds[\s\S]*?the room\."/,
  's3: "This is real data from the Particle Health sandbox. Elvira Valadez, a fifty-five year old female with sixteen unique conditions including congestive heart failure, coronary artery disease, hypertension, and diabetes. Eleven medications. Thirty-six unique lab results. Ninety encounters across eight hundred forty-three record sources. And the AI clinical summary synthesizes it all, flagging critical information like her anaphylaxis history and reduced ejection fraction."'
);

fs.writeFileSync(path.join(root, 'clinic-demo-particle.html'), html);
console.log('Done. File size:', html.length, 'chars');
console.log('Allergies:', allergenNames.length);
console.log('Medications:', seenMeds.size);
console.log('Problems:', seenProbs.size);
console.log('Labs:', labs.length);
console.log('Encounters: 20 of 90');
console.log('Immunizations:', seenImms.size);
console.log('Procedures:', d.procedures.length);
console.log('Vitals: 20 of 217');
