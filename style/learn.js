// Learn Page JavaScript

// Sample questions data (fallback)
let questions = [
    {
        question: "Est debitis qui beat.",
        answers: [
            "Dolor vitae ut quo c.",
            "Excepturi exercitati.",
            "Deleniti soluta duis."
        ],
        correctAnswer: 1
    },
    {
        question: "Irure dicta consequa.",
        answers: [
            "Similique et beatae .",
            "Quisquam dignissimos."
        ],
        correctAnswer: 1
    },
    {
        question: "Question 3 text here.",
        answers: [
            "Answer 1 for question 3",
            "Answer 2 for question 3",
            "Answer 3 for question 3"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the capital of France?",
        answers: [
            "Paris",
            "London",
            "Berlin"
        ],
        correctAnswer: 1
    },
    {
        question: "Write the answer: What is 2 + 2?",
        type: "written",
        correctAnswer: "4"
    },
    {
        question: "Quisquam voluptatem quia.",
        answers: [
            "Voluptas et consequatur.",
            "Doloremque eos autem.",
            "Nobis tempora voluptas."
        ],
        correctAnswer: 2
    }
];

// Load flashcards from localStorage if available
function loadFlashcardsFromStorage() {
    const setId = localStorage.getItem('currentFlashcardSetId');
    if (!setId) return false;

    const flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
    const flashcardSet = flashcardSets.find(set => set.id === setId);

    if (!flashcardSet || !flashcardSet.flashcards || flashcardSet.flashcards.length === 0) {
        return false;
    }

    // Convert flashcards to questions format
    questions = flashcardSet.flashcards.map((card, index) => {
        // Create multiple choice question from flashcard
        // Use definition as question and term as correct answer
        const question = {
            question: card.definition || card.term,
            answers: [],
            correctAnswer: 1,
            type: 'multiple'
        };

        // Add correct answer
        question.answers.push(card.term);

        // Add some dummy answers (in real app, you'd generate better distractors)
        const otherCards = flashcardSet.flashcards.filter((c, i) => i !== index);
        if (otherCards.length > 0) {
            // Add 1-2 random terms from other cards as wrong answers
            const shuffled = otherCards.sort(() => 0.5 - Math.random());
            shuffled.slice(0, 2).forEach(c => {
                if (question.answers.length < 3) {
                    question.answers.push(c.term);
                }
            });
        }

        // Fill up to 3 answers if needed
        while (question.answers.length < 3) {
            question.answers.push(`Option ${question.answers.length + 1}`);
        }

        return question;
    });

    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    // Try to load flashcards from localStorage first
    const loadedFromStorage = loadFlashcardsFromStorage();

    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let answeredQuestions = [];
    let totalQuestions = questions.length;
    const currentProgressEl = document.getElementById('currentProgress');
    const totalProgressEl = document.getElementById('totalProgress');
    const questionTextEl = document.getElementById('questionText');
    const answersListEl = document.getElementById('answersList');
    const questionCard = document.getElementById('questionCard');
    const completionCard = document.getElementById('completionCard');

    // Update total questions if loaded from storage
    if (loadedFromStorage) {
        totalQuestions = questions.length;
    }

    // Initialize progress
    function updateProgress() {
        const currentQuestion = currentQuestionIndex + 1;
        if (currentProgressEl) {
            currentProgressEl.textContent = currentQuestion;
        }
        if (totalProgressEl) {
            totalProgressEl.textContent = totalQuestions;
        }

        // Update progress fill and badge position
        setTimeout(() => {
            const progressFillEl = document.getElementById('progressFill');
            const progressLineEl = document.querySelector('.learn-progress-line');
            if (progressFillEl && progressLineEl && currentProgressEl) {
                const lineWidth = progressLineEl.offsetWidth;
                const badgeWidth = 32;

                // Calculate badge position: distribute badges evenly along the line
                // For question 1 of 4: position at 0% (left edge)
                // For question 4 of 4: position at 100% (right edge)
                const position = totalQuestions > 1
                    ? ((currentQuestion - 1) / (totalQuestions - 1)) * (lineWidth - badgeWidth) + (badgeWidth / 2)
                    : badgeWidth / 2;

                // Green fill extends to the center of the current badge
                progressFillEl.style.width = position + 'px';
                currentProgressEl.style.left = position + 'px';
            }
        }, 10);
    }

    // Load question
    function loadQuestion(index) {
        if (index >= questions.length) {
            // All questions completed - show completion screen
            setTimeout(() => {
                showCompletionScreen();
            }, 100);
            return;
        }

        const question = questions[index];
        currentQuestionIndex = index;

        // Update question text
        if (questionTextEl) {
            questionTextEl.textContent = question.question;
        }

        // Update answer label based on question type
        const answersLabelEl = document.getElementById('answersLabel');
        if (answersLabelEl) {
            if (question.type === 'written') {
                answersLabelEl.textContent = 'Type your answer';
            } else {
                answersLabelEl.textContent = 'Choose an answer';
            }
        }

        // Update answers based on question type
        if (answersListEl) {
            answersListEl.innerHTML = '';

            if (question.type === 'written') {
                // Written question - show text input
                const writtenContainer = document.createElement('div');
                writtenContainer.className = 'written-answer-container';
                writtenContainer.innerHTML = `
                    <input type="text" class="written-answer-input" id="writtenAnswer" placeholder="Type your answer here..." autocomplete="off">
                    <button class="btn-submit-answer" onclick="submitWrittenAnswer()">Submit</button>
                `;
                answersListEl.appendChild(writtenContainer);
                answersListEl.classList.remove('answers-horizontal');

                // Focus on input and allow Enter key to submit
                setTimeout(() => {
                    const input = document.getElementById('writtenAnswer');
                    if (input) {
                        input.focus();
                        input.addEventListener('keypress', function (e) {
                            if (e.key === 'Enter') {
                                submitWrittenAnswer();
                            }
                        });
                    }
                }, 100);
            } else {
                // Multiple choice question
                question.answers.forEach((answer, idx) => {
                    const answerBtn = document.createElement('button');
                    answerBtn.className = 'answer-btn';
                    answerBtn.disabled = false;
                    answerBtn.onclick = function () { selectAnswer(this, idx + 1); };
                    answerBtn.innerHTML = `
                        <span class="answer-number">${idx + 1}</span>
                        <span class="answer-text">${answer}</span>
                    `;
                    answersListEl.appendChild(answerBtn);
                });

                // Update layout class based on number of answers
                if (question.answers.length === 2) {
                    answersListEl.classList.add('answers-horizontal');
                } else {
                    answersListEl.classList.remove('answers-horizontal');
                }
            }
        }

        updateProgress();
    }

    // Initialize
    loadQuestion(0);
    updateProgress();

    // Load theme
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            document.documentElement.classList.add('light-theme');
            document.querySelector('.dashboard-header')?.classList.add('light-theme');
            document.querySelector('.learn-main')?.classList.add('light-theme');
        }
    }

    // Load language
    function loadLanguage() {
        if (typeof applyLanguage !== 'undefined') {
            const savedLanguage = localStorage.getItem('language') || 'en-uk';
            applyLanguage(savedLanguage);
        }
    }

    // Initialize theme and language
    loadTheme();
    loadLanguage();

    // Show completion screen
    function showCompletionScreen() {
        if (questionCard) questionCard.style.display = 'none';
        if (completionCard) completionCard.style.display = 'block';

        // Use global correctAnswers if available
        const finalCorrectAnswers = window.correctAnswers !== undefined ? window.correctAnswers : correctAnswers;
        const percentage = totalQuestions > 0 ? Math.round((finalCorrectAnswers / totalQuestions) * 100) : 0;
        const progressPercentageEl = document.getElementById('progressPercentage');
        const correctCountEl = document.getElementById('correctCount');
        const totalCountEl = document.getElementById('totalCount');
        const completionProgressFillEl = document.getElementById('completionProgressFill');
        const termsListEl = document.getElementById('termsList');

        if (progressPercentageEl) progressPercentageEl.textContent = percentage + '%';
        if (correctCountEl) correctCountEl.textContent = finalCorrectAnswers;
        if (totalCountEl) totalCountEl.textContent = finalTotalQuestions;

        // Update progress bar fill
        if (completionProgressFillEl) {
            const percentageWidth = finalTotalQuestions > 0 ? (finalCorrectAnswers / finalTotalQuestions) * 100 : 0;
            completionProgressFillEl.style.width = percentageWidth + '%';
        }

        // Display terms studied
        if (termsListEl) {
            termsListEl.innerHTML = '';
            const finalAnsweredQuestions = window.answeredQuestions || answeredQuestions;
            if (finalAnsweredQuestions && finalAnsweredQuestions.length > 0) {
                finalAnsweredQuestions.forEach((item, idx) => {
                    const termItem = document.createElement('div');
                    termItem.className = 'term-item';
                    termItem.innerHTML = `
                        <div class="term-left">
                            <span class="term-text">${item.question}</span>
                        </div>
                        <div class="term-right">
                            <span class="term-answer">${item.selectedAnswer}</span>
                            <button class="btn-term-icon" type="button">
                                <i class="bi bi-star"></i>
                            </button>
                            <button class="btn-term-icon" type="button">
                                <i class="bi bi-volume-up"></i>
                            </button>
                        </div>
                    `;
                    termsListEl.appendChild(termItem);
                });
            }
        }
    }

    // Restart quiz
    window.restartQuiz = function () {
        currentQuestionIndex = 0;
        correctAnswers = 0;
        answeredQuestions = [];

        if (questionCard) questionCard.style.display = 'block';
        if (completionCard) completionCard.style.display = 'none';

        loadQuestion(0);
        updateProgress();
    };

    // Removed automatic keyboard restart - user must click Continue button

    // Make loadQuestion available globally
    window.loadQuestion = loadQuestion;
    window.currentQuestionIndex = currentQuestionIndex;
    window.correctAnswers = correctAnswers;
    window.answeredQuestions = answeredQuestions;
});

