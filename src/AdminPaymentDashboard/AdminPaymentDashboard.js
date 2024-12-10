import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPaymentDashboard.css";

const AdminPaymentDashboard = () => {
  const [payments, setPayments] = useState([]);

  // Fetch payments from the backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/payments");
        const mappedPayments = response.data.map((payment) => ({
          id: payment.id,
          fullName: payment.full_name,
          paymentDate: new Date(payment.created_at).toLocaleDateString(),
          status: payment.status,
          amount: payment.amount,
        }));
        setPayments(mappedPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  // Toggle status between "Accepted" and "Rejected"
  const handleToggle = (id) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status: payment.status === "Accepted" ? "Rejected" : "Accepted",
            }
          : payment
      )
    );
  };

  return (
    <div className="admin-payment-dashboard">
      <h2>Admin Payment Dashboard</h2>
      <table className="payment-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Payment Date</th>
            <th>Payment Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.fullName}</td>
              <td>{payment.paymentDate}</td>
              <td>${payment.amount}</td>
              <td>{payment.status}</td>
              <td>
                <button
                  onClick={() => handleToggle(payment.id)}
                  className={`toggle-button ${payment.status.toLowerCase()}`}
                >
                  {payment.status === "Accepted" ? "Reject" : "Accept"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPaymentDashboard;
