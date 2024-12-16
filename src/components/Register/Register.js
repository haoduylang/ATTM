import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from 'antd';

const Register = () => {
  const navigate = useNavigate();
  // State lưu trữ dữ liệu form và trạng thái
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Hàm xử lý khi người dùng nhập vào form
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi dữ liệu đến server
      const response = await axios.post("http://localhost:3000/api/register", formData);

      // Xử lý phản hồi thành công
      message.success('Đăng ký thành công, bạn có thể đăng nhập ngay');
      alert(`Private Key: ${response.data.privateKey}`);
      navigate("/login"); // Chuyển hướng về trang đăng nhập
      setError("");
    } catch (err) {
      // Xử lý lỗi từ server
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <>
      <div className="container my-3 py-3">
        <h1 className="text-center">Register</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              {/* Hiển thị thông báo thành công hoặc lỗi */}
              {success && <p className="text-success">{success}</p>}
              {error && <p className="text-danger">{error}</p>}

              {/* Input Full Name */}
              <div className="form my-3">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullname"
                  placeholder="Enter Your Name"
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input Email */}
              <div className="form my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input Password */}
              <div className="form my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  autoComplete="on"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input Phone */}
              <div className="form my-3">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Enter Your Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input Address */}
              <div className="form my-3">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="Enter Your Address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              {/* Link đến trang đăng nhập */}
              <div className="my-3">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-underline text-info">
                    Login
                  </Link>
                </p>
              </div>

              {/* Nút Submit */}
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;