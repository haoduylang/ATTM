import React from "react";
import { MdOutlineLabelImportant } from "react-icons/md";
import { BsSuitHeartFill } from "react-icons/bs";
import formatCurrency from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import "./ProductList.scss"; // Tạo file CSS để thiết kế giao diện

const ProductList = () => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };
  

  // Định nghĩa danh sách sản phẩm
  const products = [
    {
      "id": 1,
      "name": "Nhẫn lá vàng kim cương",
      "price": 100000000,
      "imageUrl": "assets/hinh1.png",
      "description": "Nhẫn được thiết kế độc đáo với họa tiết lá vàng sang trọng. Mỗi chiếc lá được đính kim cương sáng lấp lánh, tạo nên vẻ đẹp tinh tế và quý phái. Sản phẩm lý tưởng cho những dịp đặc biệt."
    },
    {
      "id": 2,
      "name": "Vòng tay ngọc lục bảo",
      "price": 150000000,
      "imageUrl": "assets/hinh2.png",
      "description": "Vòng tay tinh xảo với thiết kế hình tổ ong, đính ngọc lục bảo và kim cương. Sự kết hợp hoàn hảo giữa phong cách hiện đại và vẻ đẹp cổ điển. Phụ kiện hoàn hảo để nâng tầm phong cách của bạn."
    },
    {
      "id": 3,
      "name": "Dây chuyền ngọc lục bảo",
      "price": 200000000,
      "imageUrl": "assets/hinh3.png",
      "description": "Dây chuyền được chế tác từ kim cương cao cấp, xen lẫn những viên ngọc lục bảo nổi bật. Thiết kế thanh lịch và tinh tế giúp bạn tỏa sáng trong mọi sự kiện. Một món trang sức không thể thiếu cho bộ sưu tập của bạn."
    }
    
    // Thêm các sản phẩm khác
  ];

  return (
    <div className="product-container">
      <h1>Danh sách sản phẩm</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {/* Hình ảnh sản phẩm */}
            <div className="product-image">
              <img src={product.imageUrl} alt={product.name} width="100px"
            height="100px" />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{formatCurrency(product.price)}</p>
            </div>

            {/* Hành động */}
            <div className="product-actions">
              <button
                className="detail-button"
                onClick={() => handleViewDetails(product.id)}
              >
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
