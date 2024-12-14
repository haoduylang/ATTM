import { Routes, Route, Link } from "react-router-dom";
import App from "./App";
import Home from "./components/Home/Home";
import ContactPage from "./components/ContactPage/ContactPage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import AboutPage from "./components/AboutPage/AboutPage";
import Cart from "./components/Cart/Cart";
import Product from "./components/Product/Product";
import DetailPage from "./components/DetailPage/DetailPage";
import ScrollToTop from "./ScrollToTop";
import { ToastContainer } from "react-toastify";
import Checkout from "./components/Checkout/Checkout";

const PageNotFound = () => {
  return (
    <div className="container my-3 py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">404: Page Not Found</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Go Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="product" element={<Product />} />
          <Route path="product/:id" element={<DetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Layout;
