const express = require('express');
const router = express.Router();

const mockQuestions = {
  React: [
    { question: "What is React?", options: ["Library", "Framework", "Language"], correct: "Library" },
    { question: "What is JSX?", options: ["A syntax extension", "A library", "A template"], correct: "A syntax extension" },
  ],
  JavaScript: [
    { question: "What is JavaScript?", options: ["Library", "Framework", "Programming Language"], correct: "Programming Language" },
    { question: "Which symbol is used for comments?", options: ["//", "/*", "#"], correct: "//" },
  ],
  HTML: [
    { question: "What does HTML stand for?", options: ["HyperText Markup Language", "HyperText Machine Language", "HyperText Meta Language"], correct: "HyperText Markup Language" },
    { question: "Which tag is used for a paragraph?", options: ["<p>", "<div>", "<span>"], correct: "<p>" },
  ],
  Angular: [
    { question: "What is Angular?", options: ["Library", "Framework", "Programming Language"], correct: "Framework" },
    { question: "What is TypeScript?", options: ["A language", "A library", "A package"], correct: "A language" },
  ],
};

// Define route
router.get('/questions/:topic', (req, res) => {
  const { topic } = req.params;
  const questions = mockQuestions[topic];

  if (questions) {
    res.status(200).json(questions);
  } else {
    res.status(404).json({ error: `No questions found for topic: ${topic}` });
  }
});

module.exports = router;