// Select answer function
window.selectAnswer = function (btn, answerNumber) {
    // Prevent multiple clicks
    if (btn.disabled) return;

    // Disable all answer buttons
    const allAnswers = document.querySelectorAll('.answer-btn');
    allAnswers.forEach(answer => {
        answer.disabled = true;
        answer.classList.remove('selected', 'correct', 'incorrect');
    });

    // Mark selected
    btn.classList.add('selected');

    // Get current question
    const currentQuestion = questions[window.currentQuestionIndex || 0];
    const selectedAnswerText = currentQuestion.answers[answerNumber - 1];

    // Simulate answer check
    setTimeout(() => {
        const isCorrect = answerNumber === currentQuestion.correctAnswer;

        if (isCorrect) {
            btn.classList.add('correct');
            btn.classList.remove('selected');
            // Increment correct answers count
            if (window.correctAnswers === undefined) {
                window.correctAnswers = 0;
            }
            window.correctAnswers = window.correctAnswers + 1;
        } else {
            btn.classList.add('incorrect');
            btn.classList.remove('selected');
            // Show correct answer
            const correctAnswerBtn = allAnswers[currentQuestion.correctAnswer - 1];
            if (correctAnswerBtn) {
                correctAnswerBtn.classList.add('correct');
            }
        }

        // Store answered question
        if (!window.answeredQuestions) {
            window.answeredQuestions = [];
        }
        window.answeredQuestions.push({
            question: currentQuestion.question,
            selectedAnswer: selectedAnswerText,
            isCorrect: isCorrect
        });

        // Move to next question after delay
        setTimeout(() => {
            if (window.loadQuestion) {
                window.currentQuestionIndex = (window.currentQuestionIndex || 0) + 1;
                window.loadQuestion(window.currentQuestionIndex);
            }
        }, 1500);
    }, 500);
};

