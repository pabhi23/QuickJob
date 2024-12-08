import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Home from "./Home/Home";
import Registration from "./Registration/Registration";
import Login from "./Login/Login";
import ForgetPassword from "./ForgetPassword/ForgetPassword";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AccountPage from "./Account/AccountPage";
import JobPostings from "./JobPostings/JobPostings";
import JobSearch from "./JobSearch/JobSearch";
import ResumeBuilder from "./ResumeBuilder/ResumeBuilder";
import ApplicationManagement from "./ApplicationManagement/ApplicationManagement";
import ResumeUpload from "./ResumeUpload/ResumeUpload";
import JobAlertsPage from "./JobAlerts/JobAlertsPage";
import EmpProfUpdate from "./EmpProfUpdate/EmpProfUpdate";
import PaymentGateway from "./PaymentGateway/PaymentGateway";
import MockTest from "./MockTest.js/MockTest";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Account" element={<AccountPage />} />
        <Route path="/JobPostings" element={<JobPostings />} />
        <Route path="/search" element={<JobSearch />} />
        <Route
          path="/ApplicationManagement"
          element={<ApplicationManagement />}
        />
        <Route path="/ResumeBuilder" element={<ResumeBuilder />} />
        <Route path="/ResumeUpload" element={<ResumeUpload />} />
        <Route path="/jobalerts" element={<JobAlertsPage />} />
        <Route path="/EmpProfUpdate" element={<EmpProfUpdate />} />
        <Route path="/PaymentGateway" element={<PaymentGateway />} />
        <Route path="/mockTest" element={<MockTest />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
