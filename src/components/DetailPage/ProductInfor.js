// ProductInfor.js
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addCart } from "../../redux/action/cartAction";
import formatCurrency from "../../utils/formatCurrency";

const ProductInfor = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addCart(product));
    toast.success("ADD TO BAG SUCCESSFULLY! :3", { autoClose: 1000 });
  };

  return (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 col-sm-12 py-3">
          <img
            className="img-fluid"
            src={product.imageUrl}
            alt={product.name}
            width="100px"
            height="100px"
          />
        </div>
        <div className="product-description col-md-6 py-5">
          <h1 className="display-5">{product.name}</h1>
          <h3 className="display-6 my-4">{formatCurrency(product.price)}</h3>
          <p className="lead">{product.description}</p>
          <button className="btn btn-outline-dark" onClick={() => handleAddToCart(product)}>
            Add to Cart
          </button>
          <Link to="/cart" className="btn btn-dark mx-3">
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductInfor;
