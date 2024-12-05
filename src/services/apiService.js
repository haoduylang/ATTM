import axios from "../utils/axiosCustomize";

const getAllProducts = (paramsString) => {
  return axios.get(`api/products?${paramsString}`);
};

const getDataProduct = (id) => {
  return axios.get(`api/products/${id}`);
};

const getAllCategories = () => {
  return axios.get("api/categories");
};

export { getAllProducts, getDataProduct, getAllCategories };
