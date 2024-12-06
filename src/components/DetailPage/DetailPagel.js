import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductInfor from "./ProductInfor"; // Component hiển thị thông tin sản phẩm
import { getDataProduct } from "../../services/apiService"; // Giả sử bạn đã có API này

const DetailPage = () => {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const [product, setProduct] = useState(null); // Khởi tạo state cho sản phẩm

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                // Gọi API để lấy chi tiết sản phẩm
                const res = await getDataProduct(id); // API trả về thông tin chi tiết sản phẩm
                if (res && res.data) {
                    setProduct(res.data); // Lưu dữ liệu sản phẩm vào state
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sản phẩm:", error);
            }
        };

        fetchProductDetail();
    }, [id]); // Chạy lại mỗi khi ID thay đổi

    return (
        <div className="detail-page-container">
            <h1>Chi tiết sản phẩm:</h1>
            <hr />

            {product ? (
                <div className="product-detail">
                    {/* Hiển thị ảnh sản phẩm */}
                    <div className="product-image">
                        <img src={product.imageUrl} alt={product.name} /> {/* Đảm bảo product.imageUrl có ảnh */}
                    </div>

                    {/* Hiển thị mô tả sản phẩm */}
                    <div className="product-description">
                        <h2>{product.name}</h2>
                        <p>{product.description}</p> {/* Mô tả sản phẩm */}
                        <p><strong>Giá: </strong>{product.price} VND</p>
                    </div>

                    {/* Hiển thị các thông tin khác (ví dụ: đánh giá, lựa chọn màu sắc, size...) */}
                    <ProductInfor product={product} />
                </div>
            ) : (
                <p>Đang tải dữ liệu sản phẩm...</p>
            )}
        </div>
    );
};

export default DetailPage;
