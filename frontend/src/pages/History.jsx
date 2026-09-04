import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import "./History.css";

const History = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/upload/history",
        {
          withCredentials: true,
        },
      );

      console.log("History response:", response.data);

      if (response.data.success) {
        setHistory(response.data.history);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("History fetch error:", error);

      setError(
        error.response?.data?.message || "Failed to fetch resume history.",
      );
    } finally {
      setLoading(false);
    }
  };

  const viewAnalysis = (id) => {
    navigate(`/analysis/${id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="history-page">
          <div className="history-loading">Loading resume history...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="history-page">
        <div className="history-header">
          <h1>Resume History</h1>

          <p>View your previously analyzed resumes</p>
        </div>

        {error && <div className="history-error">{error}</div>}

        {!error && history.length === 0 && (
          <div className="empty-history">
            <h2>No Resume History</h2>

            <p>Upload and analyze your first resume to see it here.</p>

            <button onClick={() => navigate("/dashboard")}>
              Analyze Resume
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-card" key={item._id}>
                <div className="history-info">
                  <h2>{item.fileName}</h2>

                  <p>
                    Analyzed on {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="history-score">
                  <span>ATS Score</span>

                  <strong>{item.resumeScore}/100</strong>
                </div>

                <button
                  className="view-btn"
                  onClick={() => viewAnalysis(item._id)}
                >
                  View Analysis
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
