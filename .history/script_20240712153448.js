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
    
    // Get the words from the answersInput field
    var answersInput = document.getElementById("answersInput").value;
    var incompleteWords = answersInput.split(',').map(word => word.trim());
    
    currentIncompleteWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
    beginningLetter = currentIncompleteWord.charAt(0);

    var letterImage = this.add.image(400, 540, 'letter');
    wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);
    this.letterImage = letterImage;  // Store letterImage in the scene context
    this.wordText = wordText;  // Store wordText in the scene context

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
                    scene.wordText.setText(currentIncompleteWord);  // Update the word text on correct answer
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

function updateCircleLetters(scene, newText) {
    for (var i = 0; i < scene.lettersOnCircles.length; i++) {
        var letterText = scene.lettersOnCircles[i];
        var newLetter = newText.charAt(i) || "أ"; // Default to "أ" if no letter is entered
        letterText.setText(newLetter);
    }
}

function generateCirclePositions(numCircles) {
    var positions = [];
    var centerX = 400;
    var centerY = 300;
    var radius = 200;

    for (var i = 0; i < numCircles; i++) {
        var angle = (i / numCircles) * Phaser.Math.PI2;
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);
        positions.push({ x: x, y: y });
    }
    return positions;
}

function getDisplayWordWithHiddenFirstLetter(word) {
    if (word.length > 1) {
        return "?" + word.substring(1);
    } else {
        return "?";
    }
}

function displayMessage(title, message, imageKey) {
    var messageBox = document.createElement('div');
    messageBox.style.position = 'absolute';
    messageBox.style.top = '50%';
    messageBox.style.left = '50%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.backgroundColor = '#fff';
    messageBox.style.border = '2px solid #000';
    messageBox.style.padding = '20px';
    messageBox.style.textAlign = 'center';

    var titleElement = document.createElement('h2');
    titleElement.innerText = title;

    var messageElement = document.createElement('p');
    messageElement.innerText = message;

    var imageElement = document.createElement('img');
    imageElement.src = `assets/${imageKey}.png`;

    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    messageBox.appendChild(imageElement);

    document.body.appendChild(messageBox);

    setTimeout(function() {
        document.body.removeChild(messageBox);
    }, 3000);
}

function update() {
    // Any update logic you need can go here
}
