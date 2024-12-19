import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCreditCard } from 'react-icons/fa';
import axios from 'axios';
import formatCurrency from '../../utils/formatCurrency';

const Checkout = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [shipping, setShipping] = useState(30000);
  const navigate = useNavigate();
  const state = useSelector((state) => state.cart);

  useEffect(() => {
    const subtotal = state.reduce((total, item) => total + item.price * item.qty, 0);
    setTotalPrice(subtotal + shipping);
  }, [state, shipping]);

  const handlePayment = async () => {
    
        navigate('/information', { state: { items: state, total: totalPrice, shipping } });
      
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Checkout</h1>
      <hr />
      <div className="row">
        <div className="col-md-8">
          <h2>Order Summary</h2>
          <ul className="list-group">
            {state.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6>{item.name}</h6>
                  <small>Quantity: {item.qty}</small>
                </div>
                <span>{formatCurrency(item.price * item.qty)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h6>Shipping</h6>
              </div>
              <span>{formatCurrency(shipping)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h6>Total</h6>
              </div>
              <span>{formatCurrency(totalPrice)}</span>
            </li>
          </ul>
        </div>
        <div className="col-md-4">
          <h2>Payment</h2>
          <button className="btn btn-dark btn-lg btn-block mt-3" onClick={handlePayment}>
            <FaCreditCard /> Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;