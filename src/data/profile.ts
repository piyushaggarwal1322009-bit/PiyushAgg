export const profile = {
  name: "Piyush Aggarwal",
  shortName: "Piyush",
  location: "Delhi, India",
  university: "SRM University, Sonepat",
  degree: "B.Tech in Computer Science Engineering",
  educationStatus: "In progress",
  role: "Full-stack Developer",
  availability: {
    enabled: false,
    label: "Open to internships",
    year: "2026",
  },
  email: "piyushaggarwal1322009@gmail.com",
  github: "https://github.com/piyushaggarwal1322009-bit",
  linkedin: "https://www.linkedin.com/in/piyush-aggarwal-8602183b1",
  tagline: "I learn by building, break things to understand them, and turn ideas into working products.",
  intro:
    "I’m a student developer interested in software, AI, full-stack engineering and building products that solve real problems.",
  philosophy: [
    {
      title: "Build over theory",
      text: "Understanding becomes deeper when an idea is turned into something people can actually use."
    },
    {
      title: "Stay curious",
      text: "Technology changes quickly. I would rather keep learning than become comfortable with one stack."
    },
    {
      title: "Solve real problems",
      text: "A good project should have a reason to exist beyond demonstrating a technology."
    },
    {
      title: "Keep improving",
      text: "Every project is a chance to improve engineering judgment, product thinking and execution."
    }
  ],
  previousSchools: [
    { level: "Class 12", name: "Darshan Academy", status: "Completed" },
    { level: "Class 10", name: "Dayanand Public School", status: "Completed" }
  ]
};

export const technicalArsenal = [
  { number: "01", category: "Languages", technologies: ["HTML", "SQL", "Python"], accent: "#e58a52", learningProgress: 72 },
  { number: "02", category: "Frontend", technologies: ["React", "Next.js", "TypeScript"], accent: "#75aef5", learningProgress: 68 },
  { number: "03", category: "Backend", technologies: ["Node.js", "Express", "FastAPI"], accent: "#54c5b2", learningProgress: 61 },
  { number: "04", category: "AI / ML", technologies: ["LLMs", "Generative AI", "AI APIs"], accent: "#b3a0dc", learningProgress: 76 },
  { number: "05", category: "Databases", technologies: ["PostgreSQL", "Supabase", "MongoDB"], accent: "#83c58a", learningProgress: 64 },
  { number: "06", category: "Tools", technologies: ["Git", "GitHub", "Vercel", "Testing"], accent: "#a4a8ae", learningProgress: 79 },
  { number: "07", category: "APIs", technologies: ["REST API", "FastAPI", "Groq API"], accent: "#59c7d4", learningProgress: 58 },
] as const;
