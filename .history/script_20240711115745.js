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
function preload() {


    this.load.audio('bgsound', 'assets/bg-sound.wav');
    this.load.image('background', 'assets/background.png');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('happy', 'assets/happy.png');
    this.load.image('sad', 'assets/sad.png');
    this.load.image('letter', 'assets/letter.png');
    this.load.image('shot', 'assets/shot.png');
    this.load.image('player','assets/ball.png');
    this.load.image('spot','assets/spot.png');
    this.load.image('wood','assets/wood.png');


}

function create() {

    

    this.add.image(400, 300, 'background');

    var woodImage = this.add.image(400, 60, 'wood');
    var woodTextStyle = { font: "32px Cairo", fill: "#FDCD2B", align: "center" };
    var woodText = this.add.text(woodImage.x, woodImage.y,"اختر الحرف المناسب لبداية الكلمة", woodTextStyle).setOrigin(0.5);


    var circle1 = this.add.image(400, 250, 'circle');
    var circle2 = this.add.image(600, 220, 'circle');
    var circle3 = this.add.image(200, 220, 'circle');
    var circle4 = this.add.image(500, 380, 'circle');
    var circle5 = this.add.image(300, 380, 'circle');

    var circles = [circle1, circle2, circle3, circle4, circle5];

    var textStyle = { font: "32px Arial", fill: "#000000", align: "center" };

    // Choose a random incomplete word from the array
    currentIncompleteWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
    beginningLetter = currentIncompleteWord.charAt(0);

    // Add the 'letter.png' image and position it
    var letterImage = this.add.image(400, 540, 'letter');
    var wordText = this.add.text(letterImage.x, letterImage.y, getDisplayWordWithHiddenFirstLetter(currentIncompleteWord), textStyle).setOrigin(0.5);

    


    var lettersOnCircles = [
        this.add.text(circle1.x, circle1.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle2.x, circle2.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle3.x, circle3.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle4.x, circle4.y, getRandomLetter(letters), textStyle).setOrigin(0.5),
        this.add.text(circle5.x, circle5.y, getRandomLetter(letters), textStyle).setOrigin(0.5)
    ];

    // Choose a random circle index to place the correct letter
    var correctCircleIndex = Phaser.Math.Between(0, 4);
    lettersOnCircles[correctCircleIndex].setText(beginningLetter); // Place the correct letter

    lettersOnCircles.forEach((letterText, index) => {
        if (index !== correctCircleIndex) {
            letterText.setText(getRandomLetter(letters)); // Set random letters for other circles
        }

        letterText.setInteractive();
        letterText.on('pointerdown', function() {
            var letter = letterText.text;
            if (letter === beginningLetter) {
                animateImage.call(this, 'happy', letterText.x, letterText.y);
                currentIncompleteWord = beginningLetter + currentIncompleteWord.substring(1); // Replace '_' with the correct letter
                wordText.setText(getDisplayWord(currentIncompleteWord));

            } else {
                animateImage.call(this, 'sad', letterText.x, letterText.y);
            }
        }, this);
    });

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

function update() {
    
}