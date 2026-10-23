# Wisnovsky Lab website

## The easy way: the website editor

Go to **[www.wisnovskylab.ca/admin/](https://www.wisnovskylab.ca/admin/)** and use the forms to:

- **Add a publication.** Paste its DOI and click **Fill in**; the title, authors, journal and year fill themselves.
- **Post news,** with an optional photo.
- **Add or edit team members,** reorder them, or move someone to alumni.
- **Add lab life photos.**

Photos are shrunk to the right size automatically. Click **Save**, and the website updates about a minute later.

The first time, the editor asks for a GitHub access token and shows how to make one (about 2 minutes). You need to be a member of the
[wisnovsky-lab](https://github.com/wisnovsky-lab) organization on GitHub.

---

## Editing the files directly

You can also edit the files on GitHub. Everything you'd normally change lives in the **`content`** folder:

| To change… | Edit this file |
|---|---|
| Publications | `content/publications.js` |
| News posts (papers, comps, defences, awards, events) | `content/news.js` |
| Team members and alumni | `content/people.js` |
| Lab life photos | `content/photos.js` |
| Any photo (team, news, lab life) | upload it to `images/web` |

Each file starts with instructions and a **template** you can copy.

---

## Editing a file on GitHub

1. Open the file on github.com (for example, click `content`, then `news.js`).
2. Click the **pencil icon** (✏️ "Edit this file") at the top right.
3. Make your change (see the examples below).
4. Click **Commit changes…**, write a short note like "Add Natalie's defence", and click **Commit changes** again.

The site updates about a minute later.

**The one rule:** every entry is wrapped in `{ … }`, and entries are separated by a comma.
Text goes inside straight double quotes `"…"`. If your text needs a double quote, use curly quotes “ ” instead.

---

## Add a publication

In `content/publications.js`, paste this right below the line `LAB.publications = [` and fill it in:

```js
  {
    type: "lab",
    year: 2026,
    title: "Title of the paper",
    authors: "First Author, Second Author, Simon Wisnovsky",
    journal: "Journal Name",
    details: "12(3), 100–110",
    doi: "https://doi.org/10.xxxx/xxxxx"
  },
```

- `type` decides which list it goes in: `"lab"`, `"preprint"`, `"postdoc"` or `"phd"`.
- Simon's name is bolded automatically.
- When a preprint is published, change its `type` to `"lab"` and update the journal, details and doi.

## Post a news update

In `content/news.js`, paste this below `LAB.news = [`:

```js
  {
    date: "2026-11",
    type: "milestone",
    title: "Natalie Stewart defends her PhD",
    summary: "Natalie successfully defended her thesis on Siglec-7 ligands. Congratulations, Dr. Stewart!"
  },
```

- `type` is `"paper"`, `"milestone"`, `"award"` or `"event"`.
- The order in the file doesn't matter, because the newest date shows first.
- **Optional extras** (add them before the closing `}`, each line ending in a comma except the last):
  - `photo: "2026-defence.jpg",` and `photoAlt: "Natalie with her committee",` add a photo. Upload the photo first (see below).
  - `body: ["First paragraph.", "Second paragraph."],` adds longer text for the post's own page.
  - `link: "https://doi.org/…",` and `linkText: "Read the paper",` add a button.
- **Two example posts** are marked `example: true`. Delete them once you have real news.

## Add a lab life photo

1. Upload the photo to `images/web` (see below).
2. In `content/photos.js`, fill in one of the empty placeholders, or paste a new entry:

```js
  {
    photo: "2026-holiday-party.jpg",
    caption: "Holiday party",
    date: "2026-12",
    alt: "Lab members around a table at the holiday party"
  },
```

Delete placeholder entries (`photo: ""`) you don't need.

## Team members

In `content/people.js`:

- **New member:** upload their photo to `images/web`, then add an entry to `LAB.staff` (postdocs and staff) or `LAB.students` (grad students):
  ```js
    {
      name: "Jane Doe",
      role: "MSc Student",
      photo: "team-jane-doe.jpg"
    },
  ```
- **Change a role** (e.g. MSc Student to PhD Candidate): edit the text in `role`.
- **Someone leaves:** delete their entry and add them to `LAB.alumni`:
  ```js
    {
      name: "Jane Doe",
      inLab: "MSc, 2026",
      nowAt: "PhD, University of Toronto"
    },
  ```
  Alumni sort themselves by year.

Cards show in the order they're listed.

---

## Uploading a photo

1. Shrink it first. Very large photos make the site slow.
   - **Team portraits:** about 600 px wide, roughly square.
   - **News and lab life photos:** about 1600 px wide.
   - **Size:** keep each file under ~400 KB.
   - **On a Mac:** open it in Preview, choose Tools → Adjust Size, then File → Export as JPEG.
   - **Anywhere:** you can use [squoosh.app](https://squoosh.app).
2. Name it in lowercase with dashes, like `team-jane-doe.jpg` or `2026-retreat.jpg`. File names are case-sensitive, so `Jane.JPG` and `jane.jpg` are different files.
3. On GitHub, open the `images/web` folder, choose **Add file → Upload files**, drag the photo in and click **Commit changes**.
4. Use exactly that file name in the content file.

---

## If something goes wrong

- **GitHub checks your changes automatically.** A green ✓ next to your commit means all is well.
- **A red ✗ means it found a problem.** You'll get an email, and you can click the ✗ then **Details** for a plain-English message, such as *"news #3: date "Nov 2026" should look like "2026-10""* or *"the file can't be read (around line 40). Usually a missing comma…"*.
- **If a file has a typo,** only that section of the site goes blank (for example, the news list), and the rest of the site keeps working. Fix the typo and it comes back.
- **To undo a change,** open the file, click **History**, find the last good version and copy its text back.

## Previewing on your own computer

Download the repository (green **Code** button → **Download ZIP**), unzip it and double-click `index.html`.
Nothing goes live until it's committed on GitHub.

If you have Node installed, `node tools/check-content.js` runs the same check GitHub does.

---

## For whoever maintains the site

- **Structure:** `index.html` holds the page layout, styles and code. It loads the four files in `content/`, which each fill in part of `window.LAB`.
- **Editor:** `admin/` is the form-based editor. `admin/lib.js` reads and rewrites the content files and saves through the GitHub API, one commit per change, as the signed-in person. Add `?branch=some-branch` to the editor's address to try it out without touching the live site.
- **Hosting:** GitHub Pages from the `main` branch, root folder.
- **Launching:** the repo is private and the site is offline until launch. To launch:
  1. Rename the repo to `wisnovsky-lab.github.io`.
  2. Make it public.
  3. Turn on Pages (Settings → Pages → `main` / root).
  4. For the `wisnovskylab.ca` domain, add it under Settings → Pages → Custom domain and point the DNS at GitHub.
- **Not published:** full-size originals, old mockups and design-tool files stay out of the repo (see `.gitignore`).
