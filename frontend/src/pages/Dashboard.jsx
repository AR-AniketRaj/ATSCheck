import Navbar from "../components/Navbar/Navbar";
import WelcomeSection from "../components/WelcomeSection/WelcomeSection";
import UploadCard from "../components/UploadCard/UploadCard";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <WelcomeSection />
      <div className="upload-container">
        <UploadCard />
      </div>
    </div>
  );
}

export default Dashboard;
