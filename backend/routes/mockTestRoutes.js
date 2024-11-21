const express = require('express');
const router = express.Router();

const mockQuestions = {
    React: [
        { id: 1, question: "What is React?", options: ["Library", "Framework", "Language", "Tool"], correct: "Library" },
        { id: 2, question: "What is JSX?", options: ["A syntax extension", "A library", "A template", "A tool"], correct: "A syntax extension" },
        { id: 3, question: "What is the virtual DOM?", options: ["A copy of the real DOM", "A browser feature", "An API", "None of these"], correct: "A copy of the real DOM" },
        { id: 4, question: "How do you create a component in React?", options: ["Function", "Class", "Both", "None"], correct: "Both" },
        { id: 5, question: "What is the use of `useState` hook?", options: ["State management", "API call", "Routing", "Event handling"], correct: "State management" },
        { id: 6, question: "What is React used for?", options: ["Developing UIs", "Database handling", "Server-side rendering", "Networking"], correct: "Developing UIs" },
        { id: 7, question: "What is a key in React?", options: ["A unique identifier", "A CSS property", "An API feature", "None"], correct: "A unique identifier" },
        { id: 8, question: "What is Prop Drilling?", options: ["Passing props deeply", "CSS management", "React debugging", "State manipulation"], correct: "Passing props deeply" },
        { id: 9, question: "What is Redux used for in React?", options: ["State management", "Styling", "Database management", "Testing"], correct: "State management" },
        { id: 10, question: "What is React Router?", options: ["A library for routing", "A database tool", "An animation library", "None"], correct: "A library for routing" },
    ],
    JavaScript: [
        { id: 11, question: "What is JavaScript?", options: ["Library", "Framework", "Programming Language", "Database"], correct: "Programming Language" },
        { id: 12, question: "Which symbol is used for comments?", options: ["//", "/*", "#", "%%"], correct: "//" },
        { id: 13, question: "What does `var` do?", options: ["Declares variables", "Defines arrays", "Links files", "None"], correct: "Declares variables" },
        { id: 14, question: "What is `this` in JavaScript?", options: ["Current context", "A keyword", "A library", "None"], correct: "Current context" },
        { id: 15, question: "What does `===` check in JavaScript?", options: ["Value and type", "Only value", "Type coercion", "None"], correct: "Value and type" },
        { id: 16, question: "What is a closure in JavaScript?", options: ["A function inside a function", "A loop", "An array", "None"], correct: "A function inside a function" },
        { id: 17, question: "What is the purpose of `let` and `const`?", options: ["Declare variables", "Create arrays", "Fetch data", "None"], correct: "Declare variables" },
        { id: 18, question: "What is hoisting?", options: ["Variable initialization", "Variable declaration moved to the top", "Event handling", "None"], correct: "Variable declaration moved to the top" },
        { id: 19, question: "What is an IIFE?", options: ["Immediately Invoked Function Expression", "API request", "CSS library", "None"], correct: "Immediately Invoked Function Expression" },
        { id: 20, question: "What is an event loop?", options: ["Handles async tasks", "Processes arrays", "Database handling", "None"], correct: "Handles async tasks" },
    ],
    HTML: [
        { id: 21, question: "What does HTML stand for?", options: ["HyperText Markup Language", "HyperText Machine Language", "HyperText Meta Language", "None"], correct: "HyperText Markup Language" },
        { id: 22, question: "Which tag is used for a paragraph?", options: ["<p>", "<div>", "<span>", "<h1>"], correct: "<p>" },
        { id: 23, question: "What is the purpose of `<a>` tag?", options: ["Link creation", "Text formatting", "Image insertion", "None"], correct: "Link creation" },
        { id: 24, question: "What is the `<img>` tag used for?", options: ["Displaying images", "Adding links", "Creating tables", "None"], correct: "Displaying images" },
        { id: 25, question: "What is the `<table>` tag used for?", options: ["Creating tables", "Inserting images", "Text alignment", "None"], correct: "Creating tables" },
        { id: 26, question: "What is the `<form>` tag used for?", options: ["Input submission", "Creating layouts", "Table creation", "None"], correct: "Input submission" },
        { id: 27, question: "What does the `<title>` tag do?", options: ["Sets page title", "Creates heading", "Adds metadata", "None"], correct: "Sets page title" },
        { id: 28, question: "What is the purpose of `<meta>` tag?", options: ["Adds metadata", "CSS linking", "JavaScript linking", "None"], correct: "Adds metadata" },
        { id: 29, question: "What does `<ul>` stand for?", options: ["Unordered list", "URL", "Underline", "None"], correct: "Unordered list" },
        { id: 30, question: "What is the purpose of the `<input>` tag?", options: ["User inputs", "Text formatting", "Adding links", "None"], correct: "User inputs" },
    ],
    Angular: [
        { id: 31, question: "What is Angular?", options: ["Library", "Framework", "Programming Language", "Database"], correct: "Framework" },
        { id: 32, question: "What is TypeScript?", options: ["A language", "A library", "A package", "None"], correct: "A language" },
        { id: 33, question: "What is a component in Angular?", options: ["A building block", "A CSS file", "A database entity", "None"], correct: "A building block" },
        { id: 34, question: "What is an Angular service?", options: ["Reusable code logic", "HTML tag", "CSS module", "None"], correct: "Reusable code logic" },
        { id: 35, question: "What is a directive?", options: ["Enhances HTML", "A CSS class", "A database query", "None"], correct: "Enhances HTML" },
        { id: 36, question: "What is two-way data binding?", options: ["Sync data", "Style management", "Event handling", "None"], correct: "Sync data" },
        { id: 37, question: "What is a module in Angular?", options: ["Container for app parts", "CSS file", "API", "None"], correct: "Container for app parts" },
        { id: 38, question: "What is Angular CLI?", options: ["Command Line Interface", "CSS library", "Database tool", "None"], correct: "Command Line Interface" },
        { id: 39, question: "What is the purpose of Angular Pipes?", options: ["Transform data", "Event handling", "CSS styling", "None"], correct: "Transform data" },
        { id: 40, question: "What is a decorator in Angular?", options: ["Annotates class", "Adds CSS", "Fetches data", "None"], correct: "Annotates class" },
    ],
};

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

