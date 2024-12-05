import React from "react";
import { NavLink } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { useState } from "react";

const Home = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="hero border-1 pb-3">
          <div className="card bg-dark border-0 mx-3">
            <img
              className="card-img img-fluid"
              src="./assets/hero.jpg"
              alt="Card"
              style={{ display: "flex", width: "100%", height: "auto" }}
            />
            <div className="card-img-overlay d-flex align-items-center">
              <div className="container" style={{ color: "#ffffff" }}>
                <h5 className="card-title fs-1 text fw-lighter fw-bold">NEW ARRIVALS</h5>
                <p className="card-text fs-5 d-none d-sm-block ">
                  Winter is co'ming. Get ready with our new collection.
                </p>
                <div>
                  <NavLink className="nav-link" to="/product">
                    <button type="button" className="btn btn-outline-light">
                      SHOP NOW
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-2">
          <hr />
          <h2>BEST COLLECTION</h2>
          <hr />
        </div>
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          fade
          data-bs-theme="dark"
          slide
          className=".carousel-image-prev-next"
        >
          <Carousel.Item>
            <img
              className="carousel d-flex mx-auto carousel-image img-fluid"
              src="./assets/prd1.webp"
              alt="Bracelet"
            />
            <Carousel.Caption></Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="carousel d-flex mx-auto carousel-image img-fluid"
              src="./assets/prd1.jpg"
              alt="Necklace"
            />
            <Carousel.Caption></Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="carousel d-flex mx-auto carousel-image img-fluid"
              src="./assets/prd4.webp"
              alt="Earrings"
            />
            <Carousel.Caption></Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="carousel d-flex mx-auto carousel-image img-fluid"
              src="./assets/prd6.webp"
              alt="Earrings"
            />
            <Carousel.Caption></Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
};

export default Home;
