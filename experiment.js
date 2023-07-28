var sourceFile = 'passage_exp.json';
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
    4: "SlidingRSVPNarrow",
    5: "OneLineRSVP"
}

// var experimentData = {
//     OriginalRSVP: [],
//     ThreeWordsRSVP: [],
//     SlidingRSVP: [],
//     SlidingRSVPNarrow: [],
//     finalResponses: []
// };

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

        articleIndices = generateRandomArticleIndex(visitedArticles);

        if (conditionIndex === 1) {
            console.log("ExpRSVP");
            
            currentPassageIndex = 0;
            ExperimentRSVP();
        }

        else if (conditionIndex === 2) {
            console.log("3WRSVP");
            currentPassageIndex = 0;
            Experiment3Words();
        }

        else if (conditionIndex === 3) {
            console.log("SlidingRSVP")
            currentPassageIndex = 0;
            ExperimentSliding();
        }

        else if (conditionIndex === 4) {
            console.log("SlidingNarrowRSVP");
            currentPassageIndex = 0;
            ExperimentSlidingNarrow();
        }

        else if (conditionIndex === 5) {
            console.log("OneLineRSVP");
            currentPassageIndex = 0;
            ExperimentOneLineRSVP();
        }
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
    // var randomNumber = Math.floor(Math.random() * 4) + 1;
    // while (visitedConditions.includes(randomNumber)) {
    //     randomNumber = Math.floor(Math.random() * 4) + 1;
    // }
    // visitedConditions.push(randomNumber);
    // console.log("generated random condition index = " + randomNumber);
    // return randomNumber;
    return 1;
}

function generateRandomArticleIndex(visitedArticles) {
    // var result = [0, 0, 0];
    // for (var i=0; i < 2; i++){
    // while(visitedArticles.includes(result[i])){
    //     result[i] = Math.floor(Math.random() * 21) + 1;
    // }
    // visitedArticles.push(result[i]);
    // }
    // return result;
    return [0, 1, 0];
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
        // 使用定时器来控制单词的展示时间
        setTimeout(() => {
            // 显示当前单词
            contentElement.textContent = word;

            // 设置展示时间（300ms = 300ms）
            setTimeout(() => {
                // 清空单词容器，以便显示下一个单词
                contentElement.textContent = '';

                // 检查是否为最后一个单词，如果是，则执行回调函数
                if (index === words.length - 1 && typeof callback === 'function') {
                    console.log("finished, go to display question");
                    callback();
                }
            }, 250);
        }, index * 300); // 每个单词的展示时间为 300ms + 50ms（空白时间）
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
    // scrollingTextElement.addEventListener('animationend', animationEndHandler);


    // const textWidth = scrollingTextElement.clientWidth;
    // const animationDuration = textWidth / scrollSpeed;
    const animationDuration = 10;


    scrollingTextElement.style.animationDuration = `${animationDuration}s`;

    const startTime = Date.now();
    const endTime = startTime + (animationDuration * 1000); // 转换为毫秒

    const checkScrollEndTimer = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime >= endTime) {
            clearInterval(checkScrollEndTimer);
            // 滚动结束，执行相应操作
            console.log('滚动结束');
            displayQuestion();

            return;

            // 在这里可以触发下一步操作，或进行其他处理
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
    // scrollingTextElement.addEventListener('animationend', animationEndHandler);


    // const textWidth = scrollingTextElement.clientWidth;
    // const animationDuration = textWidth / scrollSpeed;
    const animationDuration = 10;


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

        if (conditionIndex === 1) {
            ExperimentRSVP();
        }
        else if (conditionIndex === 2) {
            Experiment3Words();
        }
        else if (conditionIndex === 3) {
            ExperimentSliding();
        }
        else if (conditionIndex === 4) {
            ExperimentSlidingNarrow();
        }
        else if (conditionIndex === 5) {
            ExperimentOneLineRSVP();
        }


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

function submitPerferenceForm(event){
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