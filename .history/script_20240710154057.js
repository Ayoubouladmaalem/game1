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

var incompleteWords = ["حليب", "ماء", "شمس", "كتاب"]; // Array of incomplete words
var currentIncompleteWord = ""; // To store the current state of the incomplete word
var beginningLetter; // To store the beginning letter of the current incomplete word
var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('happy', 'assets/happy.png');
    this.load.image('sad', 'assets/sad.png');
    this.load.image('letter', 'assets/letter.png');
    this.load.image('shot', 'assets/shot.png');
}

function create() {
    this.add.image(400, 300, 'background');
    var circle1 = this.add.image(400, 250, 'circle');
    var circle2 = this.add.image(600, 220, 'circle');
    var circle3 = this.add.image(200, 220, 'circle');
    var circle4 = this.add.image(500, 380, 'circle');
    var circle5 = this.add.image(300, 380, 'circle');

    var textStyle = { font: "32px Arial", fill: "#ffffff", align: "center" };

    // Choose a random incomplete word from the array
    currentIncompleteWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
    beginningLetter = currentIncompleteWord.charAt(0);

    // Add the 'letter.png' image and position it
    var letterImage = this.add.image(400, 540, 'letter');

    // Display the current incomplete word on top of 'letter.png'
    var wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);

    var lettersOnCircles = [
        this.add.text(circle1.x, circle1.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle2.x, circle2.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle3.x, circle3.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle4.x, circle4.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle5.x, circle5.y, getRandomLetter(letters), textStyle).setOrigin(0.5)
    ];

    // Choose a random circle index to place the correct letter
    var correctCircleIndex = Phaser.Math.Between(0, 4);
    lettersOnCircles[correctCircleIndex].setText(beginningLetter); // Place the correct letter

    lettersOnCircles.forEach((letterText, index) => {
        if (index !== correctCircleIndex) {
            letterText.setText(getRandomLetter(letters)); // Set random letters for other circles
        }

        letterText.setInteractive();
        letterText.on('pointerdown', function() {
            var letter = letterText.text;
            if (letter === beginningLetter) {
                animateImage.call(this, 'happy', letterText.x, letterText.y);
                currentIncompleteWord = beginningLetter + currentIncompleteWord.substring(1); // Replace '_' with the correct letter
                wordText.setText(getDisplayWord(currentIncompleteWord));
            } else {
                animateImage.call(this, 'sad', letterText.x, letterText.y);
            }
        }, this);
    });
}


function getRandomLetter(letters) {
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function animateImage(imageKey, targetX, targetY) {
    var image = this.add.image(targetX, 600, imageKey);
    this.tweens.add({
        targets: image,
        y: targetY,
        duration: 1000,
        ease: 'Power2',
        onComplete: function() {
            image.destroy();
        }
    });
}

function getDisplayWordWithHiddenFirstLetter(word) {
    var displayWord = "_";
    for (var i = 1; i < word.length; i++) {
        displayWord += "_";
    }
    return displayWord;
}

function getDisplayWord(word) {
    var displayWord = "";
    for (var i = 0; i < word.length; i++) {
        displayWord += word[i];
    }
    return displayWord;
}

function update() {
}
