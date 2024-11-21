import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Home from './Home/Home';
import Registration from './Registration/Registration'; 
import Login from './Login/Login'; 
import JobListing from './JobListing/JobListing';
import ForgetPassword from './ForgetPassword/ForgetPassword'; 
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AccountPage from './Account/AccountPage';
import ApplicationHistory from './ApplicationHistory/ApplicationHistory';
import SavedJobs from './SavedJobs/SavedJobs';

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
        <Route path="/JobListing" element={<JobListing/>} />
        <Route path="/ApplicationHistory" element={<ApplicationHistory/>} />
        <Route path="/SavedJobs" element={<SavedJobs/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
