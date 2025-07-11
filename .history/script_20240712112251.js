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
    var woodTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
    var woodText = this.add.text(woodImage.x, woodImage.y, "اختر الحرف المناسب لبداية الكلمة", woodTextStyle).setOrigin(0.5);

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

    this.circles = [];
    this.lettersOnCircles = [];

    // Initialize circles based on user input
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

    // Clear existing circles and letters
    scene.circles.forEach(circle => circle.destroy());
    scene.circles = [];
    scene.lettersOnCircles.forEach(letter => letter.destroy());
    scene.lettersOnCircles = [];

    var circlePositions = generateCirclePositions(numCircles);
    for (var i = 0; i < circlePositions.length; i++) {
        var circle = scene.add.image(circlePositions[i].x, circlePositions[i].y, 'circle');
        scene.circles.push(circle);

        var letterText = scene.add.text(circle.x, circle.y, getRandomLetter(letters), { font: "32px Arial", fill: "#000000", align: "center" }).setOrigin(0.5);
        scene.lettersOnCircles.push(letterText);
    }

    var correctCircleIndex = Phaser.Math.Between(0, scene.circles.length - 1);
    scene.lettersOnCircles[correctCircleIndex].setText(beginningLetter);

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



function getRandomLetter(letters) {
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function animateImage(imageKey, targetX, targetY) {
    var image = this.add.image(targetX, 600, imageKey);
    this.tweens.add({ targets: image, y: targetY, duration: 1000, ease: 'Power2', onComplete: function() { image.destroy(); } });
}

function getDisplayWordWithHiddenFirstLetter(word) {
    var displayWord ='';
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

// function generateCirclePositions(numCircles) {
//     var positions = [];

//     // Define default position for one circle
//     if (numCircles === 1) {
//         positions.push({ x: 400, y: 300 });
//     } else {
//         // Calculate positions for multiple circles
//         for (var i = 0; i < numCircles; i++) {
//             // Adjust x and y coordinates as needed
//             // Example: evenly distribute circles in a grid
//             var x = 400 + 100 * Math.cos((i / numCircles) * Math.PI * 2);
//             var y = 300 + 100 * Math.sin((i / numCircles) * Math.PI * 2);
//             positions.push({ x: x, y: y });
//         }
//     }

//     return positions;
// }

function generateCirclePositions(numCircles) {
    var positions = [];

    if (numCircles === 1) {
        positions.push({ x: 400, y: 300 });
    } else if (numCircles === 2) {
        positions.push({ x: 300, y: 250 }, { x: 500, y: 250 });
    } else if (numCircles === 3) {
        positions.push({ x: 400, y: 200 }, { x: 300, y: 350 }, { x: 500, y: 350 });
    } else if (numCircles === 4) {
        positions.push({ x: 300, y: 200 }, { x: 500, y: 200 }, { x: 300, y: 350 }, { x: 500, y: 350 });
    } else if (numCircles === 5) {
        positions.push({ x: 400, y: 250 },{ x: 600, y: 220 },{ x: 200, y: 220 },{ x: 500, y: 380 },{ x: 300, y: 380 });
    } else if (numCircles === 6) {
    positions.push({ x: 400, y: 250 },{ x: 600, y: 220 },{ x: 200, y: 220 },{ x: 500, y: 380 },{ x: 300, y: 380 });
    } else if (numCircles === 7) {
        positions.push({ x: 500, y: 380 },{ x: 300, y: 380 },
                                { x: 400, y: 250 },
                       { x: 600, y: 220 },{ x: 200, y: 220 }, { x: 800, y: 220 }, { x: 400, y: 220 });
    }else if (numCircles === 8) {
        positions.push({ x: 100, y: 200 },{ x: 300, y: 200 },{ x: 500, y: 200 },{ x: 700, y: 200 },
                       { x: 100, y: 350 },{ x: 300, y: 350 },{ x: 500, y: 350 },{ x: 700, y: 350 });
    }

    return positions;
}

function gameOver() {
    Swal.fire({
        title: 'انتهت اللعبة',
        text: 'لقد تجاوزت 3 نقرات',
        icon: 'error',
        confirmButtonText: 'حاول مرة أخرى'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reload or restart the game
            window.location.reload();
        }
    });
}  

document.getElementById('updateButton').onclick = function() {
    var scene = game.scene.scenes[0];
    updateCircles(scene);
};


function update() {}
