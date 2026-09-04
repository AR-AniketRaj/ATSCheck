// Resume vs Job Description Matching

function normalizeText(text = "") {
  return text.toLowerCase().replace(/[._]/g, " ").replace(/\s+/g, " ").trim();
}

// Normalize individual skills

function normalizeSkill(skill = "") {
  let normalized = normalizeText(skill);

  const aliases = {
    "node js": "node",
    "node.js": "node",

    "react js": "react",
    "react.js": "react",

    "express js": "express",
    "express.js": "express",

    "restful api": "rest api",
    "restful apis": "rest api",

    "rest api": "rest api",
    "rest apis": "rest api",
  };

  return aliases[normalized] || normalized;
}

// Check whether a phrase exists in text

function containsPhrase(text, phrase) {
  const normalizedText = normalizeText(text);
  const normalizedPhrase = normalizeText(phrase);

  if (!normalizedText || !normalizedPhrase) {
    return false;
  }

  // Escape regex special characters
  const escapedPhrase = normalizedPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Word-boundary matching
  const regex = new RegExp(`\\b${escapedPhrase}\\b`, "i");

  return regex.test(normalizedText);
}

// Calculate Job Match

function calculateJobMatch(
  resumeSkills = [],
  jdAnalysis = {},
  resumeText = "",
) {
  // Technical Skills

  const requiredSkills = jdAnalysis.technicalSkills || [];

  const uniqueRequiredSkills = [...new Set(requiredSkills.map(normalizeSkill))];

  const uniqueResumeSkills = [...new Set(resumeSkills.map(normalizeSkill))];

  // Match technical skills

  const matchedSkills = uniqueRequiredSkills.filter((requiredSkill) =>
    uniqueResumeSkills.includes(requiredSkill),
  );

  const missingSkills = uniqueRequiredSkills.filter(
    (requiredSkill) => !uniqueResumeSkills.includes(requiredSkill),
  );

  const totalRequiredSkills = uniqueRequiredSkills.length;

  const matchedSkillCount = matchedSkills.length;

  const skillMatchPercentage =
    totalRequiredSkills > 0
      ? Math.round((matchedSkillCount / totalRequiredSkills) * 100)
      : 0;

  // Keyword Matching

  const jdKeywords = jdAnalysis.keywords || [];

  const matchedKeywords = jdKeywords.filter((keyword) =>
    containsPhrase(resumeText, keyword),
  );

  const keywordMatchPercentage =
    jdKeywords.length > 0
      ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
      : 0;

  // Soft Skill Matching

  const jdSoftSkills = jdAnalysis.softSkills || [];

  const matchedSoftSkills = jdSoftSkills.filter((skill) =>
    containsPhrase(resumeText, skill),
  );

  const softSkillPercentage =
    jdSoftSkills.length > 0
      ? Math.round((matchedSoftSkills.length / jdSoftSkills.length) * 100)
      : 0;

  // Final Job Match Score

  const jobMatchScore = Math.round(
    skillMatchPercentage * 0.6 +
      keywordMatchPercentage * 0.25 +
      softSkillPercentage * 0.15,
  );

  // Return Result

  return {
    success: true,

    jobMatchScore,

    matchedSkills,

    missingSkills,

    totalRequiredSkills,

    matchedSkillCount,

    skillMatchPercentage,

    keywordMatchPercentage,

    matchedKeywords,

    softSkillPercentage,

    matchedSoftSkills,
  };
}

module.exports = {
  calculateJobMatch,
};
