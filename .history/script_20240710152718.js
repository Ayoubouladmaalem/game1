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

var incompleteWord = "حليب"; // Example of an incomplete word
var currentIncompleteWord = ""; // To store the current state of the incomplete word
var beginningLetter = incompleteWord.charAt(0); // Get the beginning letter of incompleteWord
var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('happy', 'assets/happy.png');
    this.load.image('sad', 'assets/sad.png');
    this.load.image('letter', 'assets/letter.png');
    this.load.image('shot', 'assets/shot.png'); // Load the shot.png image
}

function create() {
    this.add.image(400, 300, 'background');
    var circle1 = this.add.image(400, 250, 'circle');
    var circle2 = this.add.image(600, 220, 'circle');
    var circle3 = this.add.image(200, 220, 'circle');
    var circle4 = this.add.image(500, 380, 'circle');
    var circle5 = this.add.image(300, 380, 'circle');

    this.add.image(400, 540, 'letter');

    var textStyle = { font: "32px Arial", fill: "#ffffff", align: "center" };

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

    // Initialize wordText with underscores for missing letters in incompleteWord
    var wordText = this.add.text(380, 530, getDisplayWordWithHiddenFirstLetter(incompleteWord), textStyle);

    lettersOnCircles.forEach((letterText, index) => {
        if (index !== correctCircleIndex) {
            letterText.setText(getRandomLetter(letters)); // Set random letters for other circles
        }

        letterText.setInteractive();
        letterText.on('pointerdown', function() {
            var letter = letterText.text;
            if (letter === beginningLetter) { // Check if clicked letter matches the beginning letter of incompleteWord
                // Show happy.png
                animateImage.call(this, 'happy', letterText.x, letterText.y);
                currentIncompleteWord += letter; // Add the letter to currentIncompleteWord
                wordText.setText(getDisplayWord(incompleteWord, currentIncompleteWord)); // Update wordText without hidden letter
            } else {
                animateImage.call(this, 'sad', letterText.x, letterText.y); // Show sad.png for incorrect letter
            }
        }, this);
    });
}

function getRandomLetter(letters) {
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function animateImage(imageKey, targetX, targetY) {
    var image = this.add.image(targetX, 600, imageKey); // Start off-screen at the bottom
    this.tweens.add({
        targets: image,
        y: targetY,
        duration: 1000,
        ease: 'Power2',
        onComplete: function() {
            image.destroy(); // Remove the image after the animation
        }
    });
}

function getDisplayWordWithHiddenFirstLetter(word) {
    var displayWord = "";
    displayWord += "_"; // Hide the first letter with underscore
    for (var i = 1; i < word.length; i++) {
        displayWord += word[i];
    }
    return displayWord;
}

function update() {
}
