// var sourceFile = 'passage_exp.json';
var sourceFile = 'passage.json';
var csvFile = 'result';
var wordDelay;

var currentPassageIndex;
var currentPassage;
var answer = "";
var experimentRes = {};
var response;
var data;
let csvContent = 'conditionName,passageCode,answer\n';


const conditions = {
    1: "OriginalRSVP",
    2: "ThreeWordsRSVP",
    3: "SlidingRSVP",
    // 4: "SlidingRSVPNarrow",
    // 5: "OneLineRSVP"
}

var conditionIndex;
var conditionName;
var conditionData;

var articleIndices;

const totalConditions = 1;
var ConditionCounter = 1;
var visitedArticles = [];
var visitedConditions = [];

$(document).ready(function () {

    // Handler for start experiment button
    $('#startExperimentButton').click(async function () {
        const title = document.getElementById("consent_form");
        title.style.display = "none";
        $(this).prop('disabled', true);

        // Show prompt to ask for participant id
        const participantId = prompt("Please enter your participant id:");

        response = await fetch(sourceFile);
        data = await response.json();

        // Add participant id to csvFile
        csvFile = csvFile + '_' + encodeURIComponent(participantId) + '.csv';

        startNextCondition();

    });
});

function startNextCondition() {
    const nextStepbutton = document.getElementById("nextStep");
    nextStepbutton.style.display = "none";

    const title = document.getElementById("consent_form");
    title.style.display = "none";

    console.log("start, condition counter = " + ConditionCounter);
    if (ConditionCounter <= totalConditions) {
        conditionIndex = generateRandomCondtionIndex();
        console.log("con index:" + conditionIndex);
        conditionName = conditions[conditionIndex];
        // conditionData = experimentData[conditionName];

        articleIndices = generateRandomArticleIndex();

        if (conditionIndex === 1) {
            console.log("ExpRSVP");

            currentPassageIndex = 0;
            GoToExperimentRSVP();
        }

        else if (conditionIndex === 2) {
            console.log("3WRSVP");
            currentPassageIndex = 0;
            GoTo3WRSVP();
            // Experiment3Words();
        }

        else if (conditionIndex === 3) {
            console.log("SlidingNarrowRSVP");
            currentPassageIndex = 0;
            GoToscrollingRSVP();
            // ExperimentSlidingNarrow();
        }

        // else if (conditionIndex === 3) {
        //     console.log("SlidingRSVP")
        //     currentPassageIndex = 0;
        //     ExperimentSliding();
        // }

        // else if (conditionIndex === 5) {
        //     console.log("OneLineRSVP");
        //     currentPassageIndex = 0;
        //     ExperimentOneLineRSVP();
        // }
    }
    else {
        // all conditions are finished, start to download
        displayPreferenceQuestions();
    }
}

// Function to simulate waiting for condition completion
function waitForConditionCompletion(callback) {
    // Replace with your logic to wait for condition completion
    setTimeout(callback, 2000); // Simulating a 2-second delay
}

function generateRandomCondtionIndex() {
    var randomNumber = Math.floor(Math.random() * 4) + 1;
    while (visitedConditions.includes(randomNumber)) {
        randomNumber = Math.floor(Math.random() * 4) + 1;
    }
    visitedConditions.push(randomNumber);
    console.log("generated random condition index = " + randomNumber);
    return randomNumber;
    // return 2;
}

function generateRandomArticleIndex() {
    var result = [0, 0, 0, 0, 0, 0, 0];
    for (var i=0; i < 6; i++){
    while(visitedArticles.includes(result[i])){
        result[i] = Math.floor(Math.random() * 21) + 1;
    }
    visitedArticles.push(result[i]);
    }
    return result;
    // return [0, 1, 0];
}

