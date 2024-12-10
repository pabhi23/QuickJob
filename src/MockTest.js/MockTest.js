import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MockTest.css";

const MockTest = () => {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isPaymentDone, setIsPaymentDone] = useState(false);

  const navigate = useNavigate();

  // Check payment status on component mount
  useEffect(() => {
    const paymentStatus = localStorage.getItem("paymentDone");
    if (paymentStatus === "true") {
      setIsPaymentDone(true);
    }
  }, []);

  const topics = ["React", "JavaScript", "HTML", "Angular"];

  // Fetch questions for selected topic
  const handleTopicChange = async (e) => {
    const selectedTopic = e.target.value;
    setTopic(selectedTopic);
    setQuestions([]);
    setScore(null);

    if (selectedTopic) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mocktest/questions/${selectedTopic}`
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to fetch questions. Please try again.");
      }
    }
  };

  const handleOptionSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;

    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (userAnswer === q.correct) {
        correctCount++;
      }
    });

    // Set the score after submission
    setScore(correctCount);
  };

  if (!isPaymentDone) {
    return (
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>You need to complete the payment to access the Mock Test.</p>
        <button
          className="payment-button"
          onClick={() => navigate("/paymentGateway")}
        >
          Go to Payment
        </button>
      </div>
    );
  }

  return (
    <div className="mock-test">
      <h1 className="mock-test-header">Mock Test</h1>

      <div className="dropdown-container">
        <select onChange={handleTopicChange} value={topic} className="dropdown">
          <option value="">Select a Topic</option>
          {topics.map((t, index) => (
            <option key={index} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {questions.length > 0 && (
        <div className="questions-container">
          {questions.map((q, index) => (
            <div key={index} className="question-block">
              <h3 className="question">{q.question}</h3>
              <div className="options-container">
                {q.options.map((option, optIndex) => (
                  <label key={optIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => handleOptionSelect(index, option)} // Store answer when an option is selected
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="submit-button-container">
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {score !== null && (
        <div className="result-container">
          <h2>
            Your Score: {score}/{questions.length}
          </h2>
        </div>
      )}
    </div>
  );
};

export default MockTest;
