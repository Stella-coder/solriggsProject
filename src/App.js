import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './LandingPage/Homepage';
import Products from './LandingPage/Product';
import Header from './components/Header';
import LoginOptions from './components/LoginOptions';
// import FormPage from './company/AddProduct';
import CompanyRegistrationForm from './company/RegisterCompany';
import Dashboard from './company/Dashboard';
import SignPage from './company/SignPage';
import LayoutWithSidebar from './company/Layout';
import CompanyProductPage from './company/CompanyProducts';
import AddProduct from './company/AddProduct';
import ProductDescriptionPage from './company/ProductDescription';
import TransactionTrackingPage from './company/TransactionPage';
import Footer from './LandingPage/Footer';
import Checkout from './payment/Checkout';
import AdminDashboard from './admin/AdminDashboard';
import CompanyDetail from './admin/ViewDetails';

// List of routes where Header should not be displayed
const hiddenHeaderRoutes = ['/dashboard', "/myproducts", "/addproduct", "/transaction"] ;
const hiddenFooterRoutes = ['/dashboard', "/myproducts", "/addproduct", "/transaction", "/login"] ;


const App = () => {
  const location = useLocation();
  const shouldHideHeader = hiddenHeaderRoutes.includes(location.pathname);
  const shouldHideFooter = hiddenFooterRoutes.includes(location.pathname);


  return (
    <div>
      {!shouldHideHeader && <Header />} {/* Conditionally render Header */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/viewdetail/:id" element={<CompanyDetail />} />
        <Route path="/product/:companyUid/:productId"  element={<ProductDescriptionPage />} />
        {/* <Route path="/productdescription" element={<ProductDescriptionPage />} /> */}
        <Route path="/dashboard" element={<LayoutWithSidebar><Dashboard /></LayoutWithSidebar>} />
        <Route path="/myproducts" element={<LayoutWithSidebar><CompanyProductPage /></LayoutWithSidebar>} />
        <Route path="/addproduct" element={<LayoutWithSidebar><AddProduct /></LayoutWithSidebar>} />
        <Route path="/transaction" element={<LayoutWithSidebar><TransactionTrackingPage /></LayoutWithSidebar>} />
        <Route path="/sign" element={<SignPage />} />
        <Route path="/companyRegistration" element={<CompanyRegistrationForm />} />
        <Route path="/loginOptions" element={<LoginOptions />} />
      </Routes>
      {!shouldHideHeader && <Footer />}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
