import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductInfor from "./ProductInfor"; // Component hiển thị thông tin sản phẩm

const DetailPage = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState(null); // Khởi tạo state cho sản phẩm

  // Dữ liệu sản phẩm (có thể lấy từ props, Redux, hoặc ở đây ta dùng hardcode)
  const products = [
    {
        "id": 1,
        "name": "Nhẫn lá vàng kim cương",
        "price": 100000,
        "imageUrl": "assets/hinh1.png",
        "description": "Nhẫn được thiết kế độc đáo với họa tiết lá vàng sang trọng. Mỗi chiếc lá được đính kim cương sáng lấp lánh, tạo nên vẻ đẹp tinh tế và quý phái. Sản phẩm lý tưởng cho những dịp đặc biệt."
      },
      {
        "id": 2,
        "name": "Vòng tay ngọc lục bảo",
        "price": 150000,
        "imageUrl": "assets/hinh2.png",
        "description": "Vòng tay tinh xảo với thiết kế hình tổ ong, đính ngọc lục bảo và kim cương. Sự kết hợp hoàn hảo giữa phong cách hiện đại và vẻ đẹp cổ điển. Phụ kiện hoàn hảo để nâng tầm phong cách của bạn."
      },
      {
        "id": 3,
        "name": "Dây chuyền ngọc lục bảo",
        "price": 200000,
        "imageUrl": "assets/hinh3.png",
        "description": "Dây chuyền được chế tác từ kim cương cao cấp, xen lẫn những viên ngọc lục bảo nổi bật. Thiết kế thanh lịch và tinh tế giúp bạn tỏa sáng trong mọi sự kiện. Một món trang sức không thể thiếu cho bộ sưu tập của bạn."
      },
  ];

  useEffect(() => {
    const selectedProduct = products.find((item) => item.id === parseInt(id));
    if (selectedProduct) {
      setProduct(selectedProduct);
    } else {
      console.error("Sản phẩm không tìm thấy!");
    }
  }, [id]);

  return (
    <div className="detail-page-container">
      <h1>Chi tiết sản phẩm:</h1>
      <hr />

      {product ? (
        <div className="product-detail">
          <ProductInfor product={product} />
        </div>
      ) : (
        <p>Đang tải dữ liệu sản phẩm...</p>
      )}
    </div>
  );
};

export default DetailPage;
