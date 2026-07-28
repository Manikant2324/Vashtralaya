import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Collection from './pages/collection';
import Product from './pages/Product';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Placeorder from './pages/Placeorder';
import Cart from './pages/Cart';
import Profile from './pages/Profile';

import AdminLayout from './admin/AdminLayout';
import Add from './admin/pages/Add';
import List from './admin/pages/List';
import Order from './admin/pages/Order';
import AdminLogin from './admin/pages/AdminLogin';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Searchbar from './components/Searchbar';
import AIChatAssistant from './components/AIChatAssistant';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/list" replace />} />
            <Route path="add" element={<Add />} />
            <Route path="list" element={<List />} />
            <Route path="orders" element={<Order />} />
            <Route path="login" element={<AdminLogin />} />
          </Route>
        </Routes>
      </>
    );
  }

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <Searchbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/place-order" element={<Placeorder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <Footer />
      <AIChatAssistant />
    </div>
  );
};

export default App;
