import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Home from './Home/Home';
import Registration from './Registration/Registration'; 
import Login from './Login/Login'; 
import AccountPage from './Account/AccountPage'; 
import JobListing from './JobListing/JobListing';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/joblisting" element={<JobListing />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