function GoToExperimentRSVP() {
    const ori_ins_co = document.getElementById("instructionContainer");
    ori_ins_co.style.display = "flex";

    const ori_ins = document.getElementById("instruction");
    ori_ins.style.display = "block";

    const instruction = ["Welcome to this version of the Reading Task! \n",
        "In this task, you will read 7 different texts. ",
        "After reading each text, you will answer a reading comprehension question about the text.",
        "After reading all 7 texts, you will be asked to answer some questions related to your experience while reading under this reading condition.",
        "Let us look at the experimental timeline in some more detail!\n",
        " ",
        "In this task, a cross with appear on the screen to help orient you before the passage appears. \n",
        "You will then be presented with a passage; however, you will read this passage one word at a time. ",
        "That is, beginning from the first word, the words will be presented in the centre of the screen sequentially. \n",
        "After reading the text, you will be directed to a multiple choice question. ",
        "Please read the question and select the best answer with respect to the text you read. ",
        "Once you answer the question, press submit to lock it in.  ",
        "Once you press start, the next trial will begin where you will read a text and answer a question about it. \n",
        "Remember, read the text, answer the question, and move on to the next.\n"
    ]

    instruction.forEach(function (text, index) {
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = text;
        paragraphElement.classList.add("instructions");
        ori_ins.appendChild(paragraphElement);
    })

    const but = document.getElementById("startButton");
    but.style.display = "flex";
}

function GoTo3WRSVP() {
    const ori_ins_co = document.getElementById("instructionContainer");
    ori_ins_co.style.display = "flex";

    const ori_ins = document.getElementById("instruction");
    ori_ins.style.display = "block";

    const instruction = ["Welcome to this version of the Reading Task! \n",
        "In this task, you will read 7 different texts. ",
        "After reading each text, you will answer a reading comprehension question about the text.",
        "After reading all 7 texts, you will be asked to answer some questions related to your experience while reading under this reading condition.",
        "Let us look at the experimental timeline in some more detail!\n",
        " ",
        "In this task, a cross will appear on the screen to help orient you before the passage appears.",
        "You will then be presented with a passage, but you will read this passage three words at a time.",
        "The three words will consist of a previous word, a current word, and a next word.",
        "The current word will be highlighted with a black box for better visibility.",
        "Starting from the first set of three words, they will be displayed in the center of the screen sequentially.",
        "After reading the text, you will be directed to a multiple-choice question.",
        "Please read the question and select the best answer with respect to the text you read.",
        "Once you answer the question, press submit to lock it in.",
        "When you press start, the next trial will begin where you will read another set of three words and answer a question about them.",
        "Remember, read the three words (previous, current, and next), answer the question, and move on to the next set of three words.",
        "The current word will be highlighted with a black box to indicate which word to focus on during reading."
    ]

    instruction.forEach(function (text, index) {
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = text;
        paragraphElement.classList.add("instructions");
        ori_ins.appendChild(paragraphElement);
    })

    const but = document.getElementById("startButton");
    but.style.display = "flex";
}

function GoToscrollingRSVP() {
    const ori_ins_co = document.getElementById("instructionContainer");
    ori_ins_co.style.display = "flex";

    const ori_ins = document.getElementById("instruction");
    ori_ins.style.display = "block";

    const instruction = ["Welcome to this version of the Reading Task! \n",
        "In this task, you will read 7 different texts. ",
        "After reading each text, you will answer a reading comprehension question about the text.",
        "After reading all 7 texts, you will be asked to answer some questions related to your experience while reading under this reading condition.",
        "Let us look at the experimental timeline in some more detail!\n",
        " ",
        "In this task, a cross will initially appear on the screen to help orient you.",
        "Following that, a passage will be presented, scrolling from right to left inside a centered box.",
        "The passage will be displayed in its entirety, allowing you to read it continuously.",
        "The text will be highlighted using a black box to improve visibility.",
        "After reading the passage, you will be directed to a multiple-choice question related to the text you just read.",
        "Please carefully read the question and choose the best answer based on the entire passage.",
        "Once you have made your selection, press submit to confirm your response.",
        "Each trial will begin with a new passage to read and a question to answer.",
        "Remember, read the text, answer the question, and move on to the next.\n"]

    instruction.forEach(function (text, index) {
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = text;
        paragraphElement.classList.add("instructions");
        ori_ins.appendChild(paragraphElement);
    })

    const but = document.getElementById("startButton");
    but.style.display = "flex";
}



