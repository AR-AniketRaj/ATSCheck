import "./UploadCard.css";

function UploadCard() {
  return (
    <div className="upload-card">
      <div className="upload-icon">
        <i className="fa-solid fa-cloud-arrow-up"></i>
      </div>
      <div className="upload-text">
        <h3>Drag and drop your resume here</h3>
        <p>or choose a file from your computer</p>
      </div>
      <div className="upload-btn">
        <button type="button" className="btn btn-primary">
          Upload & Analyze
        </button>
      </div>
      <div className="upload-info">
        <p>Supports PDF, DOCX • Max file size 5 MB</p>
      </div>
    </div>
  );
}

export default UploadCard;
