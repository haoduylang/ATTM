import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Constants and helper functions
const API_BASE_URL = 'http://localhost:3000';

export const getUsers = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getOrders = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const logoutAdmin = async (token) => {
    const response = await axios.post(`${API_BASE_URL}/admin/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Components
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
                    getUsers(token),
                    getOrders(token),
                ]);

                setUsers(fetchedUsers);
                setOrders(fetchedOrders);
            } catch (err) {
                console.error('Error fetching data:', err.message);
                navigate('/login');
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        await logoutAdmin(token);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
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
                        <th>Public Key</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order.user ? `${order.user.fullname} (${order.user.email})` : 'Unknown User'}</td>
                            <td>{order.productName}</td>
                            <td>{order.quantity}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>{order.publicKey}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;