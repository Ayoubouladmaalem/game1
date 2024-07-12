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

var incompleteWords = [
    "حليب", "ماء", "شمس", "كتاب", "سماء", "قمر", "جمل", "سلام", "نجمة", "زهرة",
    "جبل", "صحراء", "بحر", "سفينة", "مدينة", "قرية", "حضارة", "تاريخ", "حكاية",
    "خيال", "واقع", "صداقة", "حب", "أمل", "سعادة", "حزن", "غربة", "حرية",
    "ديمقراطية", "سلطة", "شرطة", "سيارة", "طائرة", "بناء", "مهنة", "عمل", "مال",
    "فن", "ثقافة", "دين", "إسلام", "مسيحية", "يهودية", "حضارة", "تقنية", "طبيعة",
    "حيوان", "نبات", "أكل", "شراب", "صحة", "مرض", "دواء", "علم", "أدب",
    "شعر", "فلسفة", "سياسة", "اقتصاد", "جامعة", "مدرسة", "طالب", "دراسة", "علماء",
    "أستاذ", "معلم", "مدير", "مستشفى", "طبيب", "مريض", "صيدلية", "دواء", "أمانة",
    "ثروة", "حضارة", "أسرة", "ابن", "بنت", "زوجة", "زوج", "أخ", "أخت",
    "جد", "جدة", "عائلة", "منزل", "شقة", "غرفة", "سرير", "طعام", "شراب"
];

var currentIncompleteWord = "";
var beginningLetter;
var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];
var incorrectClicks = 0;
var maxIncorrectClicks = 3;
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
    this.load.image('player','assets/ball.png');
    this.load.image('wood','assets/wood.png');
    this.load.image('direction','assets/direction.png');
    this.load.image('board','assets/board.png');
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
    currentIncompleteWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
    beginningLetter = currentIncompleteWord.charAt(0);

    var letterImage = this.add.image(400, 540, 'letter');
    wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);
    wordText.setId('wordText'); // Set an ID for the word text

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

    // Update the answers input field with the current word
    updateAnswersInput();
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
                updateAnswersInput(); // Update the answers input field
            } else {
                animateImage.call(scene, 'sad', letterText.x, letterText.y);
                incorrectClicks++;
                if (incorrectClicks >= maxIncorrectClicks) { gameOver(scene); }
                var incorrectSound = scene.sound.add('incorrect');
                incorrectSound.play();
                var boardTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
                var boardText = scene.add.text(boardImage.x, boardImage.y, "حاول مرة أخرى", boardTextStyle).setOrigin(0.5);
            }
        });
    });

}

function updateCircleLetters(scene, newText) {
    for (var i = 0; i < scene.lettersOnCircles.length; i++) {
        var newLetter = newText.charAt(i) || "أ"; // Default to "أ" if no letter is entered
        scene.lettersOnCircles[i].setText(newLetter);
    }
}

function generateCirclePositions(numCircles) {
    var positions = [];
    if (numCircles === 1) {
        positions.push({ x: 400, y: 250 });
    } else if (numCircles === 2) {
        positions.push({ x: 300, y: 250 }, { x: 500, y: 250 });
    } else if (numCircles === 3) {
        positions.push({ x: 250, y: 220 }, { x: 400, y: 300 }, { x: 550, y: 220 });
    } else if (numCircles === 4) {
        positions.push({ x: 250, y: 250 }, { x: 550, y: 250 }, { x: 350, y: 350 }, { x: 450, y: 350 });
    } else if (numCircles === 5) {
        positions.push({ x: 400, y: 250 }, { x: 600, y: 220 }, { x: 200, y: 220 }, { x: 500, y: 380 }, { x: 300, y: 380 });
    } else {
        var angleStep = (2 * Math.PI) / numCircles;
        var radius = 100;
        var centerX = 400;
        var centerY = 300;
        for (var i = 0; i < numCircles; i++) {
            var angle = i * angleStep;
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            positions.push({ x: x, y: y });
        }
    }
    return positions;
}

function getDisplayWordWithHiddenFirstLetter(word) {
    return "*" + word.substring(1);
}

function getDisplayWord(word) {
    return word;
}

function getRandomLetter(letters) {
    return letters[Math.floor(Math.random() * letters.length)];
}

function animateImage(imageKey, x, y) {
    var image = this.add.image(x, y, imageKey);
    this.tweens.add({
        targets: image,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: function() { image.destroy(); }
    });
}

function update() {
    var woodTextInput = document.getElementById("woodTextInput").value;
    this.woodText.setText(woodTextInput);
}

function gameOver(scene) {
    var gameOverText = scene.add.text(400, 300, 'Game Over', { font: "64px Arial", fill: "#ff0000" }).setOrigin(0.5);
    scene.input.off('pointerdown');
    setTimeout(function() { scene.scene.restart(); }, 3000);
}

// Function to update the answers input field
function updateAnswersInput() {
    var answersInput = document.getElementById("answers");
    answersInput.value = currentIncompleteWord;
}
