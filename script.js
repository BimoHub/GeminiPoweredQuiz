// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-txt");
const answersContainer = document.getElementById ("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById ("max-score");
const resultMessage = document.getElementById ("result-message");
const restartButton = document.getElementById("restart-btn"); 
const progressBar = document.getElementById("progress");

//for article part
const articleURLInput = document.getElementById("article-url-input");


// array of quiz-questions

const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];


// QUIZ STATE VARS

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false; //double click misinput prevention

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

//event listeners

// startButton.addEventListener("click",startQuiz)
restartButton.addEventListener("click",restartQuiz)

function startQuiz(){
    // reset 
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = 0;

    //making start screen inactive and quiz screen active
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    
    showQuestion();

}

function showQuestion(){
    //reset state

    answersDisabled =false;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;

    progressBar.style.width = progressPercent + "%";

    questionText.textContent = currentQuestion.question;

    
    
    answersContainer.innerHTML ="";

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("answer-btn");


        //wht is dataset? Dataset is a property with which you can add a custom data to btn
        button.dataset.correct = answer.correct;

        button.addEventListener("click", selectAnswer);
  
        answersContainer.appendChild(button);
    })

}

function selectAnswer(event) {
    //optimization only
    if(answersDisabled) return
    answersDisabled = true;

    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true";

    Array.from(answersContainer.children).forEach(button => {
        if (button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        else if (button === selectedButton) {
            button.classList.add("incorrect");
        }
    });

    if(isCorrect) {
        score++;
        scoreSpan.textContent=score;
    }

    setTimeout(() => {
        currentQuestionIndex++;

        //check if there are more questions or if quiz is over
        if(currentQuestionIndex < quizQuestions.length) {
            showQuestion()
        }
        else{
            showResults()
        }
    },1000);

}

function showResults() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScoreSpan.textContent = score;

    const percentage = (score/quizQuestions.length) * 100;

    if(percentage === 100) {
    resultMessage. textContent = "Perfect!";}
    else if (percentage >= 60){
    resultMessage. textContent = "Great job!";
    } 
    else if (percentage >= 60) {
        resultMessage.textContent = "Good effort!";
    } 
    else if (percentage >= 40) {
        resultMessage.textContent = "Not bad!"
    } 
    else {
        resultMessage. textContent = "Bad!";
        }
    }


function restartQuiz(){
    resultScreen.classList.remove("active");

        startQuiz();
    }



//ARTICLE
//AIzaSyB8RSaHQadM3zewdUh81EK73NbZbjBG_IE

const GOOGLE_API_KEY = "AIzaSyB8RSaHQadM3zewdUh81EK73NbZbjBG_IE";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

//validate URL, pass articleURL later to this func unc
function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  }
  catch (error) {
    return false;
  }
}

//func to generate quiz
async function generateQuizFromURL(articleURL) {
  const prompt = 
  `
  Read the article at this URL: ${articleURL}

  Generate exactly 5 multiple-choice quiz questions to test comprehension of the article.

  Return ONLY a valid JSON array with this exact structure:
  [
    {
      "question": "question text here",
      "answers": [
        {"text": "answer 1", "correct": false},
        {"text": "answer 2", "correct": true},
        {"text": "answer 3", "correct": false},
        {"text": "answer 4", "correct": false}
      ]
    }
  ]

  Requirements:
  - Exactly 5 questions about the article content
  - Each question has 4 answer choices
  - Only one correct answer per question
  - Test key concepts and important information
  - Return ONLY the JSON array, no markdown, no explanation

  `;

    try {
        // Make the API call
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //Tells the server that the data im sending is JSON.
            },
            body: JSON.stringify({ 
              //so content(part(text())) is the structure gemini expects.
              // this is why we use this structure, even though contents and parts are empty

              //in other complex contexts, there can be multiple parts such as text and attachments.
              //that is what 'parts' are 

              //contents can also have multiple parts. Also it has other elements such as roles.
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        //Get response data
        const data = await response.json();

        //check errs
        if (data.error) {
            throw new Error(data.error.message || 'Oops. API error. Glory to Google.');
        }

        //check if we got valid response
        if (!data.candidates || data.candidates.length === 0) {
          throw new Error("Oops. API ghosted you. Try your ex?.");
        }

        //Extract text from response
        const responseText = data.candidates[0].content.parts[0].text;

        //clean up response from any markdown formatting
        const cleanedText = responseText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        //Parse JSON
        const questions = JSON.parse(cleanedText);

        //validate we got array now
        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error("Oops. API messed up your quiz questions.");
        }

        return questions;
      } 
    catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  //Handler function upon btn click
  async function handleGenerateFromURL() {
    const articleURL = articleURLInput.value.trim();
  
    if (!articleURL) {
      alert("Please enter a URL. URL as in U Retarded Loser");
      return;
    }

    if (!isValidURL(articleURL)) {
      alert("Please enter a valid URL. URL as in U Retarded Loser (with http:// or https://)");
      return;
    }

    //LOADING
    startButton.textContent = "Loading...";
    startButton.disabled = true;

    try {
      
      //call API
      const generatedQuestions = await generateQuizFromURL(articleURL);

      //replace start screen with quiz screen
      quizQuestions.length = 0;
      quizQuestions.push(...generatedQuestions);

      totalQuestionsSpan.textContent = quizQuestions.length;
      maxScoreSpan.textContent = quizQuestions.length;

      startScreen.classList.remove("active");
      quizScreen.classList.add("active");
      showQuestion();
      

    } catch (error) {
      alert(error.message);
    } finally {
      startButton.textContent = "Start Quiz";
      startButton.disabled = false;
    }
  }

  startButton.addEventListener("click", handleGenerateFromURL);
