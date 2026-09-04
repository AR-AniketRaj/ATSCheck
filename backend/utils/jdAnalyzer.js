// utils/jdAnalyzer.js

const technicalSkills = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "c#",
  "react",
  "react.js",
  "node",
  "node.js",
  "express",
  "express.js",
  "mongodb",
  "mongoose",
  "sql",
  "mysql",
  "postgresql",
  "html",
  "css",
  "git",
  "github",
  "docker",
  "aws",
  "azure",
  "rest api",
  "restful api",
  "jwt",
  "bootstrap",
  "machine learning",
  "artificial intelligence",
  "sdlc",
  "data structures",
  "algorithms",
  "spring",
  "spring boot",
  "angular",
  "vue",
  "next.js",
  "php",
  "ruby",
  "kotlin",
  "swift",
];

const softSkills = [
  "teamwork",
  "team",
  "collaboration",
  "communication",
  "problem solving",
  "problem-solving",
  "leadership",
  "time management",
  "adaptability",
  "critical thinking",
  "creativity",
  "analytical skills",
];

const jobKeywords = [
  "software development",
  "software developer",
  "development",
  "coding",
  "programming",
  "debugging",
  "deployment",
  "code review",
  "coding standards",
  "best practices",
  "technical documentation",
  "requirements gathering",
  "software development life cycle",
  "sdlc",
  "performance optimization",
  "troubleshooting",
  "testing",
  "maintenance",
  "implementation",
  "internship",
  "intern",
  "real-world projects",
];

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

//  REPLACE YOUR OLD findMatches() WITH THIS

function findMatches(text, list) {
  return list.filter((item) => {
    const normalizedItem = item
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`\\b${normalizedItem}\\b`, "i");

    return regex.test(text);
  });
}

function detectExperienceLevel(text) {
  if (text.includes("internship") || text.includes("intern")) {
    return "internship";
  }

  if (
    text.includes("entry level") ||
    text.includes("entry-level") ||
    text.includes("fresher") ||
    text.includes("graduate")
  ) {
    return "entry-level";
  }

  if (
    text.includes("senior") ||
    text.includes("lead developer") ||
    text.includes("5+ years") ||
    text.includes("6+ years")
  ) {
    return "senior";
  }

  if (
    text.includes("mid level") ||
    text.includes("mid-level") ||
    text.includes("2+ years") ||
    text.includes("3+ years")
  ) {
    return "mid-level";
  }

  return "not specified";
}

function analyzeJobDescription(jobDescription) {
  if (
    !jobDescription ||
    typeof jobDescription !== "string" ||
    jobDescription.trim().length === 0
  ) {
    return {
      success: false,
      message: "Job description is required.",
    };
  }

  const text = normalizeText(jobDescription);

  const technicalSkillsFound = findMatches(text, technicalSkills);

  const softSkillsFound = findMatches(text, softSkills);

  const keywordsFound = findMatches(text, jobKeywords);

  const experienceLevel = detectExperienceLevel(text);

  return {
    success: true,

    technicalSkills: technicalSkillsFound,

    softSkills: softSkillsFound,

    keywords: keywordsFound,

    experienceLevel,

    totalWords: text.split(" ").filter(Boolean).length,
  };
}

module.exports = {
  analyzeJobDescription,
};
