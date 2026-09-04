const express = require("express");

const ResumeAnalysis = require("../models/ResumeAnalysisModel");
const { userVerification } = require("../middleware/AuthMiddleware");

const router = express.Router();

// Get Resume History

router.get("/", userVerification, async (req, res) => {
  try {
    const resumes = await ResumeAnalysis.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Resume history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume history.",
    });
  }
});

// Get Single Resume Analysis

router.get("/:id", userVerification, async (req, res) => {
  try {
    const resume = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume analysis not found.",
      });
    }

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Single resume analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume analysis.",
    });
  }
});

module.exports = router;
