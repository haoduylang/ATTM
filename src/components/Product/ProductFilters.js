import React from "react";

import FilterByPrice from "./Filters/FilterByPrice";

const ProductFilters = (props) => {
  const { filters, onChange } = props;

  const handleFilterChange = (filterName, newValue) => {
    if (!onChange) return;

    const newFilters = {
      [filterName]: newValue,
      _page: 1,
    };
    onChange(newFilters);
  };

  const handlePriceChange = (values) => {
    if (onChange) onChange(values);
  };

  return (
    <div className="filter-container">

    </div>
  );
};

export default ProductFilters;
