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

var incompleteWords = ["حليب", "كتاب", "ماء", "سيارة", "شجرة"]; // Example incomplete words
var currentIncompleteWord = ""; // To store the current state of the incomplete word
var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('happy', 'assets/happy.png');
    this.load.image('sad', 'assets/sad.png');
    this.load.image('letter', 'assets/letter.png');
}

function create() {
    this.add.image(400, 300, 'background');

    // Create circles
    var circles = [];
    for (var i = 0; i < 5; i++) {
        circles.push(this.add.image(200 + i * 150, 380, 'circle'));
    }

    // Generate random incomplete words
    var wordTexts = [];
    incompleteWords.forEach((word, index) => {
        var wordX = 100 + index * 150;
        var textStyle = { font: "32px Arial", fill: "#ffffff", align: "center" };

        // Display incomplete word using 'letter.png'
        var letterImages = [];
        for (var j = 0; j < word.length; j++) {
            var letter = word[j];
            var letterX = wordX + j * 50;
            var letterY = 530;
            var letterImage = this.add.image(letterX, letterY, 'letter');
            this.add.text(letterX - 10, letterY - 10, letter, { font: "24px Arial", fill: "#000000" }); // Display letter text on 'letter.png'
            letterImages.push(letterImage);
        }
        wordTexts.push({ word: word, letters: letterImages });

        // Randomly choose a circle to display the missing letter
        var randomIndex = Phaser.Math.Between(0, 4);
        var circle = circles[randomIndex];
        var missingLetter = word[Math.floor(Math.random() * word.length)];
        var textStyle = { font: "32px Arial", fill: "#ffffff", align: "center" };
        var letterText = this.add.text(circle.x, circle.y, missingLetter, textStyle).setOrigin(0.5);
        letterText.setInteractive();
        letterText.on('pointerdown', function() {
            if (word.includes(letterText.text)) {
                animateImage.call(this, 'happy', letterText.x, letterText.y);
            } else {
                animateImage.call(this, 'sad', letterText.x, letterText.y);
            }
        }, this);
    });

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

function update() {
}
