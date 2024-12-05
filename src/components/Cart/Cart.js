import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { addCart, delCart } from "../../redux/action/cartAction";
import EmptyCart from "../EmptyCart/EmptyCart";
import formatCurrency from "../../utils/formatCurrency";

const Cart = () => {
  let subtotal = 0;
  let shipping = 30000;
  let totalItems = 0;
  const state = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addItem = (product) => {
    dispatch(addCart(product));
  };
  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  // Tính tổng giá trị các sản phẩm trong giỏ hàng
  subtotal = state.reduce((total, item) => total + item.price * item.qty, 0);

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  totalItems = state.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="container my-3 py-3 r">
      <h1 className="text-center">Cart</h1>
      <hr />

      {state.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <section className="h-100 gradient-custom">
            <div className="container py-5">
              <div className="row d-flex justify-content-center my-4">
                <div className="col-md-8 col-sm-12">
                  <div className="card mb-4">
                    <div className="card-header py-3">
                      <h5 className="mb-0">Item List</h5>
                    </div>
                    <div className="card-body">
                      {state.map((item) => {
                        return (
                          <div key={item.id}>
                            <div className="row d-flex align-items-center">
                              <div className="col-lg-3 col-md-3 col-sm-4">
                                <div className="bg-image rounded" data-mdb-ripple-color="light">
                                  <img
                                    src={item.image_url}
                                    alt={item.description}
                                    className="img-fluid"
                                  />
                                </div>
                              </div>

                              <div className="col-lg-5 col-md-5 col-sm-8">
                                <p>
                                  <strong>{item.name}</strong>
                                </p>
                              </div>

                              <div className="col-lg-4 col-md-4 col-sm-12">
                                <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                                  <button
                                    className="btn px-3"
                                    onClick={() => {
                                      removeItem(item);
                                    }}
                                  >
                                    <FaMinus />
                                  </button>

                                  <p className="mx-5">{item.qty}</p>

                                  <button
                                    className="btn px-3"
                                    onClick={() => {
                                      addItem(item);
                                    }}
                                  >
                                    <FaPlus />
                                  </button>
                                </div>

                                <p className="text-start text-md-center">
                                  <strong>{formatCurrency(item.price * item.qty)}</strong>
                                </p>
                              </div>
                            </div>

                            <hr className="my-4" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="card mb-4">
                    <div className="card-header py-3 bg-light">
                      <h5 className="mb-0">Order Summary</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                          Products ({totalItems})<span>{formatCurrency(subtotal)}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                          Shipping
                          <span>{formatCurrency(shipping)}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                          <div>
                            <strong>Total amount</strong>
                          </div>
                          <span>
                            <strong>{formatCurrency(subtotal + shipping)}</strong>
                          </span>
                        </li>
                      </ul>

                      <Link to="/checkout" className="btn btn-dark btn-lg btn-block">
                        Go to checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Cart;
