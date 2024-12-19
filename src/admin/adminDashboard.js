// filepath: src/admin/adminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const [fetchedUsers, fetchedOrders] = await Promise.all([
          axios.get('http://localhost:3000/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/admin/orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(fetchedUsers.data);
        setOrders(fetchedOrders.data);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/admin/orders/confirm', { orderId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'confirmed' } : order
        ));
      } else {
        console.error('Error confirming order:', response.data.error);
      }
    } catch (error) {
      console.error('Error confirming order:', error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <h3>Danh sách người dùng</h3>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Public Key</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.publicKey}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Danh sách đơn hàng</h3>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Người dùng</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Yêu cầu hủy</th>
            <th>Đã xác thực</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.user ? `${order.user.fullname} (${order.user.email})` : 'Unknown User'}</td>
              <td>{order.productName}</td>
              <td>{order.quantity}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.status === 'confirmed' ? 'Đã gửi yêu cầu xác thực' : 'Chưa gửi yêu cầu xác thực'}</td>
              <td>{order.cancelRequested ? 'Có' : 'Không'}</td>
              <td>{order.isVerified ? '✔️' : '❌'}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleConfirmOrder(order._id)}
                >
                  Yêu cầu xác thực
                </button>
                <button
                  className="btn btn-danger btn-sm ml-2"
                  onClick={() => handleDeleteOrder(order._id)}
                >
                  Hủy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;