function displayPlusSymbol() {
    console.log("plused")
    const next = document.getElementById("nextStep");
    next.style.display = "none";

    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "none";

    const plusSymbol = document.getElementById('plusSymbol');
    plusSymbol.style.display = 'block';

    setTimeout(() => {
        plusSymbol.style.display = 'none';

        if (conditionIndex === 1) {
            console.log("ExpRSVP");
            ExperimentRSVP();
        }

        else if (conditionIndex === 2) {
            console.log("3WRSVP");
            Experiment3Words();
        }

        else if (conditionIndex === 3) {
            console.log("SlidingRSVP")
            ExperimentSliding();
        }

        else if (conditionIndex === 4) {
            console.log("SlidingNarrowRSVP");
            ExperimentSlidingNarrow();
        }

        else if (conditionIndex === 5) {
            console.log("OneLineRSVP");
            ExperimentOneLineRSVP();
        }

    }, 100);
}


function startCondition() {
    const ins_container = document.getElementById("instructionContainer");
    ins_container.style.display = "none";


    displayPlusSymbol();
}

function ExperimentRSVP() {
    // check if all the passages are displayed
    console.log("articleIndices.length = " + articleIndices.length);
    console.log(articleIndices);
    console.log(currentPassageIndex);
    if (currentPassageIndex >= articleIndices.length) {
        console.log("finished all passage");
        displayIndividualQuestions();

        return;
    }

    // get current passage
    currentPassage = data[articleIndices[currentPassageIndex]];

    const text = currentPassage.passage;
    const words = text.split(' ');

    displayPassageRSVP(words, displayQuestion);
}

function displayPassageRSVP(words, callback) {

    const next = document.getElementById("nextStep");
    next.style.display = "none";

    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "none";

    const passageElement = document.getElementById("content");
    passageElement.style.display = "flex";

    console.log(words.length)
    const contentElement = document.getElementById('content');

    words.forEach((word, index) => {
        setTimeout(() => {
            contentElement.textContent = word;

            setTimeout(() => {

                contentElement.textContent = '';

                if (index === words.length - 1 && typeof callback === 'function') {
                    console.log("finished, go to display question");
                    callback();
                }
            }, 250);
        }, index * 300); // total time = 250ms + 50ms
    });
}

async function Experiment3Words() {

    if (currentPassageIndex >= articleIndices.length) {
        console.log("3w: finished all passage");
        displayIndividualQuestions();
        return;
    }

    currentPassage = data[articleIndices[currentPassageIndex]];
    const text = currentPassage.passage
    const words = text.split(' ');
    words.unshift(' ');
    words.push(' ');

    displayPassage3WRSVP(words);
}


function displayPassage3WRSVP(words) {
    const next = document.getElementById("nextStep");
    next.style.display = "none";

    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "none";

    const passageElement = document.getElementById("content3w");
    passageElement.style.display = "flex";

    const previousWordElement = document.getElementById('prevWord');
    const currentWordElement = document.getElementById('currWord');
    const nextWordElement = document.getElementById('nextWord');

    let index = 1;
    const interval = setInterval(() => {
        if (index >= words.length - 1) {
            clearInterval(interval);
            displayQuestion();

            return;
        }

        previousWordElement.innerHTML = index > 0 ? words[index - 1] + '&nbsp;' : '';
        currentWordElement.innerHTML = words[index];
        currentWordElement.style.fontWeight = 'bold';
        nextWordElement.innerHTML = index < words.length - 1 ? '&nbsp;' + words[index + 1] : '';

        index++;
    }, 300);

    // Calculate the width of the parent container and the total width of all word elements
    // const containerWidth = passageElement.offsetWidth;
    // const totalWordsWidth = previousWordElement.offsetWidth + currentWordElement.offsetWidth + nextWordElement.offsetWidth;

    // // Calculate the left position of 'currWord' so that it remains centered
    // const leftPosition = (containerWidth - currentWordElement.offsetWidth) / 2;

    // // Calculate the space to be distributed on each side of 'currWord'
    // const spaceToDistribute = (containerWidth - totalWordsWidth) / 2;

    // // Set the left position of 'currWord' to center it
    // currentWordElement.style.left = leftPosition + 'px';

    // // Set the margin-left of 'prevWord' and 'nextWord' to create equal spacing
    // previousWordElement.style.marginLeft = spaceToDistribute + 'px';
    // nextWordElement.style.marginLeft = spaceToDistribute + 'px';
}

