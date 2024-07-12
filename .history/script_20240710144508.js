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
var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];

function preload ()
{
    this.load.image('background','assets/background.png')
    this.load.image('circle','assets/circle.png')
    // this.load.image('shot', 'assets/shot.png')
    this.load.image('happy', 'assets/happy.png')
    this.load.image('sad', 'assets/sad.png')
    this.load.image('letter', 'assets/letter.png')
}

function create ()
{
    this.add.image(400, 300, 'background');
    var circle1 = this.add.image(400, 250, 'circle');
    var circle2 = this.add.image(600, 220, 'circle');
    var circle3 = this.add.image(200, 220, 'circle');
    var circle4 = this.add.image(500, 380, 'circle');
    var circle5 = this.add.image(300, 380, 'circle');

    // this.add.image(210, 500, 'shot');
    this.add.image(400, 540, 'letter');

    var textStyle = { font: "32px Arial", fill: "#ffffff", align: "center" };

    var lettersOnCircles = [
        this.add.text(circle1.x, circle1.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle2.x, circle2.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle3.x, circle3.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle4.x, circle4.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle5.x, circle5.y, getRandomLetter(letters), textStyle).setOrigin(0.5)
    ];

    var wordText = this.add.text(600, 500, incompleteWord, textStyle);

    lettersOnCircles.forEach((letterText, index) => {
        letterText.setInteractive();
        letterText.on('pointerdown', function() {
            var letter = letterText.text;
            if (isCorrectLetter(letter)) {
                animateImage.call(this, 'happy', letterText.x, letterText.y);
                currentIncompleteWord += letter;
                wordText.setText(currentIncompleteWord);

                if (currentIncompleteWord === incompleteWord) {
                    // Word is completed, do something
                }
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
function isCorrectLetter(letter) {
    // Check if the letter is the correct next letter in the incomplete word
    return incompleteWord.includes(letter) && !currentIncompleteWord.includes(letter);
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

function update ()
{
}