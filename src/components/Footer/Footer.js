import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoHome } from "react-icons/io5";
import { SiMinutemailer } from "react-icons/si";
import { GiRotaryPhone } from "react-icons/gi";

const Footer = () => {
    return (
      <>
        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
        <section className=" justify-content-center justify-content-lg-between p-4 border-bottom "  >
        </section>
        <section className="justify-content-center justify-content-lg-between p-4 border-bottom"  style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          <div className="container text-md-start mt-5">
          <div className="row mt-3">
          <div className="col-md-3 col-lg-2 col-xl-3 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-3 text-md-start fst-italic">
              <i className="fas fa-gem me-3"></i>Gullveig
            </h6>
            <p>
              Choose us for the best quality products.
            </p>
          </div>
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-4">
              OUR COMPANY
            </h6>
            <p>
              <a href="#!" className="text-reset">CARRERS</a>
            </p>
            <p>
              <a href="#!" className="text-reset">CREADIT</a>
            </p>
            <p>
              <a href="#!" className="text-reset">CORPORATE SOCIAL RESPONSIBILITY</a>
            </p>         
          </div>
     
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-4">
            LEGAL AREA
            </h6>
            <p>
              <a href="#!" className="text-reset">TERMS OF USE</a>
            </p>
            <p>
              <a href="#!" className="text-reset">PRIVACY POLICY</a>
            </p>
            <p>
              <a href="#!" className="text-reset">ACCESSIBILITY STATEMENT</a>
            </p>
            <p>
              <a href="#!" className="text-reset">HUMAN RIGHTS STATEMENT </a>
            </p>
          </div>
  
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">
            CONTACT US
            </h6>
            <p><IoHome/><i className="">Bien Hoa, Dong Nai</i></p>
            <p><SiMinutemailer/><i className="">gullveig@fashion.mail</i></p>
            <p><GiRotaryPhone/><i className=""></i> + 852 162 351</p>
            </div>
        </div>

      </div>
    </section>
    <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      © 2024 Copyright:
      <a className="text-reset fw-bold" href="#!"> GULLVEIG.com</a>
    </div>

      </footer>
    </>
  );
};

export default Footer;