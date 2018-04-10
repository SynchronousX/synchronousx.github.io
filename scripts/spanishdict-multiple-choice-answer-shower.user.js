// ==UserScript==
// @name SpanishDict Multiple Choice Answer Shower
// @namespace https://synchronousx.github.io/
// @description Show the answers to multiple choice questions on SpanishDict quizzes.
// @version 1.1.0
// @author Synchronous
// @copyright 2018+, Synchronous
// @license MIT
// @homepageURL https://synchronousx.github.io/scripts
// @updateURL https://synchronousx.github.io/scripts/spanishdict-multiple-choice-answer-shower.meta.js
// @downloadURL https://synchronousx.github.io/scripts/spanishdict-multiple-choice-answer-shower.user.js
// @supportURL https://github.com/SynchronousX/synchronousx.github.io/issues
// @match *://www.spanishdict.com/quizzes/*/*
// ==/UserScript==

(function() {
    'use strict';

    const valueClass = 'value--mF79K';
    const questionNumberPattern = /^\d+(?=\/)/;

    const quizData = window.SD_QUIZ_DATA;

    const answersClass = 'answers--SSVGi';

    const defaultAnswerClass = 'notSelected--1FD4M';
    const correctAnswerClass = 'correct--1BHxT';

    const buttonText = 'Show Answer';
    const buttonClass = 'button--3u7px';
    const onButtonClick = function() {
        showAnswer(getCorrectAnswerElement(getCorrectAnswerIndex(getQuestion(quizData, getQuestionNumber(valueClass, questionNumberPattern))), answersClass), defaultAnswerClass, correctAnswerClass);
    };

    const buttonContainerClass = 'innerContainer--3JR02';

    const button = createButton(buttonText, buttonClass, onButtonClick);
    insertButton(button, buttonContainerClass);

    const resultMessageSelector = 'h2.title--MrNvJ';
    const percentCorrectClass = 'number--3tdOb';
    const percentCorrectProgressBarClass = 'CircularProgressbar-path';
    const percentCorrectProgressBarStrokeDasharray = 304.735;

    window.setScore = function(percentCorrect) {
        document.querySelector(resultMessageSelector).textContent = getResultMessage(percentCorrect);
        document.getElementsByClassName(percentCorrectClass)[0].textContent = percentCorrect + '%';
        document.getElementsByClassName(percentCorrectProgressBarClass)[0].style.strokeDashoffset = percentCorrectProgressBarStrokeDasharray * (1 - percentCorrect / 100) + 'px';
    }

    function getQuestionNumber(valueClass, questionNumberPattern) {
        const valueElements = document.getElementsByClassName(valueClass);
        const questionFractionElement = valueElements[valueElements.length - 1];
        const questionFraction = questionFractionElement.textContent;
        return parseInt(questionFraction.match(questionNumberPattern)[0]);
    }

    function getQuestion(quizData, questionNumber) {
        const questionID = quizData.questionDisplayIndexes[questionNumber - 1];
        return quizData.questions[questionID];
    }

    function getCorrectAnswerIndex(question) {
        const answerIndices = new Set();
        for (let i = 1; i < 5; ++i) {
            if (question['incorrectAnswer' + i]) {
                answerIndices.add(i);
            }
        }

        let correctAnswerIndex = 0;
        for (const answerIndex of question.answerDisplayIndexes) {
            if (!answerIndex) {
                return correctAnswerIndex;
            }

            if (answerIndices.has(answerIndex)) {
                correctAnswerIndex += 1;
            }
        }
    }

    function getCorrectAnswerElement(correctAnswerIndex, answersClass) {
        return document.getElementsByClassName(answersClass)[0].children[correctAnswerIndex];
    }

    function showAnswer(correctAnswerElement, defaultAnswerClass, correctAnswerClass) {
        const button = correctAnswerElement.children[0];
        button.classList.remove(defaultAnswerClass);
        button.classList.add(correctAnswerClass);
    }

    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.onclick = onClick;
        return button;
    }

    function insertButton(button, parentClass) {
        document.getElementsByClassName(parentClass)[0].appendChild(button);
    }

    function getResultMessage(percentCorrect) {
        return percentCorrect === 100 ? '¡Perfecto!' : percentCorrect >= 80 ? '¡Bien hecho!' : percentCorrect >= 60 ? '¡Nada mal!' : '¡Sigue practicando!';
    }
})();
