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
    var woodTextInput = document.getElementById("woodTextInput").value; // Get the initial text from the input field
    var woodTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
    var woodText = this.add.text(woodImage.x, woodImage.y, woodTextInput, woodTextStyle).setOrigin(0.5); // Use the input text
    this.woodText = woodText;

    boardImage = this.add.image(650, 530, 'board').setOrigin(0.5);

    var directionImage = this.add.image(150, 530, 'direction').setOrigin(0.5);
    var directionTextStyle = { fontFamily: 'Marhey', fontSize: '25px', fill: '#000000', align: 'center' };
    var directionText = this.add.text(directionImage.x, directionImage.y, 'الكلمة التالية', directionTextStyle).setOrigin(0.5);
    directionImage.setInteractive();
    directionImage.on('pointerdown', function () { window.location.reload(); });
    directionImage.on('pointerover', function () {
        this.tweens.add({ targets: directionImage, y: directionImage.y - 10, yoyo: true, duration: 200, ease: 'Power2' });
    }, this);

    var textStyle = { font: "32px Arial", fill: "#000000", align: "center" };

    // Get incomplete words from input field and parse into array
    var answersInput = document.getElementById("answersInput").value;
    var incompleteWords = answersInput.split(",").map(word => word.trim());

    currentIncompleteWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
    beginningLetter = currentIncompleteWord.charAt(0);

    var letterImage = this.add.image(400, 540, 'letter');
    wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);

    this.circles = [];
    this.lettersOnCircles = [];

    // Initialize circles based on user input
    updateCircles(this);

    // Add event listener to update circles when input changes
    var letterInput = document.getElementById("letterInput");
    var scene = this; // Store 'this' as 'scene' to access Phaser scene context

    letterInput.addEventListener('input', function () {
        var newText = letterInput.value;
        updateCircleLetters(scene, newText); // Pass 'scene' as an argument
    });

    // Add event listener to update circles and letters on submit button click
    document.getElementById("updateButton").addEventListener("click", function () {
        var letterInput = document.getElementById("letterInput");
        var answersInput = document.getElementById("answersInput");
        var woodTextInput = document.getElementById("woodTextInput");

        var answers = answersInput.value.split(',').map(word => word.trim());
        var letters = letterInput.value;
        var woodText = woodTextInput.value;

        if (answers.length > 0) {
            currentIncompleteWord = answers[Math.floor(Math.random() * answers.length)];
            beginningLetter = currentIncompleteWord.charAt(0);
        }
        // Update letters on circles
        updateCircleLetters(scene, letters); // Pass 'scene' as an argument
        // Update wood text
        scene.woodText.setText(woodText);
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
        var initialLetter = document.getElementById("letterInput").value.charAt(i) || "أ"; // Default to "أ" if no letter is entered

        // Display initial letter on circle
        var letterText = scene.add.text(circle.x, circle.y, initialLetter, { font: "32px Arial", fill: "#000000", align: "center" }).setOrigin(0.5);
        scene.lettersOnCircles.push(letterText);
    }
    var correctCircleIndex = Phaser.Math.Between(0, scene.circles.length - 1);

    if (correctCircleIndex >= 0 && correctCircleIndex < scene.lettersOnCircles.length) {
        scene.lettersOnCircles[correctCircleIndex].setText(beginningLetter);
    }
}

function updateCircleLetters(scene, newText) {
    if (!scene.circles || !scene.lettersOnCircles) {
        return; // Exit early if circles or lettersOnCircles are not properly initialized
    }

    var numCircles = scene.circles.length;
    for (var i = 0; i < numCircles; i++) {
        var letter = newText.charAt(i) || "أ"; // Default to "أ" if no letter is entered
        if (scene.lettersOnCircles[i]) {
            scene.lettersOnCircles[i].setText(letter);
        }
    }
}

function generateCirclePositions(numCircles) {
    var positions = [];

    if (numCircles === 1) {
        positions.push({ x: 400, y: 300 });
    } else if (numCircles === 2) {
        positions.push({ x: 300, y: 300 });
        positions.push({ x: 500, y: 300 });
    } else if (numCircles === 3) {
        positions.push({ x: 400, y: 250 });
        positions.push({ x: 500, y: 370 });
        positions.push({ x: 300, y: 370 });
    } else if (numCircles === 4) {
        positions.push({ x: 400, y: 200 });
        positions.push({ x: 500, y: 310 });
        positions.push({ x: 300, y: 310 });
        positions.push({ x: 400, y: 420 });
    } else if (numCircles === 5) {
        positions.push({ x: 400, y: 250 });
        positions.push({ x: 600, y: 220 });
        positions.push({ x: 200, y: 220 });
        positions.push({ x: 500, y: 380 });
        positions.push({ x: 300, y: 380 });
    } else if (numCircles === 6) {
        positions.push({ x: 400, y: 180 });
        positions.push({ x: 600, y: 250 });
        positions.push({ x: 200, y: 250 });
        positions.push({ x: 400, y: 320 });
        positions.push({ x: 500, y: 380 });
        positions.push({ x: 300, y: 380 });
    } else if (numCircles === 7) {
        positions.push({ x: 400, y: 150 });
        positions.push({ x: 600, y: 210 });
        positions.push({ x: 200, y: 210 });
        positions.push({ x: 400, y: 270 });
        positions.push({ x: 600, y: 330 });
        positions.push({ x: 200, y: 330 });
        positions.push({ x: 400, y: 390 });
    } else if (numCircles === 8) {
        positions.push({ x: 400, y: 120 });
        positions.push({ x: 600, y: 190 });
        positions.push({ x: 200, y: 190 });
        positions.push({ x: 400, y: 260 });
        positions.push({ x: 600, y: 330 });
        positions.push({ x: 200, y: 330 });
        positions.push({ x: 400, y: 400 });
        positions.push({ x: 400, y: 500 });
    }

    return positions;
}

function update() {
    var woodTextInput = document.getElementById("woodTextInput");
    if (woodTextInput) {
        scene.woodText.setText(woodTextInput.value);
    }
    var letterInput = document.getElementById("letterInput");
    var numCirclesInput = document.getElementById("numCircles");

    if (letterInput && numCirclesInput) {
        updateCircles(scene);
        updateCircleLetters(scene, letterInput.value);
    }
}

function getDisplayWordWithHiddenFirstLetter(word) {
    var hiddenLetter = word.charAt(0);
    var displayedWord = hiddenLetter + word.substring(1);
    return displayedWord;
}
