import { CART_ADDITEM, CART_DELITEM } from "../action/cartAction";

const INITTIAL_STATE = [];

const cartReducer = (state = INITTIAL_STATE, action) => {
  const product = action.payload;

  switch (action.type) {
    case CART_ADDITEM:
      // Check if product already in cart
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        // Increase the quantity
        return state.map((x) => (x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
      } else {
        return [...state, { ...product, qty: 1 }];
      }

    case CART_DELITEM:
      const exist2 = state.find((x) => x.id === product.id);
      if (exist2.qty === 1) {
        return state.filter((x) => x.id !== exist2.id);
      } else {
        return state.map((x) => (x.id === product.id ? { ...x, qty: x.qty - 1 } : x));
      }

    default:
      return state;
  }
};

export default cartReducer;
