const calculateResumeScore = (resumeText) => {
  const resume = resumeText.toLowerCase().trim();

  const words = resume.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  let score = 0;

  // HELPER FUNCTIONS

  const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const containsTerm = (text, term) => {
    const escapedTerm = escapeRegex(term);

    const regex = new RegExp(`(?<![a-z0-9])${escapedTerm}(?![a-z0-9])`, "i");

    return regex.test(text);
  };

  const countOccurrences = (text, term) => {
    const escapedTerm = escapeRegex(term);

    const regex = new RegExp(`(?<![a-z0-9])${escapedTerm}(?![a-z0-9])`, "gi");

    const matches = text.match(regex);

    return matches ? matches.length : 0;
  };

  // PARSING - 8 POINTS

  let parsingScore = 0;

  if (resume.length > 100) {
    parsingScore += 3;
  }

  if (resume.length >= 500) {
    parsingScore += 2;
  }

  if (totalWords >= 100) {
    parsingScore += 2;
  }

  const readableCharacters = resume.match(/[a-zA-Z0-9]/g) || [];

  if (readableCharacters.length >= 300) {
    parsingScore += 1;
  }

  parsingScore = Math.min(parsingScore, 8);

  score += parsingScore;

  // STRUCTURE - 15 POINTS

  const sectionAliases = {
    summary: [
      "summary",
      "professional summary",
      "about me",
      "profile",
      "career objective",
      "objective",
    ],

    skills: [
      "skills",
      "technical skills",
      "core skills",
      "technical expertise",
    ],

    experience: [
      "experience",
      "work experience",
      "professional experience",
      "employment",
    ],

    education: ["education", "academic background", "academic qualification"],

    projects: [
      "projects",
      "personal projects",
      "academic projects",
      "project experience",
    ],

    certifications: ["certifications", "certificates", "licenses"],
  };

  const sectionsFound = [];

  Object.entries(sectionAliases).forEach(([section, aliases]) => {
    const found = aliases.some((alias) => containsTerm(resume, alias));

    if (found) {
      sectionsFound.push(section);
    }
  });

  let structureScore = 0;

  if (sectionsFound.includes("summary")) {
    structureScore += 2;
  }

  if (sectionsFound.includes("skills")) {
    structureScore += 4;
  }

  if (sectionsFound.includes("education")) {
    structureScore += 3;
  }

  if (
    sectionsFound.includes("experience") ||
    sectionsFound.includes("projects")
  ) {
    structureScore += 4;
  }

  if (sectionsFound.includes("certifications")) {
    structureScore += 2;
  }

  structureScore = Math.min(structureScore, 15);

  score += structureScore;

  // SKILL DATABASE

  const skillAliases = {
    javascript: ["javascript", "js", "ecmascript"],

    typescript: ["typescript", "ts"],

    react: ["react", "react.js"],

    node: ["node.js", "node"],

    express: ["express.js", "express"],

    mongodb: ["mongodb", "mongo db"],

    mongoose: ["mongoose"],

    sql: ["sql"],

    mysql: ["mysql"],

    postgresql: ["postgresql", "postgres"],

    python: ["python"],

    java: ["java"],

    "c++": ["c++"],

    "c#": ["c#", "c sharp"],

    html: ["html", "html5"],

    css: ["css", "css3"],

    git: ["git"],

    github: ["github"],

    docker: ["docker"],

    aws: ["aws", "amazon web services"],

    azure: ["azure"],

    "rest api": ["rest api", "restful api", "rest apis", "restful apis"],

    jwt: ["jwt", "json web token", "json web tokens"],

    bootstrap: ["bootstrap"],

    redux: ["redux"],

    "next.js": ["next.js", "nextjs", "next js"],

    redis: ["redis"],

    firebase: ["firebase"],

    graphql: ["graphql"],

    postman: ["postman"],

    figma: ["figma"],

    tailwind: ["tailwind", "tailwind css"],

    "spring boot": ["spring boot", "springboot"],

    "machine learning": ["machine learning", "machine-learning"],

    "artificial intelligence": [
      "artificial intelligence",
      "artificial-intelligence",
    ],
  };

  // FIND UNIQUE SKILLS

  const skillsFound = [];
  const skillsUsage = {};

  Object.entries(skillAliases).forEach(([skillName, aliases]) => {
    let occurrences = 0;

    aliases.forEach((alias) => {
      occurrences += countOccurrences(resume, alias);
    });

    if (occurrences > 0) {
      skillsFound.push(skillName);
      skillsUsage[skillName] = occurrences;
    }
  });

  // SKILLS - 25 POINTS

  // SKILL COVERAGE - 8

  let skillCoverageScore = 0;

  const skillCount = skillsFound.length;

  if (skillCount >= 18) {
    skillCoverageScore = 8;
  } else if (skillCount >= 15) {
    skillCoverageScore = 7;
  } else if (skillCount >= 12) {
    skillCoverageScore = 6;
  } else if (skillCount >= 9) {
    skillCoverageScore = 5;
  } else if (skillCount >= 6) {
    skillCoverageScore = 4;
  } else if (skillCount >= 4) {
    skillCoverageScore = 3;
  } else if (skillCount >= 2) {
    skillCoverageScore = 2;
  } else if (skillCount === 1) {
    skillCoverageScore = 1;
  }

  // SKILLS SECTION - 4

  let skillSectionScore = 0;

  if (sectionsFound.includes("skills")) {
    skillSectionScore = 4;
  }

  // DEMONSTRATED SKILLS - 8

  let demonstratedSkillCount = 0;

  Object.entries(skillsUsage).forEach(([skill, occurrences]) => {
    if (occurrences >= 2) {
      demonstratedSkillCount++;
    }
  });

  let demonstratedSkillScore = 0;

  if (demonstratedSkillCount >= 12) {
    demonstratedSkillScore = 8;
  } else if (demonstratedSkillCount >= 10) {
    demonstratedSkillScore = 7;
  } else if (demonstratedSkillCount >= 8) {
    demonstratedSkillScore = 6;
  } else if (demonstratedSkillCount >= 6) {
    demonstratedSkillScore = 5;
  } else if (demonstratedSkillCount >= 4) {
    demonstratedSkillScore = 4;
  } else if (demonstratedSkillCount >= 2) {
    demonstratedSkillScore = 2;
  } else if (demonstratedSkillCount === 1) {
    demonstratedSkillScore = 1;
  }

  // SKILL RELEVANCE - 5

  const relevantSkills = [
    "javascript",
    "typescript",
    "react",
    "node",
    "express",
    "mongodb",
    "mongoose",
    "sql",
    "mysql",
    "postgresql",
    "python",
    "java",
    "c++",
    "html",
    "css",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "rest api",
    "jwt",
    "redux",
    "next.js",
    "redis",
    "graphql",
    "bootstrap",
    "tailwind",
    "spring boot",
    "machine learning",
    "artificial intelligence",
  ];

  let relevantSkillCount = 0;

  skillsFound.forEach((skill) => {
    if (relevantSkills.includes(skill)) {
      relevantSkillCount++;
    }
  });

  let relevanceScore = 0;

  if (relevantSkillCount >= 15) {
    relevanceScore = 5;
  } else if (relevantSkillCount >= 12) {
    relevanceScore = 4;
  } else if (relevantSkillCount >= 8) {
    relevanceScore = 3;
  } else if (relevantSkillCount >= 5) {
    relevanceScore = 2;
  } else if (relevantSkillCount >= 2) {
    relevanceScore = 1;
  }

  const skillsScore = Math.min(
    skillCoverageScore +
      skillSectionScore +
      demonstratedSkillScore +
      relevanceScore,
    25,
  );

  score += skillsScore;

  // EXPERIENCE / PROJECTS - 20 POINTS

  let experienceScore = 0;

  const hasExperience = sectionsFound.includes("experience");

  const hasProjects = sectionsFound.includes("projects");

  // EXPERIENCE / PROJECT SECTION - 4

  if (hasExperience) {
    experienceScore += 2;
  }

  if (hasProjects) {
    experienceScore += 2;
  }

  // ACTION-ORIENTED PROJECT DESCRIPTION - 4

  const projectActionWords = [
    "developed",
    "built",
    "created",
    "implemented",
    "designed",
    "engineered",
    "deployed",
    "integrated",
    "optimized",
    "automated",
    "managed",
    "maintained",
  ];

  let projectActionCount = 0;

  projectActionWords.forEach((word) => {
    if (containsTerm(resume, word)) {
      projectActionCount++;
    }
  });

  if (projectActionCount >= 8) {
    experienceScore += 4;
  } else if (projectActionCount >= 6) {
    experienceScore += 3;
  } else if (projectActionCount >= 3) {
    experienceScore += 2;
  } else if (projectActionCount >= 1) {
    experienceScore += 1;
  }

  // TECHNOLOGIES USED - 4

  const projectTechnologies = [
    "javascript",
    "typescript",
    "react",
    "node",
    "express",
    "mongodb",
    "mongoose",
    "sql",
    "mysql",
    "postgresql",
    "jwt",
    "rest api",
    "bootstrap",
    "chart.js",
    "passport",
    "multer",
    "redux",
    "next.js",
    "docker",
    "aws",
  ];

  let technologiesUsed = 0;

  projectTechnologies.forEach((technology) => {
    if (containsTerm(resume, technology)) {
      technologiesUsed++;
    }
  });

  if (technologiesUsed >= 10) {
    experienceScore += 4;
  } else if (technologiesUsed >= 7) {
    experienceScore += 3;
  } else if (technologiesUsed >= 4) {
    experienceScore += 2;
  } else if (technologiesUsed >= 2) {
    experienceScore += 1;
  }

  // QUANTIFIABLE PROJECT ACHIEVEMENTS - 4

  const achievementPatterns = [
    /\b\d+%/gi,

    /\b\d+\+\s*(users|endpoints|apis|projects|features|clients|requests)/gi,

    /\b\d+\s*(users|endpoints|apis|projects|features|clients|requests)/gi,

    /\breduced\s+.*?\b\d+%/gi,

    /\bincreased\s+.*?\b\d+%/gi,

    /\bimproved\s+.*?\b\d+%/gi,

    /\b\d+x\b/gi,
  ];

  let achievementCount = 0;

  achievementPatterns.forEach((pattern) => {
    const matches = resume.match(pattern);

    if (matches) {
      achievementCount += matches.length;
    }
  });

  if (achievementCount >= 4) {
    experienceScore += 4;
  } else if (achievementCount >= 3) {
    experienceScore += 3;
  } else if (achievementCount >= 2) {
    experienceScore += 2;
  } else if (achievementCount >= 1) {
    experienceScore += 1;
  }

  // TECHNICAL IMPLEMENTATION - 4

  const implementationTerms = [
    "api",
    "authentication",
    "authorization",
    "jwt",
    "crud",
    "database",
    "mongodb",
    "rest",
    "responsive",
    "deployment",
    "integration",
    "dashboard",
    "middleware",
    "session",
  ];

  let implementationCount = 0;

  implementationTerms.forEach((term) => {
    if (containsTerm(resume, term)) {
      implementationCount++;
    }
  });

  if (implementationCount >= 10) {
    experienceScore += 4;
  } else if (implementationCount >= 7) {
    experienceScore += 3;
  } else if (implementationCount >= 4) {
    experienceScore += 2;
  } else if (implementationCount >= 2) {
    experienceScore += 1;
  }

  experienceScore = Math.min(experienceScore, 20);

  score += experienceScore;

  // QUANTIFIABLE ACHIEVEMENTS - 10 POINTS

  const numberMatches = resume.match(/\b\d+(\.\d+)?(%|\+)?\b/g) || [];

  let quantifiableScore = 0;

  if (numberMatches.length >= 8) {
    quantifiableScore = 10;
  } else if (numberMatches.length >= 5) {
    quantifiableScore = 8;
  } else if (numberMatches.length >= 3) {
    quantifiableScore = 6;
  } else if (numberMatches.length >= 2) {
    quantifiableScore = 4;
  } else if (numberMatches.length === 1) {
    quantifiableScore = 2;
  }

  score += quantifiableScore;

  // FORMATTING - 7 POINTS

  let formattingScore = 7;

  const formattingWarnings = [];

  const unusualCharacters =
    resumeText.match(/[^a-zA-Z0-9\s.,;:!?@#$%&()\-+/'"•●▪]/g) || [];

  if (unusualCharacters.length > 30) {
    formattingScore -= 2;

    formattingWarnings.push("Resume contains many unusual characters.");
  }

  if (/\s{4,}/.test(resumeText)) {
    formattingScore -= 1;

    formattingWarnings.push("Resume contains excessive spacing.");
  }

  const lines = resumeText.split("\n");

  const longLines = lines.filter((line) => line.length > 180);

  if (longLines.length > 5) {
    formattingScore -= 1;

    formattingWarnings.push("Some lines are unusually long.");
  }

  formattingScore = Math.max(formattingScore, 0);

  score += formattingScore;

  // ACTION VERBS - 5 POINTS

  const actionVerbs = [
    "developed",
    "built",
    "implemented",
    "designed",
    "created",
    "managed",
    "optimized",
    "integrated",
    "deployed",
    "automated",
    "improved",
    "led",
    "engineered",
    "configured",
    "maintained",
    "delivered",
  ];

  const actionVerbsFound = [];

  actionVerbs.forEach((verb) => {
    if (containsTerm(resume, verb)) {
      actionVerbsFound.push(verb);
    }
  });

  let actionVerbScore = 0;

  if (actionVerbsFound.length >= 6) {
    actionVerbScore = 5;
  } else if (actionVerbsFound.length >= 4) {
    actionVerbScore = 4;
  } else if (actionVerbsFound.length >= 2) {
    actionVerbScore = 2;
  } else if (actionVerbsFound.length === 1) {
    actionVerbScore = 1;
  }

  score += actionVerbScore;

  // CONTACT - 5 POINTS

  let contactScore = 0;

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  if (emailRegex.test(resume)) {
    contactScore += 3;
  }

  const phoneRegex = /(\+91[\s-]?)?[6-9]\d{9}/;

  if (phoneRegex.test(resume)) {
    contactScore += 2;
  }

  score += contactScore;

  //  LENGTH - 5 POINTS

  let lengthScore = 0;

  if (totalWords >= 250 && totalWords <= 1200) {
    lengthScore = 5;
  } else if (totalWords >= 150 && totalWords <= 1500) {
    lengthScore = 3;
  } else if (totalWords >= 75) {
    lengthScore = 1;
  }

  score += lengthScore;

  // MISSING SECTIONS

  const missingSections = [];

  if (!sectionsFound.includes("summary")) {
    missingSections.push("Professional Summary");
  }

  if (!sectionsFound.includes("skills")) {
    missingSections.push("Skills");
  }

  if (!sectionsFound.includes("education")) {
    missingSections.push("Education");
  }

  if (
    !sectionsFound.includes("experience") &&
    !sectionsFound.includes("projects")
  ) {
    missingSections.push("Experience or Projects");
  }

  // STRENGTHS

  const strengths = [];

  if (skillsScore >= 20) {
    strengths.push("Strong technical skills coverage.");
  }

  if (demonstratedSkillCount >= 6) {
    strengths.push("Technical skills are demonstrated in the resume.");
  }

  if (experienceScore >= 15) {
    strengths.push("Good experience/project evidence.");
  }

  if (structureScore >= 12) {
    strengths.push("Resume has a clear structure.");
  }

  if (quantifiableScore >= 7) {
    strengths.push("Resume contains measurable achievements.");
  }

  if (actionVerbScore >= 4) {
    strengths.push("Good use of action verbs.");
  }

  if (contactScore === 5) {
    strengths.push("Complete contact information detected.");
  }

  // IMPROVEMENTS

  const improvements = [];

  if (skillCoverageScore < 6) {
    improvements.push("Add more relevant technical skills.");
  }

  if (demonstratedSkillScore < 5) {
    improvements.push(
      "Demonstrate technical skills inside projects or experience instead of only listing them.",
    );
  }

  if (relevanceScore < 4) {
    improvements.push("Focus on skills relevant to the target role.");
  }

  if (experienceScore < 14) {
    improvements.push(
      "Add stronger project or experience descriptions with clear responsibilities and technologies used.",
    );
  }

  if (quantifiableScore < 7) {
    improvements.push(
      "Add measurable achievements using numbers, percentages, users, or performance improvements.",
    );
  }

  if (structureScore < 12) {
    improvements.push("Use standard ATS-friendly section headings.");
  }

  if (actionVerbScore < 4) {
    improvements.push(
      "Use stronger action verbs such as developed, implemented, optimized, designed, and deployed.",
    );
  }

  if (formattingWarnings.length > 0) {
    improvements.push("Keep the resume simple and ATS-friendly.");
  }

  // FINAL SCORE

  const finalScore = Math.min(Math.max(Math.round(score), 0), 100);

  // RETURN RESULT

  return {
    score: finalScore,

    breakdown: {
      skills: skillsScore,
      experience: experienceScore,
      structure: structureScore,
      quantifiableAchievements: quantifiableScore,
      parsing: parsingScore,
      formatting: formattingScore,
      actionVerbs: actionVerbScore,
      contact: contactScore,
      length: lengthScore,
    },

    skillsFound,

    skillsUsage,

    demonstratedSkillCount,

    skillBreakdown: {
      coverage: skillCoverageScore,
      section: skillSectionScore,
      demonstrated: demonstratedSkillScore,
      relevance: relevanceScore,
    },

    sectionsFound,

    actionVerbsFound,

    totalWords,

    numbersFound: numberMatches.length,

    missingSections,

    strengths,

    improvements,

    formattingWarnings,
  };
};

module.exports = {
  calculateResumeScore,
};
