import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar/Navbar";

import "./Analysis.css";

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No analysis ID provided.");
      setLoading(false);
      return;
    }

    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/upload/${id}`, {
        withCredentials: true,
      });

      console.log("Analysis response:", response.data);

      if (response.data.success) {
        setAnalysis(response.data.analysis);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Analysis fetch error:", error);

      setError(error.response?.data?.message || "Failed to fetch analysis.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="analysis-loading">Loading analysis...</div>
      </>
    );
  }

  if (error || !analysis) {
    return (
      <>
        <Navbar />

        <div className="analysis-page">
          <div className="no-analysis">
            <div className="no-analysis-icon">📄</div>

            <h1>No Analysis Found</h1>

            <p>{error || "Analysis not found."}</p>

            <button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const breakdown = analysis.breakdown || {};

  return (
    <>
      <Navbar />

      <div className="analysis-page">
        <div className="analysis-header">
          <h1>Resume Analysis</h1>

          <p>{analysis.fileName}</p>
        </div>

        {/* ATS SCORE */}

        <div className="score-card">
          <div>
            <span>ATS Score</span>

            <strong>{analysis.resumeScore}/100</strong>
          </div>
        </div>

        {/* BREAKDOWN */}

        <div className="breakdown-card">
          <h2>Score Breakdown</h2>

          <div className="breakdown-grid">
            <div>
              <h3>Skills</h3>
              <strong>{breakdown.skills || 0}</strong>
            </div>

            <div>
              <h3>Experience</h3>
              <strong>{breakdown.experience || 0}</strong>
            </div>

            <div>
              <h3>Structure</h3>
              <strong>{breakdown.structure || 0}</strong>
            </div>

            <div>
              <h3>Quantifiable Achievements</h3>

              <strong>{breakdown.quantifiableAchievements || 0}</strong>
            </div>

            <div>
              <h3>Parsing</h3>

              <strong>{breakdown.parsing || 0}</strong>
            </div>
          </div>
        </div>

        {/* RESUME DETAILS */}

        <div className="details-card">
          <h2>Resume Details</h2>

          <div className="details-grid">
            <div>
              <span>Total Words</span>
              <strong>{analysis.totalWords}</strong>
            </div>

            <div>
              <span>Skills Found</span>
              <strong>{analysis.skillsFound?.length || 0}</strong>
            </div>

            <div>
              <span>Sections Found</span>
              <strong>{analysis.sectionsFound?.length || 0}</strong>
            </div>

            <div>
              <span>Job Match</span>
              <strong>{analysis.jobMatchPercentage || 0}%</strong>
            </div>
          </div>
        </div>

        {/* SKILLS */}

        <div className="content-card">
          <h2>Skills Found</h2>

          <div className="skills-list">
            {analysis.skillsFound?.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>
        </div>

        {/* SECTIONS */}

        <div className="content-card">
          <h2>Sections Found</h2>

          <div className="section-list">
            {analysis.sectionsFound?.map((section, index) => (
              <span key={index}>{section}</span>
            ))}
          </div>
        </div>

        {/* STRENGTHS */}

        <div className="content-card">
          <h2>Strengths</h2>

          {analysis.strengths?.map((item, index) => (
            <p key={index}>✓ {item}</p>
          ))}
        </div>

        <button
          className="new-analysis-btn"
          onClick={() => navigate("/dashboard")}
        >
          Analyze Another Resume
        </button>
      </div>
    </>
  );
};

export default Analysis;