function ExperimentSliding() {
    if (currentPassageIndex >= articleIndices.length) {
        console.log("3w: finished all passage");
        displayIndividualQuestions();
        return;
    }

    currentPassage = data[articleIndices[currentPassageIndex]];
    const text = currentPassage.passage
    displaySlidingRSVP(text);
}


function displaySlidingRSVP(text) {
    const next = document.getElementById("nextStep");
    next.style.display = "none";

    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "none";

    const passageElement = document.getElementById("contentSliding");
    passageElement.style.display = "flex";

    const scrollingTextElement = document.getElementById('scrollingText');
    scrollingTextElement.textContent = text;

    const animationDuration = 42;

    scrollingTextElement.style.animationDuration = `${animationDuration}s`;

    const startTime = Date.now();
    const endTime = startTime + (animationDuration * 1000); // 转换为毫秒

    const checkScrollEndTimer = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime >= endTime) {
            clearInterval(checkScrollEndTimer);
            console.log('end scrolling');
            displayQuestion();

            return;
        }
    }, 100);
}


function ExperimentSlidingNarrow() {
    if (currentPassageIndex >= articleIndices.length) {
        console.log("3w_narrow: finished all passage");
        displayIndividualQuestions();
        return;
    }

    currentPassage = data[articleIndices[currentPassageIndex]];
    const text = currentPassage.passage
    displaySlidingNarrowRSVP(text);
}


function displaySlidingNarrowRSVP(text) {
    const next = document.getElementById("nextStep");
    next.style.display = "none";

    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "none";

    const passageElement = document.getElementById("contentSlidingNarrow");
    passageElement.style.display = "flex";

    const scrollingTextElement = document.getElementById('scrollingTextNarrow');
    scrollingTextElement.textContent = text;

    const animationDuration = 42;
    scrollingTextElement.style.animationDuration = `${animationDuration}s`;

    const startTime = Date.now();
    const endTime = startTime + (animationDuration * 1000); // 转换为毫秒

    const checkScrollEndTimer = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime >= endTime) {
            clearInterval(checkScrollEndTimer);
            console.log('finished scrolling');
            displayQuestion();

            return;
        }
    }, 100);

}

function ExperimentOneLineRSVP() {
    // check if all the passages are displayed
    console.log("articleIndices.length = " + articleIndices.length);
    console.log(articleIndices);
    console.log(currentPassageIndex);
    if (currentPassageIndex >= articleIndices.length) {
        console.log("finished all passage");
        displayIndividualQuestions();

        return;
    }

    // get current passage
    currentPassage = data[articleIndices[currentPassageIndex]];

    const text = currentPassage.passage;
    const words = text.split(' ');

    // Define an empty array to store the resulting sub-strings with two words combined
    const result = [];
    const groupSize = 10;

    for (let i = 0; i < words.length; i += groupSize) {
        const group = words.slice(i, i + groupSize);
        const subString = group.join(' ');
        result.push(subString);
    }

    displayPassage1LineRSVP(result, displayQuestion);
}

