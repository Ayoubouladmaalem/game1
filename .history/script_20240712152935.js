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

var currentIncompleteWord = "";
var beginningLetter;
var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];
var incorrectClicks = 0;
var maxIncorrectClicks = 3;
var wordText;
var boardImage;

function preload() {
    this.load.audio('bgsound', 'assets/bg-sound.wav');
    this.load.audio('correct', 'assets/correct.wav');
    this.load.audio('incorrect', 'assets/incorrect.wav');
    this.load.image('background', 'assets/background.png');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('happy', 'assets/happy.png');
    this.load.image('sad', 'assets/sad.png');
    this.load.image('letter', 'assets/letter.png');
    this.load.image('player', 'assets/ball.png');
    this.load.image('wood', 'assets/wood.png');
    this.load.image('direction', 'assets/direction.png');
    this.load.image('board', 'assets/board.png');
}

function create() {
    var bgSound = this.sound.add('bgsound', { loop: true });
    bgSound.play();

    this.add.image(400, 300, 'background');

    var woodImage = this.add.image(400, 60, 'wood');
    var woodTextInput = document.getElementById("woodTextInput").value;  // Get the initial text from the input field
    var woodTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
    var woodText = this.add.text(woodImage.x, woodImage.y, woodTextInput, woodTextStyle).setOrigin(0.5);  // Use the input text
    this.woodText = woodText;

    boardImage = this.add.image(650, 530, 'board').setOrigin(0.5);

    var directionImage = this.add.image(150, 530, 'direction').setOrigin(0.5);
    var directionTextStyle = { fontFamily: 'Marhey', fontSize: '25px', fill: '#000000', align: 'center' };
    var directionText = this.add.text(directionImage.x, directionImage.y, 'الكلمة التالية', directionTextStyle).setOrigin(0.5);
    directionImage.setInteractive();
    directionImage.on('pointerdown', function() { window.location.reload(); });
    directionImage.on('pointerover', function() {
        this.tweens.add({ targets: directionImage, y: directionImage.y - 10, yoyo: true, duration: 200, ease: 'Power2' });
    }, this);

    var textStyle = { font: "32px Arial", fill: "#000000", align: "center" };
    
    // Get the words from the answersInput field
    var answersInput = document.getElementById("answersInput").value;
    var incompleteWords = answersInput.split(',').map(word => word.trim());
    
    currentIncompleteWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
    beginningLetter = currentIncompleteWord.charAt(0);

    var letterImage = this.add.image(400, 540, 'letter');
    wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);

    this.circles = [];
    this.lettersOnCircles = [];

    // Initialize circles based on user input
    updateCircles(this);

    // Add event listener to update circles when input changes
    letterInput = document.getElementById("letterInput");
    var scene = this; // Store 'this' as 'scene' to access Phaser scene context

    letterInput.addEventListener('input', function() {
        var newText = letterInput.value;
        updateCircleLetters(scene, newText); // Pass 'scene' as an argument
    });

}

function updateCircles(scene) {
    var numCircles = document.getElementById("numCircles").value;
    numCircles = parseInt(numCircles);

    if (!scene.circles) {
        scene.circles = [];
    }

    if (!scene.lettersOnCircles) {
        scene.lettersOnCircles = [];
    }

    // Clear existing circles and letters
    scene.circles.forEach(circle => circle.destroy());
    scene.circles = [];
    scene.lettersOnCircles.forEach(letter => letter.destroy());
    scene.lettersOnCircles = [];

    var circlePositions = generateCirclePositions(numCircles);
    for (var i = 0; i < circlePositions.length; i++) {
        var circle = scene.add.image(circlePositions[i].x, circlePositions[i].y, 'circle');
        scene.circles.push(circle);

        // Get initial letter from input field
        var initialLetter = letterInput.value.charAt(i) || "أ"; // Default to "أ" if no letter is entered

        // Display initial letter on circle
        var letterText = scene.add.text(circle.x, circle.y, initialLetter, { font: "32px Arial", fill: "#000000", align: "center" }).setOrigin(0.5);
        scene.lettersOnCircles.push(letterText);
    }
    var correctCircleIndex = Phaser.Math.Between(0, scene.circles.length - 1);

    if (correctCircleIndex >= 0 && correctCircleIndex < scene.lettersOnCircles.length) {
        scene.lettersOnCircles[correctCircleIndex].setText(beginningLetter);

        scene.circles.forEach((circle, index) => {
            circle.setInteractive();
            circle.on('pointerdown', function () {
                if (index === correctCircleIndex) {
                    this.setTexture('happy');
                    scene.sound.play('correct');
                    displayMessage('تهانينا', 'لقد نجحت!', 'happy');
                    var letterImage = scene.add.image(400, 540, 'letter');
                    wordText.setText(currentIncompleteWord);
                } else {
                    incorrectClicks++;
                    this.setTexture('sad');
                    scene.sound.play('incorrect');
                    if (incorrectClicks >= maxIncorrectClicks) {
                        displayMessage('للأسف', 'لقد تجاوزت عدد المحاولات المسموحة!', 'sad');
                        incorrectClicks = 0; // Reset incorrect clicks
                    }
                }
            });
        });
    }
}

function update() {
    // Update the text on wood in each frame
    var woodTextInput = document.getElementById("woodTextInput").value;
    this.woodText.setText(woodTextInput);
}

function updateCircleLetters(scene, newText) {
    if (!scene.lettersOnCircles) return;

    // Loop through each letter and update its text
    for (var i = 0; i < scene.lettersOnCircles.length; i++) {
        var newLetter = newText.charAt(i) || "أ"; // Default to "أ" if no letter is entered
        scene.lettersOnCircles[i].setText(newLetter);
    }
}

function generateCirclePositions(numCircles) {
    var positions = [];
    if (numCircles > 5) {
        positions = [
            { x: 400, y: 250 },
            { x: 600, y: 220 },
            { x: 200, y: 220 },
            { x: 500, y: 380 },
            { x: 300, y: 380 }
        ];
    } else {
        var angleStep = (2 * Math.PI) / numCircles;
        var radius = 150;
        for (var i = 0; i < numCircles; i++) {
            var angle = i * angleStep;
            var x = 400 + radius * Math.cos(angle);
            var y = 300 + radius * Math.sin(angle);
            positions.push({ x: x, y: y });
        }
    }
    return positions;
}

function displayMessage(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        iconHtml: `<img src="assets/${icon}.png" style="width:100px;height:100px;">`,
        customClass: {
            icon: 'no-border'
        }
    });
}

function getDisplayWordWithHiddenFirstLetter(word) {
    if (word.length > 1) {
        return '*'.repeat(word.length - 1) + word.charAt(word.length - 1);
    } else {
        return word;
    }
}

document.getElementById('updateButton').addEventListener('click', function() {
    var scene = game.scene.scenes[0];
    updateCircles(scene);
});
