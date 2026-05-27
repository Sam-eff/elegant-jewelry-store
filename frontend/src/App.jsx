import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import RequireAuth from './pages/RequireAuth';
import ProductsPage from './pages/ProductsPage';
import Wishlist from './pages/Wishlist';
import Layout from './components/common/Layout';
import { useAuthStore } from './store/useAuthStore';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryProducts from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MyOrders from './pages/MyOrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage';



function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);


  const { fetchUser } = useAuthStore();
  

  useEffect(() => {
      fetchUser();  // ✅ this will sync Zustand on app start
  }, [fetchUser]);

  return (
    <Router>
      <Routes>
       <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-success/:id" element={<OrderSuccessPage />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
       </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       
        {/* Add other routes here */}
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />

    </Router>
    
  );
}

export default App;