function displayPassage1LineRSVP(words, callback) {

    const next = document.getElementById("nextStep");
    next.style.display = "none";

    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "none";

    const passageElement = document.getElementById("content1l");
    passageElement.style.display = "flex";

    const contentElement = document.getElementById('content1l');

    words.forEach((word, index) => {
        setTimeout(() => {
            contentElement.textContent = word;
            setTimeout(() => {
                contentElement.textContent = '';
                if (index === words.length - 1 && typeof callback === 'function') {
                    console.log("finished, go to display question");
                    callback();
                }
            }, 2950);
        }, index * 3000); // for each word: 250ms + 50ms = 300ms
    });
}

async function displayQuestion() {
    var question = currentPassage.question;
    var options = currentPassage.answerChoices;
    var correctAnswer = currentPassage.correctAnswer;

    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "flex";

    const passageElements = document.getElementsByClassName('passage');
    for (var i = 0; i < passageElements.length; i++) {
        var element = passageElements[i];
        element.style.display = "none";
    }

    const questionElement = document.getElementById('question');
    questionElement.textContent = question;

    var optionALabel = document.getElementById("optionALabel");
    var optionBLabel = document.getElementById("optionBLabel");
    var optionCLabel = document.getElementById("optionCLabel");
    var optionDLabel = document.getElementById("optionDLabel");

    optionALabel.textContent = options[0];
    optionBLabel.textContent = options[1];
    optionCLabel.textContent = options[2];
    optionDLabel.textContent = options[3];

    const optionIds = ["A", "B", "C", "D"]
    // get correct answer in A, B, C, or D
    for (let i = 0; i < options.length; i++) {
        if (options[i] === correctAnswer) {
            answer = optionIds[i]
        }
    }

}


function displayIndividualQuestions() {
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "none";

    const passageElement = document.getElementById("individualQuestionContainer");
    passageElement.style.display = "block";
}

function displayPreferenceQuestions() {
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.style.display = "none";

    const passageElement = document.getElementById("PreferenceFormContainer");
    passageElement.style.display = "block";
}

function completeAndSave() {
    console.log("reach end")
    const questionContainer = document.getElementById("PreferenceFormContainer");
    questionContainer.style.display = "none";
    const passageElement = document.getElementById("buttonContainer");
    passageElement.style.display = "block";

    const temp = document.createElement('p');
    temp.textContent = 'Experiment finished, click to download';

    var button = document.createElement("button");
    button.textContent = "Click to download data";

    button.addEventListener("click", function () {
        saveAnswersToCSV();
    });

    var buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.appendChild(button);
}

