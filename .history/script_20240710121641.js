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
    this.load.image('letter', 'assets/letter.png')

    

}

function create ()
{
    this.add.image(400, 300, 'background');
    this.add.image(400, 250, 'circle');
    this.add.image(600, 220, 'circle');
    this.add.image(200, 220, 'circle');
    this.add.image(250, 500, 'shot');





}

function update ()
{
}