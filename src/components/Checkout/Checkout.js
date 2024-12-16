import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCreditCard } from 'react-icons/fa';

const Checkout = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [shipping, setShipping] = useState(30000);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const state = useSelector((state) => state.cart);

  useEffect(() => {
    const subtotal = state.reduce((total, item) => total + item.price * item.qty, 0);
    setTotalPrice(subtotal + shipping);
  }, [state, shipping]);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify({ items: state, total: totalPrice, shipping }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success) {
        setPaymentStatus(true);

        // Điều hướng qua trang Information và truyền dữ liệu
        navigate('/information', { state: { total: totalPrice, shipping, items: state } });
      } else {
        setPaymentStatus(false);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setPaymentStatus(false);
    }
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Checkout</h1>
      <hr />
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
                    <img src={item.imageUrl} alt={item.name} width="100px" height="100px" />
                  </div>
                  <div className="col-lg-9">
                    <h5>{item.name}</h5>
                    <p>{item.price} x {item.qty}</p>
                  </div>
                </div>
              ))}
              <hr />
              <div className="row">
                <div className="col-lg-6">
                  <h5>Tổng cộng:</h5>
                </div>
                <div className="col-lg-6 text-right">
                  <h5>{totalPrice} VND</h5>
                </div>
              </div>
              <button
                className="btn btn-dark btn-lg btn-block"
                onClick={handlePayment}
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
    </div>
  );
};

export default Checkout;