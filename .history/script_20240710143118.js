var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var words = ["أبجدية", "تلفاز", "حاسوب", "مدينة", "مركب"];
var incompleteWord = "";
var currentWord = "";
var correctLetters = 0;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('shot', 'assets/shot.png');
    this.load.image('happy', 'assets/happy.png');
    this.load.image('sad', 'assets/sad.png');
}

function create() {
    this.add.image(400, 300, 'background');
    var circles = [
        this.add.image(400, 250, 'circle'),
        this.add.image(600, 220, 'circle'),
        this.add.image(200, 220, 'circle'),
        this.add.image(500, 380, 'circle'),
        this.add.image(300, 380, 'circle')
    ];

    var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];
    var textStyle = { font: "32px Arial", fill: "#ffffff", align: "center" };

    circles.forEach(function(circle) {
        var letter = getRandomLetter(letters);
        var letterText = this.add.text(circle.x, circle.y, letter, textStyle).setOrigin(0.5);
        circle.setInteractive();
        circle.on('pointerdown', function() {
            checkLetter(letter);
        }, this);
    }, this);

    // Select a random incomplete word
    var wordIndex = Math.floor(Math.random() * words.length);
    currentWord = words[wordIndex];
    incompleteWord = currentWord.substring(0, 2) + "_".repeat(currentWord.length - 2);
    this.wordText = this.add.text(400, 500, incompleteWord, textStyle).setOrigin(0.5);
}

function getRandomLetter(letters) {
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function checkLetter(letter) {
    if (letter === currentWord[correctLetters + 2]) {
        correctLetters++;
        incompleteWord = currentWord.substring(0, 2 + correctLetters) + "_".repeat(currentWord.length - 2 - correctLetters);
        this.wordText.setText(incompleteWord);
        this.add.image(210, 500, 'happy');
    } else {
        this.add.image(210, 500, 'sad');
    }

    if (correctLetters === currentWord.length - 2) {
        // Word is completed, reset for a new word or show some message
        console.log('Word completed:', currentWord);
    }
}

function update() {
}
