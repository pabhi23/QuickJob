import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Home from './Home/Home';
import Registration from './Registration/Registration'; 
import Login from './Login/Login'; 
<<<<<<< HEAD
import AccountPage from './Account/AccountPage'; 
import JobListing from './JobListing/JobListing';
=======
import ForgetPassword from './ForgetPassword/ForgetPassword'; 
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AccountPage from './Account/AccountPage';
>>>>>>> main

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD
        <Route path="/account" element={<AccountPage />} />
        <Route path="/joblisting" element={<JobListing />} />
=======
        <Route path="/forgetpassword" element={<ForgetPassword/>} />
        <Route path="/AdminDashboard" element={<AdminDashboard/>} />
        <Route path="/Account" element={<AccountPage/>} />
>>>>>>> main
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
