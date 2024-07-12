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
    "جد", "جدة", "عائلة", "منزل", "شقة", "غرفة", "سرير", "طعام", "شراب"];
var currentIncompleteWord = "";
var beginningLetter;
var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];
var incorrectClicks = 0;
var maxIncorrectClicks = 3;

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

    var boardImage = this.add.image(650, 530, 'board').setOrigin(0.5);

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
    var wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);

    this.circles = [];
    this.lettersOnCircles = [];

    // Initialize circles based on user input
    updateCircles.call(this);
}

function updateCircles() {
    var scene = this.scene ? this.scene : this;
    var numCircles = document.getElementById("numCircles").value;
    numCircles = parseInt(numCircles);

    if (scene.circles) {
        scene.circles.forEach(circle => circle.destroy());
        scene.lettersOnCircles.forEach(letter => letter.destroy());
    }
    
    scene.circles = [];
    scene.lettersOnCircles = [];

    var circlePositions = generateCirclePositions(numCircles);
    for (var i = 0; i < circlePositions.length; i++) {
        var circle = scene.add.image(circlePositions[i].x, circlePositions[i].y, 'circle');
        scene.circles.push(circle);
    }

    for (var j = 0; j < scene.circles.length; j++) {
        var letterText = scene.add.text(scene.circles[j].x, scene.circles[j].y, getRandomLetter(letters), { font: "32px Arial", fill: "#000000", align: "center" }).setOrigin(0.5);
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
                if (incorrectClicks >= maxIncorrectClicks) { gameOver(); }
                var incorrectSound = scene.sound.add('incorrect');
                incorrectSound.play();
            }
        }, scene);
    });

    scene.circles.forEach((circle) => {
        circle.setInteractive();
        circle.on('pointerover', function() {
            scene.tweens.add({ targets: circle, y: circle.y - 10, yoyo: true, duration: 200, ease: 'Power2' });
        }, scene);
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
    for (var i = 0; i < word.length; i++) {
        displayWord += (i === 0) ? '_' : word.charAt(i);
    }
    return displayWord;
}

function generateCirclePositions(numCircles) {
    var positions = [];
    for (var i = 0; i < numCircles; i++) {
        var x = 150 + (i * 80);
        var y = 400;
        positions.push({ x: x, y: y });
    }
    return positions;
}

function gameOver() {
    var boardTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
    var boardText = this.add.text(boardImage.x, boardImage.y, "حاول مرة أخرى", boardTextStyle).setOrigin(0.5);
}

document.getElementById('updateButton').onclick = function() {
    updateCircles.call(game.scene.scenes[0]);
};
