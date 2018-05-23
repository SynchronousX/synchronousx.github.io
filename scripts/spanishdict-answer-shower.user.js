// ==UserScript==
// @name SpanishDict Answer Shower
// @namespace https://synchronousx.github.io/
// @description Show the answers to questions on SpanishDict quizzes.
// @version 1.3.0
// @author Synchronous
// @copyright 2018+, Synchronous
// @license MIT
// @homepageURL https://synchronousx.github.io/scripts
// @updateURL https://synchronousx.github.io/scripts/spanishdict-answer-shower.meta.js
// @downloadURL https://synchronousx.github.io/scripts/spanishdict-answer-shower.user.js
// @supportURL https://github.com/SynchronousX/synchronousx.github.io/issues
// @match *://www.spanishdict.com/quizzes/*/*
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    const valueClass = getClassByItsPrefix('value--', 'div');
    const valueElements = document.getElementsByClassName(valueClass);
    const questionFractionElement = valueElements[valueElements.length - 1];
    const questionNumberPattern = /^\d+(?=\/)/;

    const quizData = window.SD_QUIZ_DATA;

    const multipleChoiceType = 'multiple_choice';
    const shortAnswerType = 'fill_in_the_blank';

    let multipleChoiceAnswersClass;

    let defaultMultipleChoiceAnswerClass;
    let correctMultipleChoiceAnswerClass;

    let inputBoxClass;
    let correctionClass;

    let button;
    const buttonText = 'Show Answer';
    let buttonClass;
    const buttonContainerClass = getClassByItsPrefix('innerContainer--', 'div');

    const onButtonClick = () => {
        const question = getQuestion(quizData, getQuestionNumber(valueClass, questionNumberPattern));
        switch (getQuestionType(question)) {
            case multipleChoiceType:
                multipleChoiceAnswersClass = getClassByItsPrefix('answers--', 'ol');
                defaultMultipleChoiceAnswerClass = getClassByItsPrefix('notSelected--', 'button').split(' ')[0];
                correctMultipleChoiceAnswerClass = getCorrectMultipleChoiceAnswerClassFromStylesheets();
                showCorrectMultipleChoiceAnswer(getCorrectMultipleChoiceAnswerElement(getCorrectMultipleChoiceAnswerIndex(question), multipleChoiceAnswersClass), defaultMultipleChoiceAnswerClass, correctMultipleChoiceAnswerClass);
                break;
            case shortAnswerType:
                inputBoxClass = getClassByItsPrefix('inputBox--', 'div');
                correctionClass = getCorrectionClassFromStylesheets();
                showCorrectShortAnswerAnswer(getCorrectShortAnswerText(question));
                break;
        }
    };

    loadCorsStlyes(() => {
        buttonClass = getButtonClassFromStylesheets();
        button = createButton(buttonText, buttonClass, onButtonClick);
        insertButton(button, buttonContainerClass);
        setButtonTextOnQuestionChange(button, buttonText, questionFractionElement);
    });

    const percentCorrectProgressBarStrokeDasharray = 304.735;

    window.setScore = function(percentCorrect) {
        document.getElementsByClassName(getClassByItsPrefix('title--', 'h2'))[0].textContent = getResultMessage(percentCorrect);
        document.getElementsByClassName(getClassByItsPrefix('number--', 'div'))[0].textContent = percentCorrect + '%';
        document.getElementsByClassName(getClassByItsPrefix('CircularProgressbar-path', 'path'))[0].style.strokeDashoffset = percentCorrectProgressBarStrokeDasharray * (1 - percentCorrect / 100) + 'px';
    };

    let resultContainerClass;
    const scoreInput = document.createElement('input');
    scoreInput.type = 'number';
    scoreInput.style.position = 'absolute';
    scoreInput.style.top = 0;
    scoreInput.style.bottom = 0;
    scoreInput.style.left = 0;
    scoreInput.style.right = 0;
    scoreInput.style.height = '1em';
    scoreInput.style.width = '5em';
    scoreInput.style.margin = 'auto';
    scoreInput.style.textAlign = 'center';
    scoreInput.addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            hideScoreInput();
            setScore(parseInt(scoreInput.value));
        }
    });
    let scoreInputVisible = false;
    bindDoubleClickEvent();

    function getClassByItsPrefix(classPrefix, selector = '*') {
        let matchedClass;
        document.querySelectorAll(selector).forEach(element => {
            if (element.className.startsWith(classPrefix)) {
                matchedClass = element.className;
            }
        });

        return matchedClass;
    }

    function loadCorsStlyes(cb) {
        const originalStylesheetAmount = document.styleSheets.length;
        const xhrs = [];
        for (let i = 0; i < originalStylesheetAmount; ++i) {
            let xhr = new XMLHttpRequest();
            xhrs.push(xhr);
            xhr.open('GET', document.styleSheets[i].href);

            xhr.onload = () => {
                xhr.onload = null;
                let styleElement = document.createElement('style');
                styleElement.appendChild(document.createTextNode(xhr.responseText));
                document.head.appendChild(styleElement);
                styleElement.disabled = true;

                let xhrsDone = true;
                xhrs.forEach(xhr => {
                    if (xhr.readyState !== 4) {
                        xhrsDone = false;
                        return;
                    }
                });

                if (xhrsDone && xhrs.length === originalStylesheetAmount) {
                    cb();
                }
            };

            xhr.send();
        }


    }

    function getButtonClassFromStylesheets() {
        for (let i = 0; i < document.styleSheets.length; ++i) {
            let cssRules;
            try {
                cssRules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
            } catch (e) {
                if (e.name === 'SecurityError') {
                    continue;
                }

                throw e;
            }

            let matchesFound = 0;
            for (let j = 0; j < cssRules.length; ++j) {
                if (cssRules[j].selectorText && cssRules[j].selectorText.startsWith('.button--') && ++matchesFound === 4) {
                    return cssRules[j].selectorText.substring(1);
                }
            }
        }
    }

    function getCorrectMultipleChoiceAnswerClassFromStylesheets() {
        for (let i = 0; i < document.styleSheets.length; ++i) {
            let cssRules;
            try {
                cssRules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
            } catch (e) {
                if (e.name === 'SecurityError') {
                    continue;
                }

                throw e;
            }

            for (let j = 0; j < cssRules.length; ++j) {
                if (cssRules[j].selectorText && cssRules[j].selectorText.startsWith('.correct--')) {
                    return cssRules[j].selectorText.substring(1);
                }
            }
        }
    }

    function getCorrectionClassFromStylesheets() {
        for (let i = 0; i < document.styleSheets.length; ++i) {
            let cssRules;
            try {
                cssRules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
            } catch (e) {
                if (e.name === 'SecurityError') {
                    continue;
                }

                throw e;
            }

            for (let j = 0; j < cssRules.length; ++j) {
                if (cssRules[j].selectorText && cssRules[j].selectorText.startsWith('.correction--')) {
                    return cssRules[j].selectorText.substring(1);
                }
            }
        }
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

    function getQuestionType(question) {
        return question.type;
    }

    function getCorrectMultipleChoiceAnswerIndex(question) {
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

    function getCorrectMultipleChoiceAnswerElement(correctAnswerIndex, multipleChoiceAnswersClass) {
        return document.getElementsByClassName(multipleChoiceAnswersClass)[0].children[correctAnswerIndex];
    }

    function showCorrectMultipleChoiceAnswer(correctAnswerElement, defaultMultipleChoiceAnswerClass, correctMultipleChoiceAnswerClass) {
        const button = correctAnswerElement.children[0];
        button.classList.remove(defaultMultipleChoiceAnswerClass);
        button.classList.add(correctMultipleChoiceAnswerClass);
    }

    function getCorrectShortAnswerText(question) {
        return question.correctAnswer;
    }

    function showCorrectShortAnswerAnswer(correctAnswerText) {
        const outerSpanElement = document.createElement('span');
        document.getElementsByClassName(inputBoxClass)[0].appendChild(outerSpanElement);
        outerSpanElement.className = correctionClass;
        const innerSpanElement = document.createElement('span');
        outerSpanElement.appendChild(innerSpanElement);
        innerSpanElement.textContent = correctAnswerText;
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

    function setButtonTextOnQuestionChange(button, buttonText, questionFractionElement) {
        new MutationObserver(() => {
            button.textContent = buttonText;
        }).observe(questionFractionElement, {
            characterData: true,
            subtree: true
        });
    }

    function getResultMessage(percentCorrect) {
        return percentCorrect === 100 ? '¡Perfecto!' : percentCorrect >= 80 ? '¡Bien hecho!' : percentCorrect >= 60 ? '¡Nada mal!' : '¡Sigue practicando!';
    }

    function bindDoubleClickEvent() {
        function onDoubleClick() {
            const resultContainers = document.getElementsByClassName(resultContainerClass);
            if (resultContainers.length > 0) {
                resultContainers[0].ondblclick = showScoreInput;
            } else {
                setTimeout(onDoubleClick);
            }
        }

        resultContainerClass = getClassByItsPrefix('textWrapper--', 'div');
        onDoubleClick();
    }

    function showScoreInput() {
        if (!scoreInputVisible) {
            const resultContainer = document.getElementsByClassName(resultContainerClass)[0];
            resultContainer.childNodes.forEach(childNode => childNode.style.visibility = 'hidden');
            resultContainer.appendChild(scoreInput);
            scoreInput.focus();
            scoreInputVisible = true;
        }
    }

    function hideScoreInput() {
        if (scoreInputVisible) {
            const resultContainer = document.getElementsByClassName(resultContainerClass)[0];
            resultContainer.removeChild(scoreInput);
            resultContainer.childNodes.forEach(childNode => childNode.style.visibility = '');
            scoreInputVisible = false;
        }
    }
})();
