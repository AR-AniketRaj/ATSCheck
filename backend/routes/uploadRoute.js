const express = require("express");
const multer = require("multer");

const { extractPdfText } = require("../utils/pdfparser");
const { calculateResumeScore } = require("../utils/atsScore");
const { analyzeJobDescription } = require("../utils/jdAnalyzer");
const { calculateJobMatch } = require("../utils/jobMatch");

const ResumeAnalysis = require("../models/ResumeAnalysisModel");

const { userVerification } = require("../middleware/AuthMiddleware");

const router = express.Router();

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

// ==========================================
// UPLOAD + ANALYZE RESUME
// ==========================================

router.post(
  "/",
  userVerification,
  upload.single("resume"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resume PDF.",
        });
      }

      // Only PDF for now
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are supported.",
        });
      }

      const jobDescription = req.body?.jobDescription || "";

      // Analyze JD
      const jdAnalysis = analyzeJobDescription(jobDescription);

      // Extract PDF text
      const resumeText = await extractPdfText(req.file.path);

      // Calculate ATS score
      const analysis = calculateResumeScore(resumeText);

      // Calculate JD match
      const jobMatch = calculateJobMatch(
        analysis.skillsFound || [],
        jdAnalysis,
      );

      // ==========================================
      // SAVE TO MONGODB
      // ==========================================

      const savedAnalysis = await ResumeAnalysis.create({
        userId: req.userId,

        fileName: req.file.originalname,

        resumeScore: analysis.score,

        breakdown: analysis.breakdown,

        skillsFound: analysis.skillsFound || [],

        sectionsFound: analysis.sectionsFound || [],

        totalWords: analysis.totalWords || 0,

        strengths: analysis.strengths || [],

        improvements: analysis.improvements || [],

        jobDescriptionProvided: jobDescription.trim().length > 0,

        jobMatchPercentage: jobMatch.skillMatchPercentage,

        filePath: req.file.path,
      });

      console.log("=================================");
      console.log("USER ID:", req.userId);
      console.log("RESUME:", req.file.originalname);
      console.log("ANALYSIS ID:", savedAnalysis._id);
      console.log("ATS SCORE:", analysis.score);
      console.log("=================================");

      // ==========================================
      // RESPONSE
      // ==========================================

      return res.status(201).json({
        success: true,

        message: "Resume analyzed successfully!",

        resumeScore: analysis.score,

        breakdown: analysis.breakdown,

        skillsFound: analysis.skillsFound || [],

        sectionsFound: analysis.sectionsFound || [],

        totalWords: analysis.totalWords || 0,

        strengths: analysis.strengths || [],

        improvements: analysis.improvements || [],

        jobDescriptionProvided: jobDescription.trim().length > 0,

        jobMatchPercentage: jobMatch.skillMatchPercentage,

        analysisId: savedAnalysis._id,

        fileName: req.file.originalname,
      });
    } catch (error) {
      console.error("Resume analysis error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to analyze resume.",
        error: error.message,
      });
    }
  },
);

// ==========================================
// GET RESUME HISTORY
// ==========================================

router.get(
  "/history",
  userVerification,

  async (req, res) => {
    try {
      const history = await ResumeAnalysis.find({
        userId: req.userId,
      }).sort({
        createdAt: -1,
      });

      return res.json({
        success: true,
        history,
      });
    } catch (error) {
      console.error("History error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch resume history.",
        error: error.message,
      });
    }
  },
);

// ==========================================
// TEST ROUTE
// ==========================================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Upload route is working!",
  });
});

// ==========================================
// GET SINGLE ANALYSIS
// ==========================================

router.get(
  "/:id",
  userVerification,

  async (req, res) => {
    try {
      const analysis = await ResumeAnalysis.findOne({
        _id: req.params.id,
        userId: req.userId,
      });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: "Analysis not found.",
        });
      }

      return res.json({
        success: true,
        analysis,
      });
    } catch (error) {
      console.error("Single analysis error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch analysis.",
        error: error.message,
      });
    }
  },
);

module.exports = router;