async function saveAnswersToCSV() {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', URL.createObjectURL(blob));
    downloadLink.setAttribute('download', csvFile);
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


function submitAnswer() {
    var selectedOption = document.querySelector('input[name="option"]:checked');

    if (selectedOption) {
        var selectedValue = selectedOption.value;
        userAnswer = selectedValue
        console.log("selected", selectedValue);
        selectedOption.checked = false;

        const curr_ans = userAnswer;
        if (curr_ans === answer) {
            console.log("correct")
            experimentRes[(currentPassageIndex + 1).toString()] = "1"
        }
        else {
            experimentRes[(currentPassageIndex + 1).toString()] = "0"
            console.log("false")
        }
        currentPassageIndex++;
        console.log(currentPassageIndex);
        console.log(experimentRes);

        console.log("submitted")
        
        alert("Upon submission, you will be redirected to the next reading task. \nThe passage will appear at the center of the screen. \nAre you ready?");

        displayPlusSymbol();
        // if (conditionIndex === 1) {
        //     ExperimentRSVP();
        // }
        // else if (conditionIndex === 2) {
        //     Experiment3Words();
        // }
        // else if (conditionIndex === 3) {
        //     ExperimentSliding();
        // }
        // else if (conditionIndex === 4) {
        //     ExperimentSlidingNarrow();
        // }
        // else if (conditionIndex === 5) {
        //     ExperimentOneLineRSVP();
        // }
    } else {
        alert("Please select your answer before proceed");
    }
}

function submitIndividualQuestions(event) {
    // Get the form element
    event.preventDefault();
    var form = document.getElementById('questionnaireForm');

    // Get user input values
    var formData = {};
    var formElements = form.elements;
    for (var i = 0; i < formElements.length; i++) {
        var element = formElements[i];
        if (element.type !== 'submit' && element.checked) {
            if (element.type === 'radio') {
                formData[element.name] = element.value;
            } else if (element.type === 'checkbox') {
                if (formData.hasOwnProperty(element.name)) {
                    formData[element.name].push(element.value);
                } else {
                    formData[element.name] = [element.value];
                }
            } else {
                formData[element.name] = element.value;
            }
        }
    }

    // Prepare CSV data
    Object.keys(experimentRes).forEach(function (passageCode) {
        csvContent += '"' + conditionName + '","' + 'Experiment Result for Passage ' + passageCode + '","' + experimentRes[passageCode] + '"\n';
    });


    csvContent += processQuestion(conditionName, "How effective is this reading method for you in improving your reading quality?", formData.improvingQuality);
    csvContent += processMultipleChoiceQuestion(conditionName, "Why did you find this reading method effective?", formData.effectiveReasons);
    csvContent += processQuestion(conditionName, "How effective is this reading method for you in helping you stay focused?", formData.stayFocused);
    csvContent += processQuestion(conditionName, "How challenging is this reading method for you?", formData.challenging);
    csvContent += processMultipleChoiceQuestion(conditionName, "Why did you find this reading method challenging?", formData.challengingReasons);
    csvContent += processQuestion(conditionName, "Did your reading experience improve with the reading method from the first passage to the seventh passage?", formData.experienceImproved);

    //   end of current condition

    form.reset();
    displayNextInstruction();
}

function submitPerferenceForm(event) {
    event.preventDefault();
    var form = document.getElementById('readingPreferenceForm');

    // Get user input values
    var formData = {};
    var formElements = form.elements;
    for (var i = 0; i < formElements.length; i++) {
        var element = formElements[i];
        if (element.type !== 'submit' && element.checked) {
            if (element.type === 'radio') {
                formData[element.name] = element.value;
            } else if (element.type === 'checkbox') {
                if (formData.hasOwnProperty(element.name)) {
                    formData[element.name].push(element.value);
                } else {
                    formData[element.name] = [element.value];
                }
            } else {
                formData[element.name] = element.value;
            }
        } else if (element.tagName === 'TEXTAREA') {
            formData[element.name] = element.value;
        }
    }


    let con = "Perference"
    csvContent += processMultipleChoiceQuestion(con, "Which reading method do you prefer?", formData.readingMethod);
    csvContent += processMultipleChoiceQuestion(con, "Why do you prefer the selected method? Select all that apply.", formData.reasons);
    csvContent += processQuestion(con, "Comments", formData.comments);
    //   end of current condition

    form.reset();
    // displayNextInstruction();
    completeAndSave();
}


function processQuestion(con, question, answer) {
    return '"' + con + '","' + question + '","' + answer + '"\n';
}

function processMultipleChoiceQuestion(con, question, answers) {
    var csvData = '';
    if (Array.isArray(answers) && answers.length > 0) {
        answers.forEach(function (answer) {
            csvData += '"' + con + '","' + question + '","' + answer + '"\n';
        });
    }
    return csvData;
}

function displayNextInstruction() {
    const passageElement2 = document.getElementById("individualQuestionContainer");
    passageElement2.style.display = "none";
    const passageElement3 = document.getElementById("PreferenceFormContainer");
    passageElement3.style.display = "none";

    const nextStepbut = document.getElementById("nextStep");
    nextStepbut.style.display = "block";
}

function nextCondition() {
    console.log("at least here");
    ConditionCounter += 1;
    startNextCondition();
}
