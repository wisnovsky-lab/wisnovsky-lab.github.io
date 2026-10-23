/* Editor logic with no page code in it: reading and rewriting the content files,
   DOI lookup, photo shrinking and saving to GitHub. Used by admin/index.html. */
(function (root) {
  "use strict";

  const OWNER = "wisnovsky-lab";
  const REPO = "wisnovsky-lab.github.io";
  const API = "https://api.github.com";

  /* field order for each list, matching how the content files are written */
  const LISTS = {
    publications: {file: "content/publications.js", fields: ["type", "year", "title", "authors", "journal", "details", "doi"], keepEmpty: ["details"]},
    news:         {file: "content/news.js", fields: ["date", "type", "label", "title", "summary", "body", "link", "linkText", "photo", "photoAlt", "slug", "example"]},
    staff:        {file: "content/people.js", fields: ["name", "role", "photo"]},
    students:     {file: "content/people.js", fields: ["name", "role", "photo"]},
    alumni:       {file: "content/people.js", fields: ["name", "inLab", "nowAt"]},
    photos:       {file: "content/photos.js", fields: ["photo", "caption", "date", "alt", "crop"], keepEmpty: ["photo"]}
  };

  /* ---------- content files ---------- */

  /* index of the "]" that closes the "[" at `open`, skipping strings and comments */
  function matchBracket(src, open) {
    let depth = 0;
    for (let i = open; i < src.length; i++) {
      const c = src[i];
      if (c === '"' || c === "'" || c === "`") {
        for (i++; i < src.length && src[i] !== c; i++) if (src[i] === "\\") i++;
      } else if (c === "/" && src[i + 1] === "/") {
        i = src.indexOf("\n", i); if (i < 0) break;
      } else if (c === "/" && src[i + 1] === "*") {
        i = src.indexOf("*/", i + 2); if (i < 0) break; i++;
      } else if (c === "[") depth++;
      else if (c === "]" && --depth === 0) return i;
    }
    throw new Error("Couldn't find the end of the list. The file may have a typo.");
  }

  /* the source with every comment blanked out (same length), so instructions that quote
     "LAB.news = [" aren't mistaken for the real list */
  function maskComments(src) {
    let out = "";
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      if (c === '"' || c === "'" || c === "`") {
        let j = i + 1;
        for (; j < src.length && src[j] !== c; j++) if (src[j] === "\\") j++;
        out += src.slice(i, j + 1); i = j;
      } else if (c === "/" && (src[i + 1] === "/" || src[i + 1] === "*")) {
        let j = src[i + 1] === "/" ? src.indexOf("\n", i) : src.indexOf("*/", i + 2) + 2;
        if (j < (src[i + 1] === "/" ? 0 : 2)) j = src.length;
        out += src.slice(i, j).replace(/[^\n]/g, " "); i = j - 1;
      } else out += c;
    }
    return out;
  }

  function findList(src, key) {
    const m = new RegExp("LAB\\." + key + "\\s*=\\s*\\[").exec(maskComments(src));
    if (!m) throw new Error(`LAB.${key} wasn't found in the file.`);
    const start = m.index + m[0].length - 1;
    return {start, end: matchBracket(src, start)};
  }

  function readList(src, key) {
    const {start, end} = findList(src, key);
    // the lab's own content file, the same code the website runs
    return Function('"use strict"; return (' + src.slice(start, end + 1) + ");")();
  }

  function formatValue(v) {
    if (Array.isArray(v)) return "[\n" + v.map(x => "      " + JSON.stringify(x)).join(",\n") + "\n    ]";
    return JSON.stringify(v);
  }

  function formatList(arr, key) {
    const {fields, keepEmpty = []} = LISTS[key];
    if (!arr.length) return "[]";
    return "[\n" + arr.map(o => {
      const keys = [...fields, ...Object.keys(o).filter(k => !fields.includes(k))];
      const lines = keys
        .filter(k => keepEmpty.includes(k) || !(o[k] === undefined || o[k] === null || o[k] === "" || o[k] === false ||
          (Array.isArray(o[k]) && !o[k].length)))
        .map(k => `    ${k}: ${formatValue(o[k] ?? "")}`);
      return "  {\n" + lines.join(",\n") + "\n  }";
    }).join(",\n") + "\n]";
  }

  function writeList(src, key, arr) {
    const {start, end} = findList(src, key);
    return src.slice(0, start) + formatList(arr, key) + src.slice(end + 1);
  }

  /* ---------- small helpers ---------- */

  const slugify = t => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

  const decodeEntities = s => String(s || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ").trim();

  const cleanDoi = s => String(s || "").trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").trim();

  /* ---------- DOI lookup (Crossref) ---------- */

  async function lookupDoi(input) {
    const doi = cleanDoi(input);
    if (!/^10\.\d{4,}\/\S+$/.test(doi)) throw new Error("That doesn't look like a DOI. It should start with 10. or https://doi.org/");
    const r = await fetch("https://api.crossref.org/works/" + encodeURIComponent(doi));
    if (r.status === 404) throw new Error("No paper found for that DOI. Check it for typos.");
    if (!r.ok) throw new Error("The DOI lookup service didn't answer. Try again, or fill the fields in by hand.");
    const m = (await r.json()).message;
    // the issue's year is what citations use; online-first dates can be a year earlier
    const year = ((m["published-print"] || m.issued || m.published || m["published-online"] || {})["date-parts"] || [[]])[0][0];
    const preprint = m.type === "posted-content";
    const vol = m.volume ? m.volume + (m.issue ? `(${m.issue})` : "") : "";
    const where = m.page || m["article-number"] || "";
    return {
      type: preprint ? "preprint" : "lab",
      year: year || "",
      title: decodeEntities((m.title || [])[0]),
      authors: (m.author || []).map(a => decodeEntities([a.given, a.family].filter(Boolean).join(" ") || a.name)).filter(Boolean).join(", "),
      journal: decodeEntities((m["container-title"] || [])[0] || (preprint && ((m.institution || [])[0] || {}).name) || m.publisher || ""),
      details: [vol, where.replace(/-/g, "–")].filter(Boolean).join(", "),
      doi: "https://doi.org/" + doi
    };
  }

  /* ---------- photos ---------- */

  /* shrinks a photo in the browser: returns a JPEG as base64 plus a preview URL.
     With `aspect` (width / height), it first crops the centre to that shape. */
  async function shrinkPhoto(file, maxW, maxH, aspect) {
    let bmp;
    try { bmp = await createImageBitmap(file, {imageOrientation: "from-image"}); }
    catch (e) {
      throw new Error("This photo couldn't be opened. iPhone HEIC photos need to be saved as JPEG first " +
        "(on a Mac: open in Preview, File → Export, choose JPEG).");
    }
    let sx = 0, sy = 0, sw = bmp.width, sh = bmp.height;
    if (aspect) {
      if (sw / sh > aspect) { sw = Math.round(sh * aspect); sx = Math.round((bmp.width - sw) / 2); }
      else { sh = Math.round(sw / aspect); sy = Math.round((bmp.height - sh) / 2); }
    }
    const scale = Math.min(1, maxW / sw, maxH / sh);
    const w = Math.round(sw * scale), h = Math.round(sh * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);   // transparent PNGs get a white background
    ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, w, h);
    const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", 0.84));
    const base64 = await new Promise(res => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result).split(",")[1]);
      fr.readAsDataURL(blob);
    });
    return {base64, url: URL.createObjectURL(blob), width: w, height: h, kb: Math.round(blob.size / 1024)};
  }

  /* ---------- GitHub ---------- */

  function GitHub(token, branch = "main") {
    const call = async (path, opts = {}) => {
      const r = await fetch(API + path, {
        ...opts,
        cache: "no-store",   // GitHub lets browsers reuse answers for 60 s, which would hide the newest version
        headers: {Authorization: "Bearer " + token, Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28", ...(opts.body ? {"Content-Type": "application/json"} : {})}
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        const err = new Error(body.message || r.statusText); err.status = r.status; throw err;
      }
      return r.status === 204 ? null : r.json();
    };
    const repo = `/repos/${OWNER}/${REPO}`;

    const decode = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, "")), c => c.charCodeAt(0)));

    async function readText(path, ref = branch) {
      const f = await call(`${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`);
      return decode(f.content);
    }

    async function exists(path, ref = branch) {
      try { await call(`${repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(ref)}`); return true; }
      catch (e) { if (e.status === 404) return false; throw e; }
    }

    /* checks the token can see the repo; returns the GitHub user name */
    async function whoami() {
      const user = await call("/user");
      const r = await call(repo);
      if (r.permissions && r.permissions.push === false) throw new Error("This GitHub account can view the website but can't edit it. Ask an owner of the wisnovsky-lab organization to add you.");
      return user.login;
    }

    /* Makes one commit. `build(read)` gets a function that reads files from the newest
       version and returns [{path, text} | {path, base64}]. If someone else saved in the
       meantime, it starts again from their version so nothing is overwritten. */
    async function save(message, build) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const head = (await call(`${repo}/git/ref/heads/${branch}`)).object.sha;
        const files = await build(path => readText(path, head));
        const baseTree = (await call(`${repo}/git/commits/${head}`)).tree.sha;
        const tree = [];
        for (const f of files) {
          const blob = await call(`${repo}/git/blobs`, {method: "POST", body: JSON.stringify(
            f.base64 != null ? {content: f.base64, encoding: "base64"} : {content: f.text, encoding: "utf-8"})});
          tree.push({path: f.path, mode: "100644", type: "blob", sha: blob.sha});
        }
        const newTree = await call(`${repo}/git/trees`, {method: "POST", body: JSON.stringify({base_tree: baseTree, tree})});
        const commit = await call(`${repo}/git/commits`, {method: "POST", body: JSON.stringify({message, tree: newTree.sha, parents: [head]})});
        try {
          await call(`${repo}/git/refs/heads/${branch}`, {method: "PATCH", body: JSON.stringify({sha: commit.sha})});
          return commit;
        } catch (e) { if (e.status !== 422) throw e; }   // someone else saved first: rebuild on top of theirs
      }
      throw new Error("Someone else is saving changes at the same time. Wait a moment and try again.");
    }

    return {readText, exists, whoami, save};
  }

  root.Editor = {OWNER, REPO, LISTS, findList, readList, formatList, writeList, slugify, cleanDoi, lookupDoi, shrinkPhoto, GitHub};
})(typeof window !== "undefined" ? window : globalThis);
