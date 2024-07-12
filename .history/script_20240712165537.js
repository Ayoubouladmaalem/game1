var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
      
    }
};

var game = new Phaser.Game(config);
var currentIncompleteWord = "";
var beginningLetter;
var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];
var incorrectClicks = 0;
var maxIncorrectClicks = 3;
var words = [];
var currentWordIndex = 0;
var wordText;
var boardImage;

function preload() {
    this.load.audio('bgsound', 'assets/bg-sound.wav');
    this.load.audio('correct','assets/correct.wav');
    this.load.audio('incorrect','assets/incorrect.wav');
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

    var wordsInput = document.getElementById("wordsInput").value.trim();
    if (wordsInput !== "") {
        words = wordsInput.split(',').map(word => word.trim());
    } else {
        words = [""]; // Default empty word to prevent errors
    }

    var woodImage = this.add.image(400, 60, 'wood');
    var woodTextInput = document.getElementById("woodTextInput").value;
    var woodTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
    var woodText = this.add.text(woodImage.x, woodImage.y, woodTextInput, woodTextStyle).setOrigin(0.5);
    this.woodText = woodText;

    boardImage = this.add.image(650, 530, 'board').setOrigin(0.5);

    var directionImage = this.add.image(150, 530, 'direction').setOrigin(0.5);
    var directionTextStyle = { fontFamily: 'Marhey', fontSize: '25px', fill: '#000000', align: 'center' };
    var directionText = this.add.text(directionImage.x, directionImage.y, 'الكلمة التالية', directionTextStyle).setOrigin(0.5);
    directionImage.setInteractive();
    directionImage.on('pointerdown', function() { nextWord(this.scene); });
    directionImage.on('pointerover', function() {
        this.tweens.add({ targets: directionImage, y: directionImage.y - 10, yoyo: true, duration: 200, ease: 'Power2' });
    }, this);

    var textStyle = { font: "32px Arial", fill: "#000000", align: "center" };
    currentIncompleteWord = words[currentWordIndex];
    beginningLetter = currentIncompleteWord.charAt(0);

    var letterImage = this.add.image(400, 540, 'letter');
    wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);

    this.circles = [];
    this.lettersOnCircles = [];

    updateCircles(this);
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
        letterText.on('pointerdown', function() {
            var letter = letterText.text;
            if (letter === beginningLetter) {
                animateImage.call(scene, 'happy', letterText.x, letterText.y);
                currentIncompleteWord = beginningLetter + currentIncompleteWord.substring(1);
                wordText.setText(getDisplayWord(currentIncompleteWord));
                var correctSound = scene.sound.add('correct');
                correctSound.play();
                var boardTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
                var boardText = scene.add.text(boardImage.x, boardImage.y, "أحسنت", boardTextStyle).setOrigin(0.5);

                if (currentIncompleteWord === words[currentWordIndex]) {
                    nextWord(scene);
                }
            } else {
                animateImage.call(scene, 'sad', letterText.x, letterText.y);
                incorrectClicks++;
                if (incorrectClicks >= maxIncorrectClicks) { gameOver(scene); }
                var incorrectSound = scene.sound.add('incorrect');
                incorrectSound.play();
            }
        });
    });

    scene.circles.forEach((circle) => {
        circle.setInteractive();
        circle.on('pointerover', function() {
            scene.tweens.add({ targets: circle, y: circle.y - 10, yoyo: true, duration: 200, ease: 'Power2' });
        });
    });
}

function nextWord(scene) {
    currentWordIndex++;
    if (currentWordIndex < words.length) {
        currentIncompleteWord = words[currentWordIndex];
        beginningLetter = currentIncompleteWord.charAt(0);
        wordText.setText(getDisplayWordWithHiddenFirstLetter(currentIncompleteWord));
        updateCircles(scene);
    } else {
        // All words guessed, game over
        gameOver(scene);
    }
}

function gameOver(scene) {
    Swal.fire({
        title: 'انتهت اللعبة',
        text: 'لقد أجبت على جميع الأسئلة بشكل صحيح',
        icon: 'success',
        confirmButtonText: 'حسناً'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
}

function getRandomLetter(letters) {
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function animateImage(imageKey, targetX, targetY) {
    var image = this.add.image(targetX, 600, imageKey);
    this.tweens.add({ targets: image, y: targetY, duration: 1000, ease: 'Power2', onComplete: function() { image.destroy(); } });
}

function getDisplayWordWithHiddenFirstLetter(word) {
    var displayWord = '';
    for (var i = 1; i < word.length; i++) {
        displayWord += word[i];
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

function generateCirclePositions(numCircles) {
    var positions = [];

    switch (numCircles) {
        case 1:
            positions.push({ x: 400, y: 300 });
            break;
        case 2:
            positions.push({ x: 300, y: 300 }, { x: 500, y: 300 });
            break;
        case 3:
            positions.push({ x: 300, y: 300 }, { x: 500, y: 300 }, { x: 400, y: 400 });
            break;
        case 4:
            positions.push({ x: 300, y: 300 }, { x: 500, y: 300 }, { x: 300, y: 400 }, { x: 500, y: 400 });
            break;
        case 5:
            positions.push({ x: 300, y: 300 }, { x: 500, y: 300 }, { x: 400, y: 400 }, { x: 300, y: 500 }, { x: 500, y: 500 });
            break;
        case 6:
            positions.push({ x: 200, y: 250 }, { x: 400, y: 250 }, { x: 600, y: 250 }, { x: 200, y: 400 }, { x: 400, y: 400 }, { x: 600, y: 400 });
            break;
        case 7:
            positions.push({ x: 200, y: 250 }, { x: 400, y: 250 }, { x: 600, y: 250 }, { x: 200, y: 400 }, { x: 400, y: 400 }, { x: 600, y: 400 }, { x: 400, y: 100 });
            break;
        case 8:
            positions.push({ x: 200, y: 250 }, { x: 400, y: 250 }, { x: 600, y: 250 }, { x: 200, y: 400 }, { x: 400, y: 400 }, { x: 600, y: 400 }, { x: 400, y: 100 }, { x: 400, y: 300 });
            break;
        default:
            positions.push({ x: 400, y: 300 });
            break;
    }

    return positions;
}
