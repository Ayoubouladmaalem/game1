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
    this.load.image('shot', 'shot/shot.png')

}

function create ()
{
    this.add.image(400, 300, 'background');
    this.add.image(400, 300, 'circle');
    this.add.image(500, 200, 'circle');
    this.add.image(200, 200, 'circle');




}

function update ()
{
}