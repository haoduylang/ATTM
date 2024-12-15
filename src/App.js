import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import ProductList from "./components/Product/ProductList";
import ProductDetail from "./components/DetailPage/DetailPage";
import DetailPage from "./components/DetailPage/DetailPage";
import Home from "./components/Home/Home";
import Aboutpage from "./components/AboutPage/AboutPage";
import ContactPage from "./components/ContactPage/ContactPage";
import Cart from "./components/Cart/Cart"; 
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";    
import AdminDashboard from "./admin/adminDashboard";
import Checkout from "./components/Checkout/Checkout";
import Information from './components/Information/Information'; // Import Information component

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-container">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />  
            <Route path="/product" element={<ProductList />} />
            <Route path="/product/:id" element={<DetailPage />} />
            <Route path="/about" element={<Aboutpage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} /> {/* Trang giỏ hàng */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Sửa thành element */}
            <Route path="/information" element={<Information />} /> 
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
