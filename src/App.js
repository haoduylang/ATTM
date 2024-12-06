import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/Product/ProductList";
import ProductDetail from "./components/DetailPage/DetailPagel";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-container">
        <div className="app-content">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>

  );

}

export default App;
