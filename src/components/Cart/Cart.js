import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { addCart, delCart } from "../../redux/action/cartAction";
import EmptyCart from "../EmptyCart/EmptyCart";
import formatCurrency from "../../utils/formatCurrency";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Import toast

const Cart = () => {
  let subtotal = 0;
  let shipping = 30000;
  let totalItems = 0;
  const state = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  const [orders, setOrders] = useState([]);
  const [privateKey, setPrivateKey] = useState(""); // State để lưu private key

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleRequestCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/orders/request-cancel', { orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success("Cancel request sent to admin!"); // Hiển thị thông báo thành công
      } else {
        toast.error("Failed to send cancel request. Please try again."); // Hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error('Error requesting order cancel:', error.message);
      toast.error("Failed to send cancel request. Please try again."); // Hiển thị thông báo lỗi
    }
  };

  const handleCheckout = async () => {
    navigate('/checkout');
  };

  const handleUploadKey = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const uploadedKey = e.target.result.trim(); // Loại bỏ khoảng trắng thừa
        setPrivateKey(uploadedKey); // Lưu private key vào state
      };
      reader.readAsText(file);
    } else {
      toast.error("Failed to read the file. Please try again.");
    }
  };

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

                  
                      <button className="btn btn-dark btn-lg btn-block mt-3" onClick={handleCheckout}>
                        Go to checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {orders.length > 0 && (
        <div className="container my-3 py-3">
          <h2 className="text-center">Your Orders</h2>
          <hr />
          <div className="row">
            {orders.map(order => (
              <div key={order._id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Order ID: {order._id}</h5>
                    <p className="card-text">Product Name: {order.productName}</p>
                    <p className="card-text">Quantity: {order.quantity}</p>
                    <p className="card-text">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p className="card-text">Public Key: {order.publicKey}</p>
                    <p className="card-text">Status: {order.status === 'confirmed' ? 'Confirmed' : 'Pending'}</p> {/* Hiển thị trạng thái xác nhận */}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRequestCancelOrder(order._id)}
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;