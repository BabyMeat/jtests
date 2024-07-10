// AFFICHAGE DE VERSION 
function showVersion() {
    console.log('Version : 2');
}
window.onload = showVersion;

// VARIABLES*
const delimiter = ",";
const filepath = 'kanji.csv';
const structure = ['kanji', 'kana', 'french', 'emoji'];
const questionTYPES = ['KanjiToKana','KanaToKanji','KanjiToFrench','KanjiToEmoji','FrenchToKanji'];
var tableauBASE = [];
var tableauCUSTOM = [];
var currentQuestion = '';
var correctAnswer = "";
var emoji = "";
var scoreInt = 0;
var positivePOINTS = 10;
var negativePOINTS = -5;

// ELEMENTS HTML
const uploadPage = document.getElementById('UPLOAD');
const quizPage = document.getElementById('QUIZ');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const errorMessage = document.getElementById('error-message');
const output = document.getElementById('output');
const startQuizButton = document.getElementById('startQuizButton');
const answerCHECK = document.getElementById('answerCHECK');
const question = document.getElementById('question');
const symbol = document.getElementById('symbol');
const score = document.getElementById('score');

// Initialisation de l'affichage
uploadPage.style.display = 'flex';
quizPage.style.display = 'none';


// PRECHARGEMENT DU FICHIER CSV PAR DEFAUT : ............................
function preLoadBaseCSV() {
    console.log('PRELOAD TEST 3');
    fetch('kanji.csv')  // Assurez-vous que le chemin est correct
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            let filteredBASEDATA = filterDATA(data);
            let parsedBASEDATA = parseCSV(filteredBASEDATA, ',', structure);
            tableauBASE = parsedBASEDATA;
            console.log('PRELOAD SUCCEDED : ', JSON.stringify(tableauBASE, null, 2));
        })
        .catch(error => {
            console.error('Erreur lors de la lecture du fichier CSV prédéfini:', error);
        });
}
window.onload = preLoadBaseCSV;

