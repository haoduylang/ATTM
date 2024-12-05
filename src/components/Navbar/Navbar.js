import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { useSelector } from "react-redux";

const Navbar = () => {
  const state = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);

  const handleNavLinkClick = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 px-2 " to="/">
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
              <NavLink to="/cart" className="btn btn-outline-dark m-2" onClick={handleNavLinkClick}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaShoppingCart style={{ marginRight: "5px" }} />
                  Cart ({state.length})
                </div>
              </NavLink>
            </div>
          </div>
        </Collapse>
      </div>
    </nav>
  );
};

export default Navbar;
