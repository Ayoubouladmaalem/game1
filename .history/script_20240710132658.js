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

function preload ()
{
    this.load.image('background','assets/background.png')
    this.load.image('circle','assets/circle.png')
    this.load.image('shot', 'assets/shot.png')
    this.load.image('happy', 'assets/happy.png')
    this.load.image('sad', 'assets/sad.png')
    // this.load.image('letter', 'assets/letter.png')
}

function create ()
{
    this.add.image(400, 300, 'background');
    var circle1 = this.add.image(650, 280, 'circle');
    var circle2 = this.add.image(500, 280, 'circle');
    var circle3 = this.add.image(350, 280, 'circle');
    var circle4 = this.add.image(180, 280, 'circle');

    this.add.image(210, 500, 'shot');
    // this.add.image(600, 500, 'letter');

    var letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"];
    var textStyle = { font: "32px Arial", fill: "#ffffff", align: "center" };

    this.add.text(circle1.x, circle1.y, getRandomLetter(letters), textStyle).setOrigin(0.5);
    this.add.text(circle2.x, circle2.y, getRandomLetter(letters), textStyle).setOrigin(0.5);
    this.add.text(circle3.x, circle3.y, getRandomLetter(letters), textStyle).setOrigin(0.5);
    this.add.text(circle4.x, circle4.y, getRandomLetter(letters), textStyle).setOrigin(0.5);

    
}

function getRandomLetter(letters) {
    var randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
}

function update ()
{
}