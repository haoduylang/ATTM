import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import{message} from 'antd';
const Login = () => {
  const navigate = useNavigate();
  // State để lưu trữ thông tin form và lỗi
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi request API đến server
      const response = await axios.post("http://localhost:3000/api/login", formData);

      // Xử lý phản hồi thành công
      message. success('Đăng nhập thành công');
      navigate("/"); // Chuyển hướng về trang chủ
      setError(""); // Xóa thông báo lỗi nếu có
    } catch (err) {
      // Xử lý lỗi khi API trả về lỗi
      setError(err.response?.data?.error || "Login failed. Please try again.");
      setSuccess(""); // Xóa thông báo thành công nếu có
    }
  };

  return (
    <>
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              {/* Hiển thị thông báo thành công hoặc lỗi */}
              {success && <p className="text-success">{success}</p>}
              {error && <p className="text-danger">{error}</p>}

              {/* Input Email */}
              <div className="my-3">
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
              <div className="my-3">
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

              {/* Link đến trang đăng ký */}
              <div className="my-3">
                <p>
                  New Here?{" "}
                  <Link
                    to="/register"
                    className="text-decoration-underline text-info"
                  >
                    Register
                  </Link>
                </p>
              </div>

              {/* Nút Login */}
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
