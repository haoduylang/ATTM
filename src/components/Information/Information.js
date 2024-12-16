import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Information = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    productName: '',
    quantity: 1
  });
  const [signature, setSignature] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState(null); // Để lưu thông báo lỗi
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
      const { total, shipping, items } = location.state;
      setFormData((prevData) => ({
        ...prevData,
        productName: items.map(item => item.name).join(', '),
        quantity: items.reduce((acc, item) => acc + item.qty, 0)
      }));
    }
  }, [navigate, location]);

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Ngăn chặn gửi nhiều lần
    setIsSubmitting(true); // Đặt trạng thái đang gửi
    try {
      const token = localStorage.getItem('token');
      const { name, email, phone, address, productName, quantity } = formData;
      const { data } = await axios.post('http://localhost:3000/api/information', {
        data: `${name}${email}${phone}${address}`,
        productName,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSignature(data.signature);
      setPrivateKey(data.privateKey);
      alert(`Signature: ${data.signature}\nPrivate Key: ${data.privateKey}`);
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

export default Information;