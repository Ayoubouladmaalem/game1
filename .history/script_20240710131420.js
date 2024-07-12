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
var correctCircle;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('shot', 'assets/shot.png');
    this.load.image('happy', 'assets/happy.png');
    this.load.image('sad', 'assets/sad.png');
    this.load.image('letter', 'assets/letter.png');
}

function create() {
    this.add.image(400, 300, 'background');

    var circle1 = this.add.image(400, 250, 'circle').setInteractive();
    var circle2 = this.add.image(600, 220, 'circle').setInteractive();
    var circle3 = this.add.image(200, 220, 'circle').setInteractive();

    this.add.image(250, 500, 'shot');
    var letterImage = this.add.image(600, 500, 'letter');

    var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];
    var randomWord = getRandomWord(letters, 3);
    var textStyle = { font: "32px 'Amiri'", fill: "#ffffff", align: "center" };
    this.add.text(letterImage.x, letterImage.y, randomWord, textStyle).setOrigin(0.5);

    var circles = [circle1, circle2, circle3];
    correctCircle = Phaser.Math.RND.pick(circles);
    
    circles.forEach(circle => {
        circle.on('pointerdown', function() {
            if (circle === correctCircle) {
                showHappyImage(this);
            } else {
                showSadImage(this);
            }
        }, this);
    });
}

function update() {
}

function getRandomWord(letters, length) {
    let word = '';
    for (let i = 0; i < length; i++) {
        word += getRandomLetter(letters);
    }
    return word;
}

function getRandomLetter(letters) {
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function showHappyImage(scene) {
    var happyImage = scene.add.image(400, 600, 'happy');
    scene.tweens.add({
        targets: happyImage,
        y: 300,
        duration: 1000,
        ease: 'Power2',
        onComplete: function() {
            happyImage.destroy();
        }
    });
}

function showSadImage(scene) {
    var sadImage = scene.add.image(400, 600, 'sad');
    scene.tweens.add({
        targets: sadImage,
        y: 300,
        duration: 1000,
        ease: 'Power2',
        onComplete: function() {
            sadImage.destroy();
        }
    });
}
