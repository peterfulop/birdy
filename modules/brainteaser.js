import * as global from './global.js';
import * as app from '../script/app.js';
import * as st from './state.js';
const state = st.state;

export function brainTeaserScope() {

    let DOM = {};
    const Global = global.GlobalObjectScope();

    let excInfo = {};

    let defDOMelementss = () => {
        return {
            mainContent: document.querySelector(".main-content"),
            dictionaryNameSelect: document.getElementById("dictionary-name-select"),
            excerciseNameSelect: document.getElementById("excercise-name-select"),
            runtimeNameSelect: document.getElementById("runtime-name-select"),
            countManualBox: document.getElementById("set-word-count-section"),
            setCountManual: document.getElementById("set-word-count-input"),
            excerciseStartButton: document.getElementById("excercise-button-start"),
        }
    }

    function buildBrainTeaserPage() {

        renderBrainTeaserHTML();
        DOM = defDOMelementss();
        dictionaryNameSelectmethod();
        excerciseStartSelectmethod();
        runtimeNameSelectmethod();
        validateCountInput();

    }


    function renderBrainTeaserHTML() {

        const mainContent = document.querySelector(".main-content");

        Global.renderDictionaryListInput(mainContent);
        renderExcerciseTypeInput(mainContent);
        renderExcerciseRuntimeInput(mainContent);
        renderBrainTeaserStartButton(mainContent);

        function renderExcerciseTypeInput(contener) {

            contener.innerHTML += `
        <div class= "select-dictionary mb-3">
            <label for="" class="form-label">Gyakorlási forma:</label>
            <select class="form-select" id="excercise-name-select">
            </select>
        </div>
        `
            renderExcerciseTypeOptions();
        }
        function renderExcerciseTypeOptions() {
            const content = document.getElementById("excercise-name-select");
            content.innerHTML = '';
            Object.values(excerciseTypes).map(item => {
                content.innerHTML += `<option value = "${item.value}">${item.name}</option>`;
            });
        }

        function renderExcerciseRuntimeInput(contener) {

            var wordCount = setEnabledWordsCount();

            contener.innerHTML += `
            <div class= "select-dictionary mb-3">
                <label for="" class="form-label">Gyakorlás hossza:</label>
                <select class="form-select" id="runtime-name-select">
                </select>
            </div>
            <div class="mb-3 display-none" id="set-word-count-section">
                <label for="" class="form-label">Kikérdezett szavak mennyisége:</label>
                <input type="number" class="form-control " id="set-word-count-input" max="${wordCount}" min="1" value = "${wordCount}">
            </div>
            `
            renderExcerciseRuntimeOptions();
        }

        function renderExcerciseRuntimeOptions() {

            var content = document.getElementById("runtime-name-select");
            content.innerHTML = '';
            Object.values(excerciseRunTime).map(item => {
                content.innerHTML += `<option value="${item.value}">${item.name}</option>`;
            });
        }

        function renderBrainTeaserStartButton(contener) {

            contener.innerHTML += `
            <div class="excercise-header-start">
                <button class="btn btn-success" id="excercise-button-start" type="">Start!</button>
            </div>
            `
        }

    }


    function dictionaryNameSelectmethod() {

        DOM.dictionaryNameSelect.addEventListener("change", () => {
            updateRunTimeCount();
        })
    }


    function excerciseStartSelectmethod() {

        DOM.excerciseStartButton.addEventListener("click", () => {
            excInfo = defineExcercise();
            const excercise = BrainTeaserExcerciseScope();
            excercise.buildBrainTeaserExcercise();

        })
    }

    function updateRunTimeCount() {

        const wordCount = setEnabledWordsCount();
        DOM.setCountManual.max = wordCount;
        DOM.setCountManual.value = wordCount;
        excInfo = defineExcercise();
    }

    function setEnabledWordsCount() {

        let dictionaryNameSelect = document.getElementById("dictionary-name-select");
        return state.dictionaries[dictionaryNameSelect.value].lexicon.length;
    }

    var defineExcercise = () => {

        state.dictionaryID = DOM.dictionaryNameSelect.value;
        state.selectedDictionary = DOM.dictionaryNameSelect[DOM.dictionaryNameSelect.value].dataset.dictid;
        state.dictionaryName = DOM.dictionaryNameSelect[DOM.dictionaryNameSelect.value].textContent;

        return excInfo = {
            maxValue: state.dictionaries[DOM.dictionaryNameSelect.value].lexicon.length,
            dictionary: DOM.dictionaryNameSelect.value,
            excIndex: DOM.excerciseNameSelect.value,
            timeIndex: DOM.runtimeNameSelect.value,
            countIndex: DOM.setCountManual.value
        };
    }


    function runtimeNameSelectmethod() {

        const wordCount = setEnabledWordsCount();

        DOM.runtimeNameSelect.addEventListener("change", () => {

            if (DOM.runtimeNameSelect.value == 1) {
                DOM.countManualBox.classList.remove("display-none");
                DOM.setCountManual.value = wordCount;
                updateRunTimeCount();
            }
            else {
                DOM.countManualBox.classList.add("display-none");
                updateRunTimeCount();
            }
        })
    }

    function validateCountInput() {

        DOM.setCountManual.addEventListener("change", () => {

            var maxValue = setEnabledWordsCount();

            if (DOM.setCountManual.value > maxValue) {
                DOM.setCountManual.value = maxValue;
            }
            if (DOM.setCountManual.value <= 0) {
                DOM.setCountManual.value = 1;
            }
            excInfo = defineExcercise();
        })

    }

    function renderBrainTeaserExcerciseHTML() {

        document.querySelector(".main-content").innerHTML = `
        <div class="excercise-box">

            <div class="excercise-header-info">

                <div class="header-section-text-1">
                    <label id="minutes">00</label>:<label id="seconds">00</label>
                </div>

                <div class="header-section-text-2">
                    <span id="number-of-excercise">1</span>/<span id="count-of-numbers">1</span>
                </div>

                <div class="header-section-text-3">
                    <span id="help-counter">0</span><i class="fas fa-lightbulb" id="point-bulb-icon"></i>
                </div>

            </div>

            <div class="question-answer-boxes">

                <div class="questions-section-box">
                    <div class="d-flex align-items-center question-box-value">
                        <p data-lang=""></p>
                        <i class="fas fa-volume-up listening-mode" id="listening-mode-brain"></i>
                    </div>
                </div>

                <div class="answer-section-box d-flex justify-content-between">

                    <div class="answer-box-value hidden">
                        <p></p>
                    </div>

                    <div class="hidden">
                         <p class="helper-box-value" id="help-text"></p>
                    </div>
                   

                </div>

            </div>

            <div class="excercise-input-section">

                    <div class="answer-box-input">
                        <input type="text" class="form-control" id="answer-box-input" value=""  tabindex="0" required>
                    </div>

                    <div class="d-flex button-box w-100">

                        <div class="w-100 me-2">
                            <button class="btn btn-success w-100" id="answer-button-accept" title="Válasz beküldése" type="button">Tovább!</button>
                        </div>

                        <div class="d-flex justify-content-end">
                        <button class="btn btn-warning btn-small mx-2" id="help-button" title="Segítség kérése" type="button"><i class="far fa-lightbulb text-light"></i></button>
                        <button class="btn btn-secondary btn-small mx-2" id="answer-button-next" title="Következő kérdés" type="button"><i class="fas fa-step-forward"></i></button>
                        <button class="btn btn-danger btn-small ms-2" id="stop-excercise" title="Befejezés" data-bs-toggle="modal" data-bs-target="#${Global.dialogObjects['exitExcercise'].id}" type="button"><i class="fas fa-stop"></i></button>
                    </div>
                </div>
            </div>
        </div>
            `
    };


    var excerciseTypes = Object.freeze([
        {
            name: "Idegenről magyar nyelvre",
            value: 0
        },
        {
            name: "Magyar nyelvről idegenre",
            value: 1
        },
        {
            name: "Véletlenszerű kikérdezés",
            value: 2
        }
    ]);

    var excerciseRunTime = Object.freeze([
        {
            name: "Teljes szótár tartalma",
            value: 0
        },
        {
            name: "Manuális értékadás",
            value: 1
        },
        {
            name: "Futás megszakításig",
            value: 2
        }
    ]);


    function BrainTeaserExcerciseScope() {

        let DOM = {};

        const excerciseData = {
            indexPuffer: [],
            totalSeconds: 0,
            helpCounter: 0,
            question: '',
            answer: '',
            yourAnswers: [],
            startTermin: undefined,
            endTermin: undefined,
            dictionary: undefined,
            maxNumber: undefined,
        };

        var defDOMelements = () => {
            return {
                questionBox: document.querySelector(".question-box-value"),
                questionBoxText: document.querySelector(".question-box-value > p"),
                answerBox: document.querySelector(".answer-box-value"),
                answerBoxText: document.querySelector(".answer-box-value > p"),
                excerciseInputSection: document.querySelector(".excercise-input-section"),
                answerBoxInput: document.getElementById("answer-box-input"),
                answerBoxAcceptButton: document.getElementById("answer-button-accept"),
                minutesLabel: document.getElementById("minutes"),
                secondsLabel: document.getElementById("seconds"),
                numberOfExcercise: document.getElementById("number-of-excercise"),
                countOfNumbers: document.getElementById("count-of-numbers"),
                helpButton: document.getElementById('help-button'),
                helpCounterText: document.getElementById("help-counter"),
                helpText: document.getElementById("help-text"),
            }
        }

        function buildBrainTeaserExcercise() {

            renderBrainTeaserExcerciseHTML();
            DOM = defDOMelements();
            readExcerciseWord();
            startExcerciseMethod();
            stopBrainTeaserExcercise();
        };


        function readExcerciseWord() {
            const listeningModeBtn = document.getElementById("listening-mode-brain");
            listeningModeBtn.onclick = function () {
                Global.startSpeech(DOM.questionBoxText.dataset.lang, DOM.questionBoxText.innerText);
            }
        }

        function clearExcercisePuffers() {
            excerciseData.indexPuffer = [];
            excerciseData.totalSeconds = 0;
        }

        function startExcerciseMethod() {
            Global.showDialogPanel('exitExcercise');
            clearExcercisePuffers();
            renderExcerciseHTML();
            skipAnswer();
            answerEventClick();
            answerEventEnter();
            setInterval(setTime, 1000);
        }


        function showAnswer(count = true) {

            count ? excerciseData.helpCounter++ : '';

            DOM.helpText.classList.add("fadeIn");
            DOM.helpCounterText.innerText = excerciseData.helpCounter;
            DOM.helpText.innerHTML = excerciseData.answer;

            setTimeout(() => {
                DOM.helpText.classList.remove("fadeIn");
                DOM.helpText.classList.add("fadeOut");
            }, 1000);

        }


        function giveHelp() {
            DOM.helpButton.onclick = function () {
                showAnswer();
            }
        }


        function renderExcerciseHTML() {

            let content = askSomething();

            if (content) {
                DOM.questionBoxText.innerHTML = content.questionWord;
                DOM.questionBoxText.dataset.lang = content.language;
                content.randomText.splice(content.randomText.indexOf(content.questionWord), 1);
                excerciseData.answer = content.randomText[0];
                excerciseData.question = content.questionWord;
                giveHelp();
            }
        }


        function askSomething() {


            if (excerciseData.startTermin === undefined) excerciseData.startTermin = new Date().toLocaleString();
            if (excerciseData.dictionary === undefined) excerciseData.dictionary = state.dictionaryName;

            var maxNumber = excInfo.timeIndex === 0 ? excInfo.maxNumber : excInfo.countIndex;
            var randomIndex = randomIntGenerator(0, excInfo.maxValue - 1);

            if (excerciseData.maxNumber === undefined) excerciseData.maxNumber = maxNumber;

            if (excInfo.timeIndex == 2 && excerciseData.indexPuffer.length == maxNumber) {
                console.log('restart progress!');
                clearExcercisePuffers();
                maxNumber = excInfo.timeIndex === 0 ? excInfo.maxNumber : excInfo.countIndex;
                randomIndex = randomIntGenerator(0, maxNumber - 1);
            }

            if (excerciseData.indexPuffer.length == maxNumber) {
                if (excerciseData.endTermin === undefined) excerciseData.endTermin = new Date().toLocaleString();
                console.log(excerciseData);
                buildExcerciseOutcome();
                return false;
            }
            else {
                hideQuestionBox();

                while (excerciseData.indexPuffer.includes(randomIndex)) {
                    randomIndex = randomIntGenerator(0, maxNumber - 1);
                }

                excerciseData.indexPuffer.push(randomIndex);

                var randomText = [];
                randomText.push(state.dictionaries[excInfo.dictionary].lexicon[randomIndex].word_1);
                randomText.push(state.dictionaries[excInfo.dictionary].lexicon[randomIndex].word_2);
                var questionIndex = excInfo.excIndex == 2 ? randomIntGenerator(0, 1) : excInfo.excIndex;

                const questionWord = randomText[questionIndex]; // return

                var speachLangIndex = state.dictionaries[excInfo.dictionary].lexicon[randomIndex];

                const language = questionIndex == 0 ? speachLangIndex.lang_1 : speachLangIndex.lang_2; //return 

                DOM.numberOfExcercise.innerHTML = excerciseData.indexPuffer.length;
                DOM.countOfNumbers.innerHTML = maxNumber;


                showQuestionBox();
                DOM.answerBoxInput.focus();

                return {
                    questionWord,
                    language,
                    randomText,
                };
            }

        }

        function answerEventClick() {
            DOM.answerBoxAcceptButton.addEventListener('click', () => {
                if (DOM.answerBoxInput.value != "") {
                    sendAnswer();
                }
            });
        }

        function answerEventEnter() {
            DOM.answerBoxInput.addEventListener("keyup", (event) => {
                if (DOM.answerBoxInput.value != "" && event.keyCode === 13) {
                    sendAnswer();
                }
            });
        }

        function skipAnswer() {

            var skipButton = document.getElementById('answer-button-next');

            skipButton.addEventListener('click', () => {
                saveUserAnswers();
                DOM.answerBox.classList.remove('hidden');
                DOM.answerBoxText.innerHTML = DOM.answerBoxInput.value;
                DOM.answerBoxInput.value = "";
                hideAnswerBox();
                renderExcerciseHTML();
            });
        }

        function saveUserAnswers() {
            excerciseData.yourAnswers.push({ question: excerciseData.question, answer: DOM.answerBoxInput.value.toLowerCase(), solution: excerciseData.answer });
        };

        function sendAnswer() {
            showAnswer(false);
            saveUserAnswers();
            DOM.answerBox.classList.remove('hidden');
            DOM.answerBoxText.innerHTML = DOM.answerBoxInput.value.toLowerCase();
            DOM.answerBoxInput.value = "";
            setTimeout(hideAnswerBox, 1000);
            setTimeout(renderExcerciseHTML, 1000);
        };

        function hideAnswerBox() {
            DOM.answerBoxText.innerHTML = '';
            DOM.answerBox.classList.add('hidden');
        };

        function hideQuestionBox() {
            DOM.questionBox.classList.add("display-none");
        };

        function showQuestionBox() {
            DOM.questionBox.classList.remove("display-none");
        };

        function randomIntGenerator(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        function stopBrainTeaserExcercise() {

            var stopExcercise = document.getElementById("stop-excercise");
            stopExcercise.onclick = () => {
                document.getElementById('dialogAcceptButton').onclick = () => {
                    backToBrainTeaserPage();
                }
            };
        };

        function backToBrainTeaserPage() {
            app.AppVisualisationScope().menu_load_methods().menu_load_brainteaser();
        };


        function buildExcerciseOutcome() {

            Global.showDialogPanel('exportExcercise');
            renderExcerciseOutcomeHTML();
            exportBrainTeaserExcercise();
        };


        function renderExcerciseOutcomeHTML() {

            document.querySelector(".main-content").innerHTML = `

           <div class="d-flex justify-content-center mb-4" id="outcome-header">
                <h3>Eredmény<h3>
            </div>

            <div class="d-block m-3" id="outcome-excercie-data">

                <div class="d-flex justify-content-between" id="outcome-dictionary">
                    <div class="">
                        <span class="m-1 text-secondary">Szótár:</span>
                    </div>
                    <div class="" id="outcome-dictionary-name">
                        <small class="m-1">${excerciseData.dictionary}</small>
                    </div>
                </div>

                <div class="d-flex justify-content-between" id="outcome-start-date">
                    <div class="">
                        <span class="m-1 text-secondary">Start time:</span>
                    </div>
                    <div class="">
                        <small class="m-1">${excerciseData.startTermin}</small>
                    </div>
                </div>

                <div class="d-flex justify-content-between" id="outcome-end-date">
                    <div class="">
                        <span class="m-1 text-secondary">End time:</span>
                    </div>
                    <div class="">
                        <small class="m-1">${excerciseData.endTermin}</small>
                    </div>
                </div>

                <div class="d-flex justify-content-around my-3" id="outcome-duration">
                    <div class="d-flex col-3 flex-column align-items-center">
                        <p class="m-1"><i class="h3 text-primary fas fa-stopwatch"></i></p>
                        <span>${excerciseData.totalSeconds} sec</span>
                    </div>
                    <div class="d-flex col-3 flex-column align-items-center">
                        <p class="m-1"><i class="h3 text-secondary fas fa-list-ol"></i></p>
                        <span>${excerciseData.maxNumber}</span>
                    </div>
                    <div class="d-flex col-3 flex-column align-items-center">
                        <p class="m-1"><i class="h3 text-danger fas fa-times"></i></p>
                        <span>${excerciseData.yourAnswers.filter(item => item.answer === "").length}</span>
                    </div>
                    <div class="d-flex col-3 flex-column align-items-center">
                        <p class="m-1"><i class="h3 text-warning fas fa-lightbulb"></i></p>
                        <span>${excerciseData.helpCounter}</span>
                    </div>
                </div>
            </div>


            <div class="d-block" id="outcome-issue-block">
                ${renderIssueBlockHTML()}
            </div>

            <div class="d-flex button-box m-2 justify-content-between">

                <div class="d-flex me-2 col-3">
                    <button class="btn btn-secondary w-100" id="back-button" title="Vissza" type="button">Vissza</button>
                </div>
                <div class="d-flex ms-2 col-8">
                    <button class="btn btn-primary w-100" id="export-excercise-btn" title="Exportálás" type="button" data-bs-toggle="modal" data-bs-target="#${Global.dialogObjects['exportExcercise'].id}">Export</button>
                </div>
            </div>

            `
            document.getElementById('back-button').addEventListener('click', () => backToBrainTeaserPage());
        };

        function renderIssueBlockHTML() {

            let innerHTML = '';

            excerciseData.yourAnswers.map(item => {
                innerHTML += `
                    <div class="d-flex flex-column issue-list-element">
                        <div class="d-flex align-items-center issue-question-row border-bottom">
                            <span class="m-1 text-secondary">Kérdés:</span>
                            <small class="ms-2">${item.question}</small>
                        </div>
                        <div class="d-flex align-items-center issue-answer-row border-bottom">
                            <span class="m-1 text-secondary">Válaszod:</span>
                            <small class="ms-2">${item.answer === "" ? '<i class="fas fa-times"></i>' : item.answer}</small>
                        </div>
                        <div class="d-flex align-items-center issue-solution-row">
                            <span class="m-1 text-secondary">Megoldás:</span>
                            <small class="ms-2">${item.solution}</small>
                        </div>
                    </div>
                `
            })

            return innerHTML;

        };


        function exportBrainTeaserExcercise() {

            var exportExcercise = document.getElementById('export-excercise-btn');
            exportExcercise.onclick = () => {
                document.getElementById('dialogAcceptButton').onclick = () => {
                    console.log('back to....')
                    backToBrainTeaserPage();
                }
            };
        };




        function setTime() {
            ++excerciseData.totalSeconds;
            DOM.secondsLabel.innerHTML = pad(excerciseData.totalSeconds % 60);
            DOM.minutesLabel.innerHTML = pad(parseInt(excerciseData.totalSeconds / 60));
        };

        function pad(val) {
            var valString = val + "";
            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        };

        return {
            buildBrainTeaserExcercise
        }

    };

    return {
        buildBrainTeaserPage
    }
};

