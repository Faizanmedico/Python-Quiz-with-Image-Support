        document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const startScreen = document.getElementById('start-screen');
            const quizScreen = document.getElementById('quiz-screen');
            const resultsScreen = document.getElementById('results-screen');
            
            const startBtn = document.getElementById('start-btn');
            const nextBtn = document.getElementById('next-btn');
            const tryAgainBtn = document.getElementById('try-again-btn');
            
            const questionElement = document.getElementById('question');
            const optionsElement = document.getElementById('options');
            const questionImage = document.getElementById('question-image');
            const currentQuestionElement = document.getElementById('current-question');
            const totalQuestionsElement = document.getElementById('total-questions');
            const timeLeftElement = document.getElementById('time-left');
            
            const correctAnswersElement = document.getElementById('correct-answers');
            const totalQuestionsResultElement = document.getElementById('total-questions-result');
            const percentageElement = document.getElementById('percentage');
            const feedbackElement = document.getElementById('feedback');
            const timeSpentElement = document.getElementById('time-spent');

            // Dark Mode Elements
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            const toggleIcon = document.querySelector('.toggle-icon');
            const toggleText = document.querySelector('.toggle-btn span:last-child');

            // Quiz Variables
            let currentQuestionIndex = 0;
            let score = 0;
            let timer;
            let timeLeft = 15;
            let startTime;
            let totalTimeSpent = 0;

            // Quiz Questions (converted to your preferred format)
            const questions = [
                {
                    question: 'What is a correct syntax to output "Hello World" in Python?',
                    answers: [
                        { text: 'echo("Hello World");', correct: false },
                        { text: 'p("Hello World")', correct: false },
                        { text: 'print("Hello World")', correct: true },
                        { text: 'echo "Hello World"', correct: false }
                    ],
                    image: "2.png"
                },
                {
                    question: 'Which character is used for comments in Python?',
                    answers: [
                        { text: '//', correct: false },
                        { text: '<!--', correct: false },
                        { text: '#', correct: true },
                        { text: '/*', correct: false }
                    ],
                    image: "1.png"
                },

                {
                  question: "What is the capital of France?",
                  answers: [
                      { text: "London", correct: false },
                      { text: "Paris", correct: true },
                      { text: "Berlin", correct: false },
                      { text: "Madrid", correct: false }
                  ]
              },
              {
                  question: "Which language runs in a web browser?",
                  answers: [
                      { text: "Java", correct: false },
                      { text: "C", correct: false },
                      { text: "Python", correct: false },
                      { text: "JavaScript", correct: true }
                  ]
              },
              {
                  question: "What does HTML stand for?",
                  answers: [
                      { text: "Hypertext Markup Language", correct: true },
                      { text: "Hypertext Machine Language", correct: false },
                      { text: "Hyper Transfer Markup Language", correct: false },
                      { text: "High-level Text Management Language", correct: false }
                  ]
              },
              {
                  question: "What year was JavaScript launched?",
                  answers: [
                      { text: "1996", correct: false },
                      { text: "1995", correct: true },
                      { text: "1994", correct: false },
                      { text: "None of the above", correct: false }
                  ]
              },
              {
                  question: "Which of these is not a JavaScript framework?",
                  answers: [
                      { text: "React", correct: false },
                      { text: "Angular", correct: false },
                      { text: "Laravel", correct: true },
                      { text: "Vue", correct: false }
                  ]
              }
                // Add all your questions here in the same format
                // I've included 2 as examples, you would add all 100
            ];

            // Check for saved dark mode preference
            const savedDarkMode = localStorage.getItem('darkMode') === 'true';
            if (savedDarkMode) {
                document.body.classList.add('dark-mode');
                toggleIcon.textContent = '☀️';
                toggleText.textContent = 'Light Mode';
            }

            // Dark Mode Toggle
            darkModeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');
                
                // Update icon and text
                toggleIcon.textContent = isDarkMode ? '☀️' : '🌙';
                toggleText.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
                
                // Save preference
                localStorage.setItem('darkMode', isDarkMode);
            });

            // Start Quiz
            startBtn.addEventListener('click', startQuiz);
            tryAgainBtn.addEventListener('click', startQuiz);

            // Next Question
            nextBtn.addEventListener('click', nextQuestion);

            function startQuiz() {
                currentQuestionIndex = 0;
                score = 0;
                totalTimeSpent = 0;
                startTime = new Date().getTime();
                
                startScreen.classList.add('hide');
                quizScreen.classList.remove('hide');
                resultsScreen.classList.add('hide');
                
                totalQuestionsElement.textContent = questions.length;
                showQuestion();
            }

            function showQuestion() {
                nextBtn.disabled = true;
                timeLeft = 15;
                timeLeftElement.textContent = timeLeft;
                clearInterval(timer);
                timer = setInterval(updateTimer, 1000);

                const question = questions[currentQuestionIndex];
                currentQuestionElement.textContent = currentQuestionIndex + 1;
                questionElement.textContent = question.question;
                
                // Show image if available
                if (question.image) {
                    questionImage.src = question.image;
                    questionImage.classList.remove('hide');
                } else {
                    questionImage.classList.add('hide');
                }
                
                optionsElement.innerHTML = '';
                question.answers.forEach(answer => {
                    const button = document.createElement('button');
                    button.classList.add('option');
                    button.textContent = answer.text;
                    button.addEventListener('click', () => selectAnswer(answer.correct, button));
                    optionsElement.appendChild(button);
                });
            }

            function updateTimer() {
                timeLeft--;
                timeLeftElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    revealCorrectAnswer();
                }
            }

            function selectAnswer(isCorrect, selectedButton) {
                clearInterval(timer);
                
                // Disable all options
                const options = document.querySelectorAll('.option');
                options.forEach(option => {
                    option.disabled = true;
                    option.style.pointerEvents = 'none';
                });
                
                // Highlight selected answer
                if (isCorrect) {
                    selectedButton.classList.add('correct');
                    score++;
                } else {
                    selectedButton.classList.add('incorrect');
                    // Highlight correct answer
                    options.forEach(option => {
                        if (option.textContent === questions[currentQuestionIndex].answers.find(a => a.correct).text) {
                            option.classList.add('correct');
                        }
                    });
                }
                
                nextBtn.disabled = false;
            }

            function revealCorrectAnswer() {
                const options = document.querySelectorAll('.option');
                options.forEach(option => {
                    option.disabled = true;
                    option.style.pointerEvents = 'none';
                    
                    if (option.textContent === questions[currentQuestionIndex].answers.find(a => a.correct).text) {
                        option.classList.add('correct');
                    }
                });
                
                nextBtn.disabled = false;
            }

            function nextQuestion() {
                // Calculate time spent on this question
                totalTimeSpent += (15 - timeLeft);
                
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion();
                } else {
                    showResults();
                }
            }

            function showResults() {
                clearInterval(timer);
                
                // Calculate total time spent
                const endTime = new Date().getTime();
                totalTimeSpent = Math.floor((endTime - startTime) / 1000);
                const minutes = Math.floor(totalTimeSpent / 60);
                const seconds = totalTimeSpent % 60;
                timeSpentElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                // Calculate percentage
                const percentage = Math.round((score / questions.length) * 100);
                
                // Set results
                correctAnswersElement.textContent = score;
                totalQuestionsResultElement.textContent = questions.length;
                percentageElement.textContent = `${percentage}%`;
                
                // Set feedback based on score
                if (percentage >= 90) {
                    feedbackElement.textContent = "Excellent! You're a Python expert!";
                    feedbackElement.style.backgroundColor = "var(--success-color)";
                    percentageElement.style.color = "var(--success-color)";
                } else if (percentage >= 70) {
                    feedbackElement.textContent = "Good job! You know Python well!";
                    feedbackElement.style.backgroundColor = "var(--warning-color)";
                    percentageElement.style.color = "var(--warning-color)";
                } else if (percentage >= 50) {
                    feedbackElement.textContent = "Not bad! Keep practicing!";
                    feedbackElement.style.backgroundColor = "var(--warning-color)";
                    percentageElement.style.color = "var(--warning-color)";
                } else {
                    feedbackElement.textContent = "Keep studying! You'll get better!";
                    feedbackElement.style.backgroundColor = "var(--danger-color)";
                    percentageElement.style.color = "var(--danger-color)";
                }
                
                quizScreen.classList.add('hide');
                resultsScreen.classList.remove('hide');
            }
        });
