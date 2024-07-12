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
    this.load.image('wood', 'assets/wood.png');
    this.load.image('direction', 'assets/direction.png');
    this.load.image('board', 'assets/board.png');
}

function create() {
    var bgSound = this.sound.add('bgsound', { loop: true });
    bgSound.play();

    this.add.image(400, 300, 'background');

    var wordsInput = document.getElementById("wordsInput").value.trim(); // Trim to remove leading/trailing spaces
    var incompleteWords;
    if (wordsInput !== "") {
        incompleteWords = wordsInput.split(',').map(word => word.trim()); // Split by comma and trim each word
    } else {
        // Default list if no input is provided
        incompleteWords = ["سهل", "كلمة", "صعب", "قريب", "بعيد"];
    }

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

    scene.circles.forEach(circle => circle.destroy());
    scene.circles = [];
    scene.lettersOnCircles.forEach(letter => letter.destroy());
    scene.lettersOnCircles = [];

    var circlePositions = generateCirclePositions(numCircles);
    for (var i = 0; i < circlePositions.length; i++) {
        var circle = scene.add.image(circlePositions[i].x, circlePositions[i].y, 'circle');
        scene.circles.push(circle);

        var initialLetter = letters[Math.floor(Math.random() * letters.length)];

        var letterText = scene.add.text(circle.x, circle.y, initialLetter, { font: "32px Arial", fill: "#000000", align: "center" }).setOrigin(0.5);
        scene.lettersOnCircles.push(letterText);
    }

    var correctCircleIndex = Phaser.Math.Between(0, scene.circles.length - 1);

    if (correctCircleIndex >= 0 && correctCircleIndex < scene.lettersOnCircles.length) {
        scene.lettersOnCircles[correctCircleIndex].setText(beginningLetter);
    }

    scene.lettersOnCircles.forEach((letterText, index) => {
        if (index !== correctCircleIndex) {
            letterText.setText(getRandomLetter(letters));
        }
        letterText.setInteractive();
        letterText.on('pointerdown', function () {
            var letter = letterText.text;
            if (letter === beginningLetter) {
                animateImage.call(scene, 'happy', letterText.x, letterText.y);
                currentIncompleteWord = beginningLetter + currentIncompleteWord.substring(1);
                wordText.setText(getDisplayWord(currentIncompleteWord));
                var correctSound = scene.sound.add('correct');
                correctSound.play();
                var boardTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
                var boardText = scene.add.text(boardImage.x, boardImage.y, "أحسنت", boardTextStyle).setOrigin(0.5);
            } else {
                animateImage.call(scene, 'sad', letterText.x, letterText.y);
                incorrectClicks++;
                if (incorrectClicks >= maxIncorrectClicks) {
                    var boardTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
                    var boardText = scene.add.text(boardImage.x, boardImage.y, "خطأ", boardTextStyle).setOrigin(0.5);
                    var inCorrectSound = scene.sound.add('incorrect');
                    inCorrectSound.play();
                    scene.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            window.location.reload();
                        },
                        loop: false
                    });
                }
            }
        });
    });
}

function updateCircleLetters(scene, newText) {
    scene.lettersOnCircles.forEach(letterText => {
        var randomLetter = getRandomLetter(letters);
        if (newText.trim().length === 0) {
            letterText.setText(randomLetter);
        } else {
            letterText.setText(newText);
        }
    });
}

function animateImage(imageKey, x, y) {
    var image = this.add.image(x, y, imageKey);
    this.tweens.add({
        targets: image,
        y: image.y - 50,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: function () {
            image.destroy();
        }
    });
}

function generateCirclePositions(numCircles) {
    var circlePositions = [];

    switch (numCircles) {
        case 2:
            circlePositions = [{ x: 400, y: 250 }, { x: 600, y: 220 }];
            break;
        case 3:
            circlePositions = [{ x: 200, y: 220 }, { x: 400, y: 250 }, { x: 600, y: 220 }];
            break;
        case 4:
            circlePositions = [{ x: 200, y: 220 }, { x: 400, y: 250 }, { x: 500, y: 380 }, { x: 300, y: 380 }];
            break;
        case 5:
            circlePositions = [{ x: 200, y: 220 }, { x: 400, y: 250 }, { x: 600, y: 220 }, { x: 500, y: 380 }, { x: 300, y: 380 }];
            break;
        case 6:
            circlePositions = [{ x: 200, y: 220 }, { x: 400, y: 250 }, { x: 600, y: 220 }, { x: 500, y: 380 }, { x: 300, y: 380 }];
            break;
        case 7:
            circlePositions = [{ x: 200, y: 220 }, { x: 400, y: 250 }, { x: 600, y: 220 }, { x: 500, y: 380 }, { x: 300, y: 380 }];
            break;
        case 8:
            circlePositions = [{ x: 200, y: 220 }, { x: 400, y: 250 }, { x: 600, y: 220 }, { x: 500, y: 380 }, { x: 300, y: 380 }];
            break;
        default:
            circlePositions = [{ x: 400, y: 250 }];
            break;
    }

    return circlePositions;
}

function getDisplayWordWithHiddenFirstLetter(word) {
    var hiddenWord = "";
    for (var i = 0; i < word.length; i++) {
        if (i === 0) {
            hiddenWord += " _ ";
        } else {
            hiddenWord += " " + word[i];
        }
    }
    return hiddenWord;
}

function getDisplayWord(word) {
    var displayWord = "";
    for (var i = 0; i < word.length; i++) {
        displayWord += " " + word[i];
    }
    return displayWord;
}

function getRandomLetter(letters) {
    return letters[Math.floor(Math.random() * letters.length)];
}
function update(){}