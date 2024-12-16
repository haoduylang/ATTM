import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage hoặc từ token
      const response = await axios.post('https://localhost:3000/api/checkout', {
        userId,
        data: `${formData.name}${formData.email}${formData.address}`,
        productName: formData.productName,
        quantity: formData.quantity
      });

      setSignature(response.data.signature);
      setPrivateKey(response.data.privateKey);

      // Nếu bạn muốn chuyển hướng sau khi hiển thị chữ ký và khóa bí mật, bạn có thể thêm logic ở đây
      // Ví dụ: Chuyển hướng sau 5 giây
      // setTimeout(() => {
      //   navigate('/confirmation');
      // }, 5000);
    } catch (error) {
      console.error('Error during checkout:', error.message);
    }
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Checkout</h1>
      <hr />
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
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
    </div>
  );
};

export default Checkout;