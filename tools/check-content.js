#!/usr/bin/env node
/* Checks the files in content/ for common mistakes before they reach the site.
   Run locally with:  node tools/check-content.js
   GitHub also runs it on every change (see .github/workflows/check-content.yml). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const errors = [], warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

const LAB = {};
for (const file of ["publications.js", "news.js", "people.js", "photos.js"]) {
  const rel = "content/" + file;
  const code = fs.readFileSync(path.join(root, rel), "utf8");
  try {
    vm.runInNewContext(code, {LAB}, {filename: rel});
  } catch (e) {
    const where = (e.stack.match(new RegExp(rel.replace(".", "\\.") + ":(\\d+)")) || [])[1];
    err(rel, `the file can't be read${where ? ` (around line ${where})` : ""}: ${e.message}. ` +
      `Usually a missing comma between entries, a missing quote, or a stray character.`);
  }
}

const imageExists = name => fs.existsSync(path.join(root, "images/web", name));
const checkImage = (rel, label, name) => {
  if (!name) return;
  if (!imageExists(name)) return err(rel, `${label}: photo "${name}" isn't in images/web (check the spelling and capitals).`);
  const kb = fs.statSync(path.join(root, "images/web", name)).size / 1024;
  if (kb > 600) warn(rel, `${label}: "${name}" is ${Math.round(kb)} KB. Shrinking it under ~400 KB will make the page load faster.`);
};
const need = (rel, label, o, keys) => keys.forEach(k => {
  if (o[k] == null || String(o[k]).trim() === "") err(rel, `${label}: "${k}" is missing or empty.`);
});
const list = (rel, name) => {
  if (!(name in LAB)) return (errors.some(e => e.startsWith(rel)) ? [] : (err(rel, `LAB.${name} is missing.`), []));
  if (!Array.isArray(LAB[name])) return err(rel, `LAB.${name} should be a list in [ ].`), [];
  return LAB[name];
};

/* publications */
{
  const rel = "content/publications.js";
  list(rel, "publications").forEach((p, i) => {
    const label = `publication #${i + 1} (${p.title ? `"${String(p.title).slice(0, 50)}…"` : "no title"})`;
    need(rel, label, p, ["type", "year", "title", "authors", "journal"]);
    if (p.type && !["lab", "preprint", "postdoc", "phd"].includes(p.type))
      err(rel, `${label}: type "${p.type}" should be "lab", "preprint", "postdoc" or "phd".`);
    if (p.year && !/^(19|20)\d\d$/.test(String(p.year))) err(rel, `${label}: year "${p.year}" should look like 2026.`);
    if (p.doi && !/^(https?:\/\/|10\.\d{4,}\/)/.test(String(p.doi).trim()))
      err(rel, `${label}: doi "${p.doi}" should start with https://doi.org/ or 10.`);
    if (!p.doi) warn(rel, `${label}: no doi, so the entry has no link.`);
  });
}

/* news */
{
  const rel = "content/news.js";
  const slugs = new Set();
  list(rel, "news").forEach((n, i) => {
    const label = `news #${i + 1} (${n.title ? `"${String(n.title).slice(0, 50)}"` : "no title"})`;
    need(rel, label, n, ["date", "type", "title", "summary"]);
    if (n.date && !/^(19|20)\d\d(-(0[1-9]|1[0-2]))?$/.test(String(n.date)))
      err(rel, `${label}: date "${n.date}" should look like "2026-10" or "2026".`);
    if (n.type && !["paper", "milestone", "award", "event"].includes(n.type))
      err(rel, `${label}: type "${n.type}" should be "paper", "milestone", "award" or "event".`);
    if (n.link && !/^(https?:\/\/|#\/|mailto:)/.test(n.link))
      err(rel, `${label}: link "${n.link}" should start with https:// (or #/ for a page on this site).`);
    if (n.body != null && !Array.isArray(n.body) && typeof n.body !== "string")
      err(rel, `${label}: body should be ["paragraph", "paragraph"].`);
    checkImage(rel, label, n.photo);
    if (n.photo && !n.photoAlt) warn(rel, `${label}: add photoAlt, a short description of the photo.`);
    if (n.slug) { if (slugs.has(n.slug)) err(rel, `${label}: slug "${n.slug}" is used twice.`); slugs.add(n.slug); }
    if (n.example) warn(rel, `${label}: still marked example: true (shows an "Example" badge).`);
  });
}

/* people */
{
  const rel = "content/people.js";
  for (const group of ["staff", "students"]) list(rel, group).forEach((m, i) => {
    const label = `${group} #${i + 1} (${m.name || "no name"})`;
    need(rel, label, m, ["name", "role", "photo"]);
    checkImage(rel, label, m.photo);
  });
  list(rel, "alumni").forEach((a, i) => {
    const label = `alumni #${i + 1} (${a.name || "no name"})`;
    need(rel, label, a, ["name", "inLab"]);
    if (a.inLab && !/(19|20)\d\d/.test(a.inLab)) warn(rel, `${label}: "inLab" has no year, so it sorts to the end.`);
  });
}

/* lab life photos */
{
  const rel = "content/photos.js";
  list(rel, "photos").forEach((p, i) => {
    const label = `photo #${i + 1} (${p.caption || "no caption"})`;
    need(rel, label, p, ["caption"]);
    checkImage(rel, label, p.photo);
    if (p.date && !/^(19|20)\d\d(-(0[1-9]|1[0-2]))?$/.test(String(p.date)))
      err(rel, `${label}: date "${p.date}" should look like "2026-10" or "2026".`);
  });
}

for (const w of warnings) console.log("Note:  " + w);
for (const e of errors) console.log("ERROR: " + e);
if (errors.length) {
  console.log(`\n${errors.length} problem${errors.length > 1 ? "s" : ""} to fix. The site skips a content file it can't read, so that section would show up empty.`);
  process.exit(1);
}
console.log(`\nAll content looks good (${warnings.length} note${warnings.length === 1 ? "" : "s"}).`);