// FONCTIONS GLOBALES : ..............................................
function filterDATA(data) {
    return data
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '' && !line.startsWith('#'))
        .join('\n');
}
function parseCSV(data, delimiter, structure) {
    const filteredLines = data.split('\n');
    const result = filteredLines.reduce((acc, line, lineIndex) => {
        const values = line.split(delimiter).map(value => value.trim());

        if (values.length === structure.length) {
            const entry = structure.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {});

            acc.push(entry);
        } else {
            const errorMessage = `Mauvaise formatation à la ligne ${lineIndex + 1}: ${line}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        return acc;
    }, []);
    return result;
}
function loadFile(files) {
    tableauCUSTOM = [];
    if (files.length === 1) {
        const file = files[0];
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // Filtrage des données du fichier
                    const filteredData = filterDATA(e.target.result);
                    if (filteredData.trim() === '') {
                        throw new Error('Le fichier est vide.');
                    }
                    // Parsing du CSV dans un tableau d'objets
                    tableauCUSTOM = parseCSV(filteredData, delimiter, structure);
                    if (tableauCUSTOM.length === 0) {
                        throw new Error('Aucune donnée valide trouvée dans le fichier.');
                    }
                    // Succès
                    errorMessage.classList.remove('error-message');
                    errorMessage.classList.add('success-message');
                    errorMessage.textContent = "Uploadé avec succès";
                    // Affichage dans l'élément HTML output
                    output.textContent = JSON.stringify(tableauCUSTOM, null, 2);
                    //console.log('Contenu du fichier:', tableau);
                    // MASQUAGE ZONE INPUT 
                    dropZone.classList.add('hidden');
                    fileInput.classList.add('hidden');
                    return;
                } catch (error) {
                    // Erreur
                    errorMessage.classList.add('error-message');
                    errorMessage.classList.remove('success-message');
                    errorMessage.textContent = `Erreur: ${error.message}`;
                }
            };
            reader.onerror = () => {
                // Erreur
                errorMessage.classList.add('error-message');
                errorMessage.classList.remove('success-message');
                errorMessage.textContent = 'Erreur lors de la lecture du fichier.';
            };
            reader.readAsText(file);
        } else {
            // Erreur
            errorMessage.classList.add('error-message');
            errorMessage.classList.remove('success-message');
            errorMessage.textContent = 'Format de fichier non compatible. Veuillez importer un fichier CSV.';
        }
    } else {
        // Erreur
        errorMessage.classList.add('error-message');
        errorMessage.classList.remove('success-message');
        errorMessage.textContent = 'Veuillez déposer un seul fichier CSV à la fois.';
    }
    // Réinitialisation de l'affichage 
    output.textContent = "";
}


// Fonctions pour lancer le quiz :

function randomInt(max) {
    return Math.floor(Math.random() * max);
}
function randomQUIZ(){
    return questionTYPES[Math.floor(Math.random() * questionTYPES.length)];
}
function randomQuestion(tab) {
    return tab[randomInt(tab.length)]
}
function getKanji(line) {
    return line.kanji;
}
function getKana(line) {
    return line.kana;
}
function getFrench(line) {
    return line.french;
}
function getEmoji(line) {
    return line.emoji;
}

// LOGIQUE DU QUIZ : ...............................................
function newQuestion(tab) {
    question.textContent = "";
    answerCHECK.textContent = "";
    emoji = "";
    const quiz = randomQUIZ();
    const questionRANDOM = randomQuestion(tab);
    if(quiz == 'KanjiToKana'){
        currentQuestion = getKanji(questionRANDOM);
        correctAnswer = getKana(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    else if(quiz == 'KanaToKanji'){
        currentQuestion = getKana(questionRANDOM)
        correctAnswer = getKanji(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    else if(quiz == 'KanjiToFrench'){
        currentQuestion = getKanji(questionRANDOM);
        correctAnswer = getFrench(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    else if(quiz == 'KanjiToEmoji'){
        currentQuestion = getKana(questionRANDOM);
        correctAnswer = getEmoji(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    else if(quiz == 'FrenchToKanji'){
        emoji = getEmoji(questionRANDOM);
        currentQuestion = getFrench(questionRANDOM);
        correctAnswer = getKanji(questionRANDOM);
        //console.log('SUCCESS', currentQuestion, correctAnswer);
    }
    //console.log('LOAD : ', currentQuestion, correctAnswer);
    showQuestion(quiz);
    generateRandomResponses(quiz, tab);
} 

function showQuestion(type) {
    if(type == 'KanjiToKana'){
        question.textContent = "Comment s'écrtit en Kana le Kanji suivant : ";   
    }
    else if(type == 'KanaToKanji'){
        question.textContent = "Quel est le Kanji pour le Kana suivant : ";
    }
    else if(type == 'KanjiToFrench'){
        question.textContent = "Quelle est la traduction du Kanji suivant : ";
    }
    else if(type == 'KanjiToEmoji'){
        question.textContent = "À quoi correspond le kanji suivant : ";
    }
    else if(type == 'FrenchToKanji'){
        question.textContent = "Quel est le kanji pour : ";
    }
    //console.log('Affichage du symbole : ', currentQuestion);
    symbol.textContent = currentQuestion;
    //console.log('SYMBOL TEXT CONTEN : ', symbol.textContent);
}

function generateRandomResponses(type, tab) {
    const choices = new Set();
    choices.add(correctAnswer);
    //console.log('CHOICES LENGTH : ' + choices.size);
    while(choices.size < 4) {
        if(type == 'KanjiToKana'){
            //console.log('EQUALITY CHECK');
            choices.add(getKana(randomQuestion(tab)));
        }
        else if(type == 'KanaToKanji'){
            //console.log('EQUALITY CHECK');
            choices.add(getKanji(randomQuestion(tab)));
        }
        else if(type == 'KanjiToFrench'){
            //console.log('EQUALITY CHECK');
            choices.add(getFrench(randomQuestion(tab)));
        }
        else if(type == 'KanjiToEmoji'){
            //console.log('EQUALITY CHECK');
            choices.add(getEmoji(randomQuestion(tab)));
        }
        else if(type == 'FrenchToKanji'){
            //console.log('EQUALITY CHECK');
            choices.add(getKanji(randomQuestion(tab)));
        }
        else {
            //console.log('Infinite Tsukuyomi');
        }
    }
    // Affiche les réponses aléatoirement
    /*
    for(let i=0;i<choices.length;i++){
        console.log('CHOICES : ' + i + " " + choices.toString());
    }
    */
    const choicesArray = Array.from(choices);
    choicesArray.sort(() => Math.random() - 0.5);
    const choiceButtons = document.querySelectorAll('.choice');
    choiceButtons.forEach((button, index) => {
        button.textContent = choicesArray[index];
    });
}

function startQuiz() {
    // Affichage du quiz
    score.textContent = scoreInt.toString();
    uploadPage.style.display = 'none';
    quizPage.style.display = 'flex';
    if(tableauCUSTOM.length > 0){
        newQuestion(tableauCUSTOM);
    }
    else {
        newQuestion(tableauBASE);
    }
}

// CHECK ANWSER CALL
function checkAnswer(button) {
    const selectedAnswer = button.textContent;
    const isempty = (tableauCUSTOM.length>0);
    if (selectedAnswer === correctAnswer) {
        answerCHECK.textContent = 'Correct!';
        scoreInt = scoreInt + positivePOINTS;
        score.textContent = scoreInt.toString();
        if(isempty){
            setTimeout(newQuestion(tableauCUSTOM), 500);
        }
        else {
            setTimeout(newQuestion(tableauBASE), 500);
        }
    } else {
        answerCHECK.textContent = `Incorrect, essayez encore!`;
        scoreInt = scoreInt + negativePOINTS;
        score.textContent = scoreInt.toString();
        if(isempty){
            setTimeout(newQuestion(tableauCUSTOM), 500);
        }
        else {
            setTimeout(newQuestion(tableauBASE), 500);
        }
    }
    // Possibilité de arreter le script
    /*
    if (scoreInt >= 100){
        return;
    }
    */
}

// UPLOAD CUSTOM : ..................................................
document.addEventListener('DOMContentLoaded', () => {
    // Événements pour le chargement du fichier
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        loadFile(event.dataTransfer.files);
    });
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    fileInput.addEventListener('change', (event) => {
        loadFile(event.target.files);
    });
    // Événement pour le bouton de démarrage du quiz
    startQuizButton.addEventListener('click', startQuiz);
});
