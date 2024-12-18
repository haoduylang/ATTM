import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaShoppingCart, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { useSelector } from "react-redux";
import { UserContext } from "../../UserContext";
import axios from "axios";
import { message } from 'antd';

const Navbar = () => {
  const state = useSelector((state) => state.cart);
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNavLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const downloadFile = (data, filename) => {
    const element = document.createElement("a");
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  };

  const handleReportKeyLeak = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/api/report-key-leak", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        message.success('Public key updated successfully. Please save your new private key.');
        downloadFile(response.data.privateKey, 'newPrivateKey.pem');
      } else {
        message.error('Failed to update public key.');
      }
    } catch (error) {
      console.error('Error reporting key leak:', error.message);
      message.error('Failed to report key leak. Please try again.');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
          <div style={{ display: "flex", alignItems: "center" }}>GULLVEIG</div>
        </NavLink>
        <Button
          variant="light"
          onClick={() => setOpen(!open)}
          aria-controls="navbarSupportedContent"
          aria-expanded={open}
          className="navbar-toggler"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>

        <Collapse in={open}>
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav m-auto my-2 text-center">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" onClick={handleNavLinkClick}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/product" onClick={handleNavLinkClick}>
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about" onClick={handleNavLinkClick}>
                  Guide
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact" onClick={handleNavLinkClick}>
                  Contact
                </NavLink>
              </li>
            </ul>
            <div className="buttons text-center">
              {user ? (
                <>
                  <span className="navbar-text mx-2">Welcome, {user.fullname}!</span>
                  <button
                    className="btn btn-outline-dark m-2"
                    onClick={handleLogout}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FaSignOutAlt style={{ marginRight: "5px" }} />
                      Logout
                    </div>
                  </button>
                  <button
                    className="btn btn-outline-warning m-2"
                    onClick={handleReportKeyLeak}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FaExclamationTriangle style={{ marginRight: "5px" }} />
                      Report Key Leak
                    </div>
                  </button>
                  <NavLink
                    to="/cart"
                    className="btn btn-outline-dark m-2"
                    onClick={handleNavLinkClick}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FaShoppingCart style={{ marginRight: "5px" }} />
                      Cart ({state.length})
                    </div>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="btn btn-outline-dark m-2"
                    onClick={handleNavLinkClick}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FaSignInAlt style={{ marginRight: "5px" }} />
                      Login
                    </div>
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="btn btn-outline-dark m-2"
                    onClick={handleNavLinkClick}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FaUserPlus style={{ marginRight: "5px" }} />
                      Register
                    </div>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </Collapse>
      </div>
    </nav>
  );
};

export default Navbar;