export type ProjectTemplate = "interview-studio" | "collaboration-workspace";

export type Project = {
  name: string;
  eyebrow: string;
  description: string;
  problem: string;
  value: string;
  status: string;
  stack: string[];
  highlights: string[];
  github: string;
  live?: string;
  previewKey?: string;
  previewLabel?: string;
  template?: ProjectTemplate;
};

export const projects: Project[] = [
  {
    name: "Grillr",
    eyebrow: "Voice interview coach",
    template: "interview-studio",
    description:
      "A voice-first interview practice app that asks role-specific questions, transcribes answers, and returns structured coaching.",
    problem: "Interview practice is hard to repeat and difficult to assess without a consistent interviewer.",
    value: "A guided answer-to-feedback loop makes practice more focused and repeatable.",
    status: "In development",
    stack: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Supabase",
      "WebSockets",
      "Web Audio API"
    ],
    highlights: [
      "Role-specific behavioral, technical, and HR interviews",
      "Speech transcription, communication analysis, and follow-up questions",
      "Structured answer evaluation with retry and improvement tracking"
    ],
    github: "https://github.com/Sarthak-madan334/Grillr",
    live: "https://grillr3.vercel.app",
    previewKey: "grillr",
    previewLabel: "Grillr · Interview coach",
  },
  {
    name: "Synkro",
    eyebrow: "Real-time collaboration · Team workspace",
    template: "collaboration-workspace",
    description:
      "A real-time collaborative workspace where teams create or join shared rooms to work together on documents, notebooks, presentations, and spreadsheets in one place.",
    problem: "Scattered files and disconnected tools make team collaboration fragmented, while concurrent edits risk accidental overwrites.",
    value: "Shared rooms with invite codes, synchronized member presence, and field-level collision review keep team work unified and conflict-free.",
    status: "Collaborative workspace",
    stack: [
      "React",
      "Node.js",
      "Express",
      "Socket.IO",
      "MongoDB Atlas",
      "Vite",
      "Capacitor"
    ],
    highlights: [
      "Shared rooms with invite codes and member presence",
      "Real-time collaboration using Socket.IO",
      "Persistent notes/files, revision history, and owner restore",
      "Editors for documents, notebooks, presentations, and spreadsheets",
      "Concurrent same-field edits prompt users to review before overwriting"
    ],
    github: "https://github.com/Sarthak-madan334/collab-workspace",
    live: "https://collab-workspace-three.vercel.app",
    previewKey: "synkro",
    previewLabel: "Synkro · Collaborative workspace"
  }
];