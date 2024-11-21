import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MockTest.css'; // Importing the CSS

const MockTest = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const topics = ['React', 'JavaScript', 'HTML', 'Angular']; // Topics for dropdown

  const handleTopicChange = async (e) => {
    const selectedTopic = e.target.value;
    setTopic(selectedTopic);
    setQuestions([]);
    setScore(null);

    if (selectedTopic) {
      try {
        const response = await axios.get(`http://localhost:5000/api/mocktest/questions/${selectedTopic}`);
        setQuestions(response.data); // Assume API returns a list of questions
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Failed to fetch questions. Please try again.');
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
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

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
          {questions.map((q) => (
            <div key={q.id} className="question-block">
              <h3 className="question">{q.question}</h3>
              <div className="options-container">
                {q.options.map((option, index) => (
                  <label key={index} className="option-label">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      onChange={() => handleOptionSelect(q.id, option)}
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
          <h2>Your Score: {score}/{questions.length}</h2>
        </div>
      )}
    </div>
  );
};

export default MockTest;
