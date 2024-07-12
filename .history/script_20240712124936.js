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
    var woodTextInput = document.getElementById("woodTextInput").value;
    var woodTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
    var woodText = this.add.text(woodImage.x, woodImage.y, woodTextInput, woodTextStyle).setOrigin(0.5);
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
    wordText = this.add.text(400, 530, "", textStyle).setOrigin(0.5);

    var circlePositions = [
        { x: 400, y: 250 },
        { x: 600, y: 220 },
        { x: 200, y: 220 },
        { x: 500, y: 380 },
        { x: 300, y: 380 }
    ];

    updateCircles(this);

    var numCirclesInput = document.getElementById("numCircles");
    var updateButton = document.getElementById("updateButton");
    updateButton.addEventListener("click", function() {
        var numCircles = parseInt(numCirclesInput.value);
        if (numCircles >= 2 && numCircles <= 5) {
            circlePositions = [
                { x: 400, y: 250 },
                { x: 600, y: 220 },
                { x: 200, y: 220 },
                { x: 500, y: 380 },
                { x: 300, y: 380 }
            ];
        } else if (numCircles > 5 && numCircles <= 8) {
            circlePositions = [
                { x: 400, y: 250 },
                { x: 600, y: 220 },
                { x: 200, y: 220 },
                { x: 500, y: 380 },
                { x: 300, y: 380 }
            ];
        } else {
            circlePositions = [];
        }
        updateCircles(this);
    }.bind(this));
}

function update() {
    if (incorrectClicks >= maxIncorrectClicks) {
        this.scene.start();
    }
}

function updateCircles(scene) {
    var circlesGroup = scene.add.group();

    for (var i = 0; i < circlePositions.length; i++) {
        var circle = scene.add.image(circlePositions[i].x, circlePositions[i].y, 'circle').setInteractive();
        circle.on('pointerdown', function() {
            var clickedLetter = this.getData('letter');
            if (clickedLetter === beginningLetter) {
                var happy = scene.add.image(this.x, this.y, 'happy').setScale(0.5);
                setTimeout(function() {
                    happy.destroy();
                }, 1000);

                var answerIndex = incompleteWords.indexOf(currentIncompleteWord);
                incompleteWords.splice(answerIndex, 1);
                updateCircles(scene);
                scene.sound.play('correct');
                updateCircles(scene);
            } else {
                scene.sound.play('incorrect');
                incorrectClicks++;

                if (incorrectClicks >= maxIncorrectClicks) {
                    var sad = scene.add.image(this.x, this.y, 'sad').setScale(0.5);
                    setTimeout(function() {
                        sad.destroy();
                        scene.scene.restart();
                    }, 1000);
                } else {
                    var sad = scene.add.image(this.x, this.y, 'sad').setScale(0.5);
                    setTimeout(function() {
                        sad.destroy();
                    }, 1000);
                }
            }
        });
        circlesGroup.add(circle);
    }

    var randomIndex = Math.floor(Math.random() * incompleteWords.length);
    currentIncompleteWord = incompleteWords[randomIndex];
    wordText.setText(currentIncompleteWord);

    beginningLetter = currentIncompleteWord.charAt(0);
    for (var i = 0; i < circlePositions.length; i++) {
        var randomIndex = Math.floor(Math.random() * letters.length);
        var letter = letters[randomIndex];
        circlesGroup.getChildren()[i].setData('letter', letter);
    }
}

