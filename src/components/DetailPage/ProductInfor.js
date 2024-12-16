import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addCart } from "../../redux/action/cartAction";
import formatCurrency from "../../utils/formatCurrency";
import axios from "axios";

const ProductInfor = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warning("Please login to add products to the cart", { autoClose: 1500 });
        navigate("/login");
        return;
      }

      // Xác minh token với server
      const response = await axios.get("http://localhost:3000/api/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      });


      
      if (response.status === 200) {
        // Token hợp lệ, thực hiện thêm sản phẩm vào giỏ hàng
        dispatch(addCart(product));
        toast.success("Added to cart successfully!", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error in verifying token:", error.message);
      toast.error("Session expired, please login again.", { autoClose: 2000 });
      localStorage.removeItem("token");
      navigate("/login");
    }
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