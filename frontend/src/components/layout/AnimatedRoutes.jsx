import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// pages
import Home from "./Home";
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";
import PendingApproval from "../../pages/auth/PendingApproval";

import ProductPage from "../../pages/products/ProductPage";
import ProductDetails from "../../pages/products/ProductDetails";
import SellProduct from "../../pages/products/SellProduct";

import Wishlist from "../../pages/user/Wishlist";
import Profile from "../../pages/user/Profile";
import MyDeals from "../../pages/user/MyDeals";

import Messages from "../../pages/messaging/Messages";

import SellerDashboard from "../../pages/dashboards/SellerDashboard";
import AdminDashboard from "../../pages/dashboards/AdminDashboard";
import DealPage from "../../pages/dashboards/DealPage";

import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/pending-approval" element={<PendingApproval />} />

        {/* protected */}
        <Route path="/sell" element={<ProtectedRoute><SellProduct /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

        {/* dashboards */}
        <Route path="/seller/dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/my-deals" element={<ProtectedRoute><MyDeals /></ProtectedRoute>} />
        <Route path="/deals/:dealId" element={<ProtectedRoute><DealPage /></ProtectedRoute>} />

      </Routes>
    </AnimatePresence>
  );
}