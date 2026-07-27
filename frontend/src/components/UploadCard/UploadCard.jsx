import { useRef, useState } from "react";
import "./UploadCard.css";

function UploadCard() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!file) return false;

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed.");
      setSelectedFile(null);
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5 MB");
      setSelectedFile(null);
      return false;
    }

    setError("");
    setSelectedFile(file);
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    validateFile(file);
  };

  const handleCardClick = () => {
    if (!isDragging) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-wrapper">
      <div
        className={`upload-card ${isDragging ? "dragging" : ""}`} // template literal
        onClick={handleCardClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="resumeInput"
          accept=".pdf, .doc, .docx"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="upload-icon">
          <i className="fa-solid fa-cloud-arrow-up"></i>
        </div>
        <div className="upload-text">
          <h3>Drag and drop your resume here</h3>
          <p>or choose a file from your computer</p>
        </div>
        <div className="upload-btn">
          {selectedFile && (
            <p className="selected-file">
              <i className="fa-regular fa-file"></i> {selectedFile.name}
            </p>
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="button" className="btn btn-primary">
            Upload & Analyze
          </button>
        </div>
        <div className="upload-info">
          <p>Supports PDF, DOCX • Max file size 5 MB</p>
        </div>
      </div>
    </div>
  );
}

export default UploadCard;
