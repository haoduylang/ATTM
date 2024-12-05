import formatCurrency from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import { MdOutlineLabelImportant } from "react-icons/md";
import { BsSuitHeartFill } from "react-icons/bs";

const ProductList = (props) => {
  const { products } = props;
  const navigate = useNavigate();

  const handleProductDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-cards">
      {products &&
        products.map((product) => (
          <div key={`product-${product.id}`} className="card-container">
            <div className="card">
              <div className="img-items">
                <div className="img">
                  <img src={product.image_url} alt="handmade" className="card-img" />
                </div>
                <div className="card-action">
                  <ul className="card-list">
                    <li className="list-item" onClick={() => handleProductDetails(product.id)}>
                      Xem chi tiết
                      <span style={{ fontSize: "1.125rem" }}>
                        <MdOutlineLabelImportant />
                      </span>
                    </li>
                    <li className="list-item">
                      Thêm vào mục yêu thích
                      <span>
                        <BsSuitHeartFill />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card-details">
                <div className="card-details-header">
                  <h2 className="title">{product.name}</h2>
                  <p className="price">{formatCurrency(product.price)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductList;
