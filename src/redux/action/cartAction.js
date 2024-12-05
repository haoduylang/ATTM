export const CART_ADDITEM = "ADDITEM";
export const CART_DELITEM = "DELITEM";

// For Add Item to Cart
export const addCart = (product) => {
  return {
    type: CART_ADDITEM,
    payload: product,
  };
};

// For Delete Item to Cart
export const delCart = (product) => {
  return {
    type: CART_DELITEM,
    payload: product,
  };
};
