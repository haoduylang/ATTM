import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../../services/apiService";
import NavTitle from "./NavTitle";

const FilterByCategory = (props) => {
 const { onChange } = props;

  const [categoryList, setCategoryList] = useState();

  useEffect(() => {
    const fetchCategoryList = async () => {
      const res = await getAllCategories();

      if (res && res.length > 0) {
        setCategoryList(res);
      }
    };

    fetchCategoryList();
  }, []);

  const handleCategoryClick = (category) => {
    if (onChange) {
      onChange("categoryId", category.id);
    }
  };

  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" />
      <div className="category-list-container">
        <ul className="category-list">

        </ul>
      </div>
    </div>
  );
};

export default FilterByCategory;
