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
    "جد", "جدة", "عائلة", "منزل", "شقة", "غرفة", "سرير", "طعام", "شراب"]
var currentIncompleteWord = ""; // To store the current state of the incomplete word
var beginningLetter; // To store the beginning letter of the current incomplete word
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

    // Position boardImage
    var boardImage = this.add.image(650, 530, 'board').setOrigin(0.5);
    this.add.image(150, 530, 'direction').setOrigin(0.5);

    var textStyle = { font: "32px Arial", fill: "#000000", align: "center" };

    // Select a random word from incompleteWords array
    currentIncompleteWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
    beginningLetter = currentIncompleteWord.charAt(0);

    var letterImage = this.add.image(400, 540, 'letter');
    var wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);

    // Create circles dynamically
    var circles = [];
    var circlePositions = [
        { x: 400, y: 250 },
        { x: 600, y: 220 },
        { x: 200, y: 220 },
        { x: 500, y: 380 },
        { x: 300, y: 380 },
    ];

    for (var i = 0; i < circlePositions.length; i++) {
        var circle = this.add.image(circlePositions[i].x, circlePositions[i].y, 'circle');
        circles.push(circle);
    }

    var lettersOnCircles = [];
    for (var j = 0; j < circles.length; j++) {
        var letterText = this.add.text(circles[j].x, circles[j].y, getRandomLetter(letters), textStyle).setOrigin(0.5);
        lettersOnCircles.push(letterText);
    }

    // Determine the correct circle to place the beginning letter
    var correctCircleIndex = Phaser.Math.Between(0, circles.length - 1);
    lettersOnCircles[correctCircleIndex].setText(beginningLetter);

    lettersOnCircles.forEach((letterText, index) => {
        if (index !== correctCircleIndex) {
            letterText.setText(getRandomLetter(letters));
        }

        letterText.setInteractive();

        letterText.on('pointerdown', function() {
            var letter = letterText.text;
            if (letter === beginningLetter) {
                animateImage.call(this, 'happy', letterText.x, letterText.y);
                currentIncompleteWord = beginningLetter + currentIncompleteWord.substring(1);
                wordText.setText(getDisplayWord(currentIncompleteWord));

                var correctSound = this.sound.add('correct');
                correctSound.play();

                // Display "أحسنت" text
            //  var boardImage =animateImage.call(this, 'board',boardImage.x, boardImage.y);

                
                var boardTextStyle = { fontFamily: 'Marhey', fontSize: '28px', fill: '#FDCD2B', align: 'center' };
                var boardText = this.add.text(boardImage.x, boardImage.y, "أحسنت", boardTextStyle).setOrigin(0.5);
            } else {
                animateImage.call(this, 'sad', letterText.x, letterText.y);
                incorrectClicks++;

                if (incorrectClicks >= maxIncorrectClicks) {
                    gameOver();
                }
                var incorrectSound = this.sound.add('incorrect');
                incorrectSound.play();
            }
        }, this);
    });

    // Set up interaction for circles
    circles.forEach((circle) => {
        circle.setInteractive();
        circle.on('pointerover', function() {
            this.tweens.add({
                targets: circle,
                y: circle.y - 10,
                yoyo: true,
                duration: 200,
                ease: 'Power2'
            });
        }, this);
    });

    // Initialize player sprite and pointer movement
    this.player = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 50, 'player').setScale(1);
    this.input.on('pointermove', (pointer) => {
        this.player.x += (pointer.x - this.player.x) * 0.5;
        this.player.y += (pointer.y - this.player.y) * 0.5;
    });

    
}






function getRandomLetter(letters) {
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function animateImage(imageKey, targetX, targetY) {
    var image = this.add.image(targetX, 600, imageKey);
    this.tweens.add({
        targets: image,
        y: targetY,
        duration: 1000,
        ease: 'Power2',
        onComplete: function() {
            image.destroy();
        }
    });
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

function startAgain(){
    Swal.fire({
        title: 'أحسنت'  ,
        text: 'اضغط للحصول على الكلمة التالية',
        icon: 'success',
        confirmButtonText: 'كلمة جديدة'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reload or restart the game
            window.location.reload();
        }
    });

}

function update() {
    
}