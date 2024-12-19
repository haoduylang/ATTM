import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency';

const Information = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    items: [],
    total: 0,
    shipping: 30000
  });
  const [signature, setSignature] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token không tồn tại. Vui lòng đăng nhập lại.');
      return navigate('/login');
    }

    axios.get('http://localhost:3000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) => {
        const { fullname, email, phone, address } = data.user;
        setFormData((prevData) => ({
          ...prevData,
          name: fullname,
          email,
          phone,
          address
        }));
      })
      .catch((err) => {
        setError('Xác thực thất bại. Vui lòng đăng nhập lại.');
        console.error('Verify token error:', err.message);
        navigate('/login');
      });

    if (location.state) {
      const { items, total, shipping } = location.state;
      setFormData((prevData) => ({
        ...prevData,
        items,
        total,
        shipping
      }));
    }
  }, [navigate, location]);

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const downloadFile = (data, filename) => {
    const element = document.createElement("a");
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const { name, email, phone, address, items, total, shipping } = formData;
      const { data } = await axios.post('http://localhost:3000/api/information', {
        data: `${name}${email}${phone}${address}`,
        items,
        total,
        shipping
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSignature(data.signature);

      // Automatically download the private key
      downloadFile(data.signature, 'signatureKey.pem');

      alert(`Signature: ${data.signature}`);
      navigate('/confirmation');
    } catch (error) {
      console.error('Error during checkout:', error.message);
      setError('Gửi thông tin thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Information</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'phone', 'address'].map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              className="form-control"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              readOnly
            />
          </div>
        ))}
        <div className="mb-3">
          <label className="form-label">Order Summary</label>
          <ul className="list-group">
            {formData.items.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
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
              <span>{formatCurrency(formData.shipping)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h6>Total</h6>
              </div>
              <span>{formatCurrency(formData.total)}</span>
            </li>
          </ul>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {signature && (
        <div className="mt-3">
          <h5>Signature:</h5>
          <p>{signature}</p>
        </div>
      )}
    </div>
  );
};

export default Information;