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

    const handleConfirmOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/admin/orders/confirm`, { orderId }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                // Cập nhật lại trạng thái đơn hàng trong giao diện
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
            await axios.delete(`${API_BASE_URL}/admin/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Cập nhật lại danh sách đơn hàng sau khi xóa
            const updatedOrders = await getOrders(token);
            setOrders(updatedOrders);
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
                            <td>{user.publicKey}</td> {/* Hiển thị khóa công khai ngắn gọn */}
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
                        <th>Trạng thái</th>
                        <th>Yêu cầu hủy</th> {/* Thêm cột yêu cầu hủy */}
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
                            <td>{order.publicKey}</td> {/* Hiển thị khóa công khai ngắn gọn */}
                            <td>{order.status === 'confirmed' ? 'Đã xác nhận' : 'Chưa xác nhận'}</td>
                            <td>{order.cancelRequested ? 'Có' : 'Không'}</td> {/* Hiển thị yêu cầu hủy */}
                            <td>
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleConfirmOrder(order._id)}
                                >
                                    Xác nhận
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