const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    resumeScore: {
      type: Number,
      required: true,
    },

    breakdown: {
      skills: {
        type: Number,
        default: 0,
      },

      experience: {
        type: Number,
        default: 0,
      },

      structure: {
        type: Number,
        default: 0,
      },

      quantifiableAchievements: {
        type: Number,
        default: 0,
      },

      parsing: {
        type: Number,
        default: 0,
      },
    },

    skillsFound: {
      type: [String],
      default: [],
    },

    sectionsFound: {
      type: [String],
      default: [],
    },

    totalWords: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    jobDescriptionProvided: {
      type: Boolean,
      default: false,
    },

    jobMatchPercentage: {
      type: Number,
      default: 0,
    },

    filePath: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
