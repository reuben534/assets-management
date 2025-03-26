import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AssetManagement from './pages/AssetManagement';
import UserManagement from './pages/UserManagement';
import RequestManagement from './pages/RequestManagement';
import ReportManagement from './pages/ReportManagement';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/assets" element={<AssetManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/requests" element={<RequestManagement />} />
          <Route path="/reports" element={<ReportManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;