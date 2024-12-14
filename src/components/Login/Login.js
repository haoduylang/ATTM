import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { UserContext } from "../../UserContext"; // Import UserContext

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Sử dụng UserContext
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Kiểm tra nếu người dùng đã đăng nhập, điều hướng đến trang chủ hoặc trang admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", formData);

      if (response.data.token) {
        // Lưu token và thông tin người dùng
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        // Cập nhật thông tin người dùng vào UserContext
        setUser(response.data);

        message.success("Đăng nhập thành công");

        // Chuyển hướng dựa trên vai trò
        if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }

        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Login</h1>
      <hr />
      <div className="row my-4 h-100">
        <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
          <form onSubmit={handleSubmit}>
            {error && <p className="text-danger">{error}</p>}
            <div className="my-3">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
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
                required
              />
            </div>
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
            <div className="text-center">
              <button className="my-2 mx-auto btn btn-dark" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
