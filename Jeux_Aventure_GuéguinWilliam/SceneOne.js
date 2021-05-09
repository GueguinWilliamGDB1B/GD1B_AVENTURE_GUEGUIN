var player;
var cursors;
var gamepad;
var paddle;
var padConnected;
var pad;

class SceneOne extends Phaser.Scene{
    constructor(){
        super("sceneOne");
        this.pad = null;
    }
    init(data){
    }
    preload(){   
        this.load.image("tiles", "assets/tiled.png");
        this.load.tilemapTiledJSON("map_1_placeholder", "maison.json");
        //this.load.image('player', 'assets/player.png');
        this.load.spritesheet('player', 'assets/perso_spritesheet.png', { frameWidth: 31, frameHeight: 48 });
    }
    create(){
        const map = this.make.tilemap({key: 'map_1_placeholder'});
        const tileset = map.addTilesetImage('CaseBase', 'tiles');
        const terrain = map.createStaticLayer('sol', tileset, 0, 0);
        const bloquant = map.createStaticLayer('mur', tileset, 0, 0);
        const transitionDesert1 = map.createStaticLayer('sortie_maison', tileset, 0, 0);
        
        
        

        bloquant.setCollisionByExclusion(-1, true);
        transitionDesert1.setCollisionByExclusion(-1, true);

        player = this.physics.add.sprite(1068, 615, 'player').setDepth(5);
        
        this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 10, end: 11 }),
        frameRate: 4,
        repeat: -1
        });

        this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 7, end: 8 }),
        frameRate: 4,
        repeat: -1
        });

        this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
        frameRate: 4,
        repeat: -1
        });
        
        this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
        frameRate: 4,
        repeat: -1
        });
        
        this.anims.create({
        key: 'turnDown',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
    });


        this.physics.add.collider(player, bloquant);
        this.physics.add.overlap(player, transitionDesert1, changementZone, null, this);
        
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, player.widthInPixels, player.heightInPixels);

        cursors = this.input.keyboard.createCursorKeys();
        if (this.input.gamepad.total === 0){
            this.input.gamepad.once('connected', function (pad, button, index) {
                paddle = pad;
                padConnected = true;
            }); 
        }
        else {
            paddle = this.input.gamepad.pad1;
        }
        
        
        
        
        
        
        function changementZone(player, transitionDesert1){
            if (player.y >= 864 && player.x >= 1024 && player.x <= 1088){
               this.scene.start("sceneTwo");
                console.log("changement");
            }
        }
    }
    
    update(){
        if (cursors.right.isDown){
            player.setVelocityX(400);
            player.anims.play('right', true);
        }
        else if (cursors.left.isDown){
            player.setVelocityX(-400);
            player.anims.play('left', true);
        }
        else if (cursors.up.isDown){
            player.setVelocityY(-400);
            player.anims.play('up', true);
        }
        else if (cursors.down.isDown){
            player.setVelocityY(400);
            player.anims.play('down', true);
        }
        else{
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('turnDown');
            
        }
        if(padConnected){
            
            if (paddle.right){
                player.setVelocityX(200);
                player.anims.play('right', true);
            }
            else if (paddle.left){
                player.setVelocityX(-200);
                player.anims.play('left', true);
            }
            else if (paddle.up){
                player.setVelocityY(-200);
                player.anims.play('up', true);
            }
            else if (paddle.down){
                player.setVelocityY(200);
                player.anims.play('down', true);
            }
            else{
                player.setVelocityX(0);
                player.setVelocityY(0);
                player.anims.play('turnDown');
            }
        }
    }
}