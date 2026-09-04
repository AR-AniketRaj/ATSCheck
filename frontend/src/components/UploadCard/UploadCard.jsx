import { useRef, useState } from "react";
import axios from "axios";
import "./UploadCard.css";
import { useNavigate } from "react-router-dom";

function UploadCard() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Validate File

  const validateFile = (file) => {
    const allowedTypes = ["application/pdf"];

    const maxSize = 5 * 1024 * 1024;

    if (!file) return false;

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF files are allowed.");
      setSelectedFile(null);
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5 MB.");
      setSelectedFile(null);
      return false;
    }

    setError("");
    setSelectedFile(file);

    return true;
  };

  // File Input

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    validateFile(file);
  };

  // Drag Over

  const handleDragOver = (event) => {
    event.preventDefault();

    setIsDragging(true);
  };

  // Drag Leave

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Drop

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    validateFile(file);
  };

  // Card Click

  const handleCardClick = () => {
    if (!isDragging && !isUploading) {
      fileInputRef.current.click();
    }
  };

  // Upload + Analyze

  const handleUpload = async (event) => {
    event.stopPropagation();

    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", selectedFile);

    try {
      setIsUploading(true);
      setError("");

      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        withCredentials: true,
      });

      console.log("UPLOAD RESPONSE:", response.data);

      // Check if backend returned analysis ID
      if (!response.data.success || !response.data.analysisId) {
        setError("Analysis ID was not returned by the server.");
        return;
      }

      // Navigate to exact analysis
      navigate(`/analysis/${response.data.analysisId}`);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      setError(
        error.response?.data?.message ||
          "Something went wrong while uploading the resume.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-wrapper">
      <div
        className={`upload-card ${isDragging ? "dragging" : ""}`}
        onClick={handleCardClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden File Input */}

        <input
          type="file"
          id="resumeInput"
          accept=".pdf"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* Upload Icon */}

        <div className="upload-icon">
          <i className="fa-solid fa-cloud-arrow-up"></i>
        </div>

        {/* Upload Text */}

        <div className="upload-text">
          <h3>Drag and drop your resume here</h3>

          <p>or choose a file from your computer</p>
        </div>

        {/* Upload Status + Button */}

        <div className="upload-btn">
          <div className="upload-status">
            {selectedFile && (
              <p className="selected-file">
                <i className="fa-regular fa-file"></i>

                <span>{selectedFile.name}</span>
              </p>
            )}

            {error && <p className="error-message">{error}</p>}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>

        {/* Upload Information */}

        <div className="upload-info">
          <p>Supports PDF • Max file size 5 MB</p>
        </div>
      </div>
    </div>
  );
}

export default UploadCard;
