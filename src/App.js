import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Home from './Home/Home';
import Registration from './Registration/Registration'; 
import Login from './Login/Login'; 
import ForgetPassword from './ForgetPassword/ForgetPassword'; 
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AccountPage from './Account/AccountPage';
import ApplicationManagement from './ApplicationManagement/ApplicationManagement';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword/>} />
        <Route path="/AdminDashboard" element={<AdminDashboard/>} />
        <Route path="/Account" element={<AccountPage/>} />
        <Route path="/applicationManagement" element={<ApplicationManagement />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
