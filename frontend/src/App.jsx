import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/auth/Profile';
import RequireAuth from './components/auth/RequireAuth';
import ProductsPage from './components/pages/ProductsPage';
import Wishlist from './components/pages/Wishlist';
import Layout from './components/layouts/Layout';
import { useAuthStore } from './components/auth/useAuthStore';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import ProductDetailPage from './components/pages/ProductDetailPage';
import CategoryProducts from './components/pages/CategoryPage';
import SearchResultsPage from './components/pages/SearchResultsPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import MyOrders from './components/pages/MyOdersPage';
import OrderSuccessPage from './components/pages/OrderSuccessPage';


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


