import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <i className="fa-regular fa-circle-check"></i>
        <span>ATSCheck</span>
      </div>
      <ul className="nav-links">
        <li>
          <i class="fa-solid fa-house"></i>
          <Link to="/dashboard"> Dashboard</Link>
        </li>
        <li>
          <i class="fa-regular fa-file-lines"></i>
          <Link to="/history">Resume History</Link>
        </li>
      </ul>
      <div className="profile">
        <div><i class="fa-solid fa-circle-user"></i></div>
        <div>
          <span>Username</span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
