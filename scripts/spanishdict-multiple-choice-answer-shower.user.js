// ==UserScript==
// @name SpanishDict Multiple Choice Answer Shower
// @namespace https://synchronousx.github.io/
// @description Show the answers to multiple choice questions on SpanishDict quizzes.
// @version 1.0.0
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
        showAnswer(getCorrectAnswerElement(getQuestion(quizData, getQuestionNumber(valueClass, questionNumberPattern)), answersClass), defaultAnswerClass, correctAnswerClass);
    };

    const buttonContainerClass = 'innerContainer--3JR02';

    const button = createButton(buttonText, buttonClass, onButtonClick);
    insertButton(button, buttonContainerClass);

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

    function getCorrectAnswerElement(question, answersClass) {
        const answerID = question.answerDisplayIndexes.indexOf(0);
        return document.getElementsByClassName(answersClass)[0].children[answerID];
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
})();
