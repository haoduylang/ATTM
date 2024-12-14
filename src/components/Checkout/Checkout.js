import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard } from 'react-icons/fa';
import axios from 'axios';
import formatCurrency from '../../utils/formatCurrency';

const Checkout = () => {
  const state = useSelector((state) => state.cart);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shipping, setShipping] = useState(30000);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    productName: '',
    quantity: 1
  });
  const [signature, setSignature] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const subtotal = state.reduce((total, item) => total + item.price * item.qty, 0);
    setTotalPrice(subtotal + shipping);
  }, [state, shipping]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePayment = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage hoặc từ token
      const response = await axios.post('http://localhost:3000/api/checkout', {
        userId,
        data: `${formData.name}${formData.email}${formData.address}`,
        productName: formData.productName,
        quantity: formData.quantity
      });

      setSignature(response.data.signature);
      setPrivateKey(response.data.privateKey);

      // Nếu bạn muốn chuyển hướng sau khi hiển thị chữ ký và khóa bí mật, bạn có thể thêm logic ở đây
      // Ví dụ: Chuyển hướng sau 5 giây
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 5000);
    } catch (error) {
      console.error('Error during payment:', error);
      setPaymentStatus(false);
    }
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Thanh toán</h1>
      <hr />

      {state.length === 0 ? (
        <div className="alert alert-warning">Giỏ hàng của bạn trống</div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Thông tin giỏ hàng</h5>
                </div>
                <div className="card-body">
                  {state.map((item) => (
                    <div key={item.id} className="row">
                      <div className="col-lg-3">
                        <img src={item.image_url} alt={item.name} className="img-fluid" />
                      </div>
                      <div className="col-lg-5">
                        <strong>{item.name}</strong>
                      </div>
                      <div className="col-lg-4">
                        <p>{item.qty} x {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-light">
                  <h5>Tổng kết đơn hàng</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Sản phẩm</span>
                      <span>{formatCurrency(totalPrice - shipping)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Phí vận chuyển</span>
                      <span>{formatCurrency(shipping)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Tổng tiền</strong>
                      <strong>{formatCurrency(totalPrice)}</strong>
                    </li>
                  </ul>

                  <button
                    className="btn btn-dark btn-lg btn-block"
                    onClick={handlePayment}
                    disabled={paymentStatus === null || paymentStatus === true}
                  >
                    <FaCreditCard /> Thanh toán
                  </button>

                  {paymentStatus === false && (
                    <div className="alert alert-danger mt-3">
                      Thanh toán thất bại. Vui lòng thử lại.
                    </div>
                  )}
                  {paymentStatus === true && (
                    <div className="alert alert-success mt-3">
                      Thanh toán thành công! Đang chuyển hướng...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3>Thông tin người nhận</h3>
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="productName" className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </form>
          </div>

          {signature && (
            <div className="mt-3">
              <h5>Signature:</h5>
              <p>{signature}</p>
            </div>
          )}
          {privateKey && (
            <div className="mt-3">
              <h5>Private Key:</h5>
              <p>{privateKey}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;