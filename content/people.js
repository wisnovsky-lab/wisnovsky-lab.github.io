/* PEOPLE
   Team photos go in the images/web folder: roughly square, about 600 px wide, under ~200 KB.
   Put the photo's file name in "photo". Cards appear in the order listed here.

   TEMPLATE for a team member (copy from { to },):
  {
    name: "",
    role: "PhD Candidate",
    photo: "team-firstname-lastname.jpg"
  },

   When someone leaves: delete their entry from the team list and add them to the alumni list below.
*/

/* "Postdoctoral fellows & staff" on the People page */
LAB.staff = [
  {
    name: "Dr. John Daly",
    role: "Postdoctoral Fellow",
    photo: "team-dr-john-daly.jpg"
  },
  {
    name: "Dr. Tigist Batu",
    role: "Postdoctoral Fellow",
    photo: "team-dr-tigist-batu.jpg"
  },
  {
    name: "Jimmy Kim",
    role: "Research Technician",
    photo: "team-jimmy-kim.jpg"
  }
];

/* "Graduate students" on the People page */
LAB.students = [
  {
    name: "Natalie Stewart",
    role: "PhD Candidate",
    photo: "team-natalie-stewart.jpg"
  },
  {
    name: "Vignesh Krishnamoorthy",
    role: "PhD Candidate",
    photo: "team-vignesh-krishnamoorthy.jpg"
  },
  {
    name: "Angeline Wu",
    role: "PhD Candidate",
    photo: "team-angeline-wu.jpg"
  },
  {
    name: "Lidia Piatnitca",
    role: "PhD Candidate",
    photo: "team-lidia-piatnica.jpg"
  },
  {
    name: "Halen Kovacs",
    role: "PhD Candidate",
    photo: "team-halen-kovacs-2.jpg"
  },
  {
    name: "Anjali Parthasarathy",
    role: "PhD Student",
    photo: "team-anjali-parthasarathy.jpg"
  },
  {
    name: "Andrew Huang",
    role: "MSc Student",
    photo: "team-andrew-huang.jpg"
  }
];

/* ALUMNI
   Sorted automatically, most recent year in "inLab" first.

   TEMPLATE:
  {
    name: "",
    inLab: "MSc, 2026",
    nowAt: ""
  },
*/
LAB.alumni = [
  {
    name: "Olivia Drummond-Guy",
    inLab: "MSc, 2024",
    nowAt: "PhD, Medical Biophysics, University of Toronto"
  },
  {
    name: "Annabel Chen",
    inLab: "Co-op research technician, 2023–2024",
    nowAt: "MSc, NYU"
  },
  {
    name: "Sophia Mair",
    inLab: "Visiting international research student, 2023–2024",
    nowAt: "Technical Author, Bachem"
  },
  {
    name: "May Zhao",
    inLab: "Co-op research technician, 2022",
    nowAt: "Optometry Program, University of Waterloo"
  },
  {
    name: "Cassie Huang",
    inLab: "Research Technician, 2025–2026",
    nowAt: "MD Program, University of British Columbia"
  },
  {
    name: "Mohammed Al-Seragi",
    inLab: "Co-op research technician, 2025–2026",
    nowAt: "MD Program, University of British Columbia"
  },
  {
    name: "Lucie Wang",
    inLab: "Co-op research technician, 2025–2026",
    nowAt: "BSc, UBC"
  }
];
