import React from "react";
import { TiArrowLeftThick } from "react-icons/ti";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="row">
      <div className="col-md-12 py-5 bg-light text-center">
        <h4 className="p-3 display-5">Your Cart is Empty</h4>
        <Link to="/product" className="btn btn-outline-dark mx-4">
          <div style={{ display: "flex", alignItems: "center" }}>
            <TiArrowLeftThick style={{ marginRight: "5px" }} />
            Continue Shopping
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
