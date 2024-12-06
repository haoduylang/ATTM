import React, { useState } from "react";
import { MdOutlineLabelImportant } from "react-icons/md";
import { BsSuitHeartFill } from "react-icons/bs";
import formatCurrency from "../../utils/formatCurrency";
import "./ProductList.scss"; // Tạo file CSS để thiết kế giao diện
import { useNavigate } from "react-router-dom";
const ProductList = () => {
  const navigate = useNavigate();
  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  const [products] = useState([
    {
      id: 1,
      name: "Đèn LED máy bay Mini PIXELSKY",
      price: 23400,
      img: "https://via.placeholder.com/150",
      discount: "42%",
      sold: "691",
    },
    {
      id: 2,
      name: "Quần đùi linen Nam",
      price: 69000,
      img: "https://via.placeholder.com/150",
      discount: "54%",
      sold: "5,1k",
    },
    {
      id: 3,
      name: "Áo sơ mi Kraft Work",
      price: 280000,
      img: "https://via.placeholder.com/150",
      discount: "3%",
      sold: "361",
    },
    {
      id: 4,
      name: "Ốp lưng trò chơi Mario",
      price: 5000,
      img: "https://via.placeholder.com/150",
      discount: "50%",
      sold: "1,8k",
    },
  ]);

  return (
      <div className="product-container">
        <h1>Danh sách sản phẩm</h1>
        <div className="product-grid">
          {products.map((product) => (
              <div key={product.id} className="product-card">
                {/* Hình ảnh sản phẩm */}
                <div className="product-image">
                  <img src={product.img} alt={product.name} />
                  {product.discount && (
                      <span className="product-discount">{product.discount} Giảm</span>
                  )}
                </div>

                {/* Thông tin sản phẩm */}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="product-sold">Đã bán: {product.sold}</p>
                </div>

                {/* Hành động */}
                <div className="product-actions">
                  <button className="detail-button"
                          onClick={() => handleViewDetails(product.id)} >
                    Xem chi tiết <MdOutlineLabelImportant />
                  </button>
                  <button className="favorite-button">
                    Thêm vào yêu thích <BsSuitHeartFill />
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default ProductList;
