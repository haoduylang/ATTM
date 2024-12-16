import { useEffect, useState } from "react";
import queryString from "query-string";

import Pagination from "./Pagination";
import ProductFilters from "./ProductFilters";
import "./Product.scss";
import ProductList from "./ProductList";
import ProductBanner from "./ProductBanner";

function Product() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    _page: 1,
    _limit: 12,
    _totalRows: 1,
  });
  const [filters, setFilters] = useState({
    _limit: 12,
    _page: 1,
    _sort: "price",
    _order: "asc",
  })

  

  const handlePageChange = (newPage) => {
    setFilters((prevFilters) => ({ ...prevFilters, _page: newPage }));
  };

  const handleSortChange = (newSortValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, _order: newSortValue }));
  };

  const handlePageSizeChange = (newSize) => {
    setFilters((prevFilters) => ({ ...prevFilters, _limit: newSize }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div className="product-container mx-auto">
      <h1 className="title">Products</h1>
      <hr />
      <div className="product-layout">
        <div className="sidebar">
          <ProductFilters onChange={handleFiltersChange} />
        </div>
        <div className="content">
          <ProductBanner
            currentSort={filters._order}
            onSortChange={handleSortChange}
            onPageSizeChange={handlePageSizeChange}
          />
          <div className="list-product">
            <ProductList products={products} />
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Product;