// Submit written answer function
window.submitWrittenAnswer = function () {
    const input = document.getElementById('writtenAnswer');
    if (!input) return;

    const userAnswer = input.value.trim().toLowerCase();
    const currentQuestion = questions[window.currentQuestionIndex || 0];

    if (!userAnswer) {
        alert('Please enter an answer');
        return;
    }

    // Disable input and button
    input.disabled = true;
    const submitBtn = document.querySelector('.btn-submit-answer');
    if (submitBtn) submitBtn.disabled = true;

    // Check answer
    const correctAnswer = currentQuestion.correctAnswer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    // Show result
    setTimeout(() => {
        if (isCorrect) {
            input.classList.add('correct');
            if (window.correctAnswers === undefined) {
                window.correctAnswers = 0;
            }
            window.correctAnswers = window.correctAnswers + 1;
        } else {
            input.classList.add('incorrect');
            input.value = currentQuestion.correctAnswer;
            input.classList.add('show-correct');
        }

        // Store answered question
        if (!window.answeredQuestions) {
            window.answeredQuestions = [];
        }
        window.answeredQuestions.push({
            question: currentQuestion.question,
            selectedAnswer: userAnswer,
            isCorrect: isCorrect
        });

        // Move to next question after delay
        setTimeout(() => {
            if (window.loadQuestion) {
                window.currentQuestionIndex = (window.currentQuestionIndex || 0) + 1;
                window.loadQuestion(window.currentQuestionIndex);
            }
        }, 1500);
    }, 500);
};

