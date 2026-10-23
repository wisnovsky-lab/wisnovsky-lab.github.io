/* NEWS
   Each entry becomes a card on the News page and its own post page.
   Order doesn't matter: the newest date shows first. The three newest also appear on the home page.

   date:      "2026-10"  (year-month)  or just "2026"
   type:      "paper"  "milestone"  "award"  or  "event"
   title:     the headline
   summary:   one or two sentences, shown on the card

   Optional (leave the line out if you don't need it):
   body:      longer text for the post page, one "..." per paragraph:
                body: ["First paragraph.", "Second paragraph."],
              Without it, the post page shows the summary.
   photo:     an image file in images/web, e.g. "2026-retreat.jpg" (about 1600 px wide, under ~400 KB)
   photoAlt:  a short description of the photo for screen-reader users
   link:      a web address, or "#/publications" for the Publications page
   linkText:  the button text for that link, e.g. "Read the paper"
   label:     replaces the tag text, e.g. "Preprint"
   example:   true marks a placeholder. Delete those entries once real posts are in.

   TEMPLATE (copy from { to },):
  {
    date: "2026-11",
    type: "milestone",
    title: "",
    summary: ""
  },
*/
LAB.news = [
  {
    date: "2026-10",
    type: "milestone",
    title: "Lidia passes comprehensive exam",
    summary: "Lidia Piatnitca successfully passes her PhD comprehensive exam and is officially a PhD candidate. Congratulations!",
    example: true
  },
  {
    date: "2026-08",
    type: "paper",
    title: "Lectin-based magnetic CRISPR screens, out in Cell Reports Methods",
    summary: "Jimmy Kim and Halen Kovacs report a rapid way to discover regulators of cell-surface glycosylation using a lectin-based magnetic CRISPR screen.",
    link: "#/publications",
    linkText: "See the paper"
  },
  {
    date: "2026-04",
    type: "paper",
    title: "Mapping cancer glycome remodeling with CRISPRa, in Cell Genomics",
    summary: "Led by John Daly with Lidia Piatnitca, Mohammed Al-Seragi and Vignesh Krishnamoorthy, CRISPR activation screens chart the genomic landscape of glycome remodeling in cancer.",
    link: "#/publications",
    linkText: "See the paper"
  },
  {
    date: "2026-02",
    type: "paper",
    label: "Preprint",
    title: "New preprint: cancer-specific regulators of hyaluronan binding",
    summary: "A genome-wide CRISPR screen reveals regulators of hyaluronan binding and cellular invasion in cancer cells.",
    link: "https://doi.org/10.64898/2026.02.06.704476",
    linkText: "Read on bioRxiv"
  },
  {
    date: "2025-10",
    type: "event",
    title: "Lab members present at a glycobiology conference",
    summary: "Placeholder for talks, posters and conference trips. Replace it with a real update or delete it.",
    example: true
  },
  {
    date: "2025-02",
    type: "paper",
    title: "ST3GAL4 drives immune evasion in AML, in Leukemia",
    summary: "Vignesh Krishnamoorthy and colleagues show that the glycosyltransferase ST3GAL4 helps leukemia cells evade the immune system by building ligands for the checkpoint receptor Siglec-9.",
    link: "#/publications",
    linkText: "See the paper"
  },
  {
    date: "2025",
    type: "paper",
    title: "Polysialic acid restrains anticancer immunity, in Frontiers in Oncology",
    summary: "Olivia Drummond-Guy and colleagues find that polysialic acid is upregulated on activated immune cells and negatively regulates anticancer immune activity.",
    link: "#/publications",
    linkText: "See the paper"
  },
  {
    date: "2024",
    type: "milestone",
    title: "Olivia Drummond-Guy completes MSc",
    summary: "Olivia has moved on to a PhD in Medical Biophysics at the University of Toronto. Congratulations!"
  },
  {
    date: "2024-02",
    type: "paper",
    title: "Siglec-7 engages T-cell ligands, in the Journal of Biological Chemistry",
    summary: "Natalie Stewart and colleagues show that the glyco-immune checkpoint receptor Siglec-7 interacts with T-cell ligands and regulates T-cell activation.",
    link: "#/publications",
    linkText: "See the paper"
  },
  {
    date: "2021-07",
    type: "milestone",
    title: "The Wisnovsky Lab opens at UBC",
    summary: "Simon Wisnovsky starts the lab in the Faculty of Pharmaceutical Sciences at the University of British Columbia."
  }
];
