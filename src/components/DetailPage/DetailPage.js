import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductInfor from "./ProductInfor";
import { getDataProduct } from "../../services/apiService";

const DetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      const res = await getDataProduct(id);

      if (res && Object.keys(res).length > 0) {
        setProduct(res);
      }
    };

    getProduct();
  }, [id]);

  return (
    <div className="detail-page-title">
      <h1>YOUR CHOICE:</h1>
      <hr />
      {product && <ProductInfor product={product} />}
    </div>
  );
};

export default DetailPage;
