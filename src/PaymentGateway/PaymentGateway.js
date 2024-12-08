import React, { useState } from "react";
import axios from "axios";
import "./PaymentGateway.css";

const PaymentGateway = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    cardName: "",
    cardNumber: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/payment", paymentDetails);
      alert(response.data.message);
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  return (
    <div className="payment-gateway-container">
      <h2>Payment Gateway</h2>
      <form className="payment-form" onSubmit={handlePayment}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={paymentDetails.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={paymentDetails.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={paymentDetails.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardName">Name on Credit Card</label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={paymentDetails.cardName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Credit Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="password"
            id="cvv"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="pay-button">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentGateway;
