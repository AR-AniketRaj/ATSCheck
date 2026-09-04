import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Logout button clicked");

    try {
      const response = await axios.post(
        "http://localhost:4000/logout",
        {},
        {
          withCredentials: true,
        },
      );

      console.log("Logout response:", response.data);

      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <i className="fa-regular fa-circle-check"></i>
        <span>ATSCheck</span>
      </div>

      <ul className="nav-links">
        <li>
          <i className="fa-solid fa-house"></i>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <i className="fa-regular fa-file-lines"></i>
          <Link to="/history">Resume History</Link>
        </li>
      </ul>

      <div className="profile">
        <button type="button" className="logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
