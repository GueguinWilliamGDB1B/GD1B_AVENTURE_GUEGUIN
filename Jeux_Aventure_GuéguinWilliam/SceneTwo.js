var player;
var cursors;
var vie = 3;
var scoreVie;
var enemies1;
var enemie1;
var collectibles1;
var collectible1;
var scoreRestesHumains;
var restesHumains = 0;
var invincible = false;
var compteur = 150;
var gameOver = false;
var bouclierObjet;
var itembouclier;
var getBouclier = false;
var createbouclier;
var gamepad;
var paddle;
var padConnected;
var pad;
var random;
var itemVie;
var itemVies;



class SceneTwo extends Phaser.Scene{
    constructor(){
        super("sceneTwo");
        this.pad = null;
    }
    init(data){
    }
    preload(){
        this.load.image("tiles", "assets/tiled.png");
        this.load.tilemapTiledJSON("map_2_placeholder", "salle_extérieure.json"); 
        this.load.image('monstre1', 'assets/monstre.png');
        this.load.image('collectible1', 'assets/restesHumains.png');
        this.load.image('bouclierObjet', 'assets/bouclier.png');
        this.load.image('PointDeVie', 'assets/coeur.png');
        
        
        
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////
    
    create(){
        const map = this.make.tilemap({key: 'map_2_placeholder'});
        const tileset = map.addTilesetImage('CaseBase', 'tiles');
        const terrain = map.createStaticLayer('sol', tileset, 0, 0);
        const bloquant = map.createStaticLayer('murDesert', tileset, 0, 0);
        
        
        const transitionMaison = map.createStaticLayer('transitionMaison', tileset, 0, 0);
        const transitionGrotte = map.createStaticLayer('transitionGrotte', tileset, 0, 0);
        //const ennemis = map.createDynamicLayer('ennemis', tileset, 0, 0);
        
       


        bloquant.setCollisionByExclusion(-1, true);

        player = this.physics.add.sprite(663, 2883, 'player');
        
        // caméra
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, player.widthInPixels, player.heightInPixels);

        
        
        // monstres
        const enemieObjects = map.getObjectLayer('monstre_verticale').objects;
        enemies1 = this.physics.add.group({
        }); 

        for (const enemie1 of enemieObjects) {
        enemies1.create(enemie1.x, enemie1.y, 'monstre1')
        }

        for (const enemie1 of enemies1.children.entries) {
            enemie1.direction = 'UP';
            enemie1.isDed = true;
        }  
        
        //////////////// Objet à ramasser //reste humains /////////////////
        const collectibleObject = map.getObjectLayer('restesHumains').objects;
        collectibles1 = this.physics.add.group({
        }); 

        for (const collectible1 of collectibleObject) {
            collectibles1.create(collectible1.x, collectible1.y, 'collectible1')
            }
        ///////////////Bouclier////////////////
        /*const bouclierObject = map.getObjectLayer('Bouclier').objects;
        bouclierObjet = this.physics.add.group({
        }); 
        
        
         if(getBouclier === false){
            const createbouclier = map.findObject("BouclierCalque", obj => obj.name === "Bouclier");
            itembouclier = this.physics.add.sprite(createbouclier.x, createbouclier.y,"Bouclier")
            .setSize(32, 32,)
            }
        */
      
        
        /////////////itemVies////////////
        itemVies= this.physics.add.group();
        
        
        ///////Collider/////////////

        this.physics.add.collider(player, bloquant);
        this.physics.add.collider(enemies1, bloquant);
        //this.physics.add.overlap(player, transitionMaison, changementZone);
        //this.physics.add.overlap(player, transitionGrotte, changementZone);
        this.physics.add.overlap(player, collectibles1, collecteRestesHumains, null, this);
        this.physics.add.collider(player, enemies1, contactMonstre, null, this);
        this.physics.add.overlap(player, itemVies, gagnerPV, null, this);

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
        
        
        
        ////////Scores///////////////
        
        scoreVie = this.add.text(100, 25,"Vos PV: "+vie, { fontSize: '36px', fill: '#ff0000' }).setScrollFactor(0);
        
        scoreRestesHumains = this.add.text(100, 75,"Vos restes humains: "+restesHumains, { fontSize: '36px', fill: '#ff0000' }).setScrollFactor(0);
        
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////
    
    update(){
        
    //////////////////déplacement joueur////////////////////////
        
        
        if (cursors.right.isDown){
        player.setVelocityX(200);
        }
        else if (cursors.left.isDown){
            player.setVelocityX(-200);
        }
        else if (cursors.up.isDown){
            player.setVelocityY(-200);
        }
        else if (cursors.down.isDown){
            player.setVelocityY(200);
        }
        else{
            player.setVelocity(0);
        }
        
        
        if(padConnected){
            
            if (paddle.right){
                player.setVelocityX(200);
            }
            else if (paddle.left){
                player.setVelocityX(-200);
            }
            else if (paddle.up){
                player.setVelocityY(-200);
            }
            else if (paddle.down){
                player.setVelocityY(200);
            }
            else{
                player.setVelocity(0);
            }
        }
    
    
    
    //monstre déplacement !!!!!!!!!! ne fontionne que si l'on ne les regarde pas   \o/  !!!!!!!!!!!!!!!!!!!
    
    for (const enemie1 of enemies1.children.entries) {
            if (enemie1.body.blocked.up) {
                enemie1.direction = 'UP';
                console.log(enemie1.body.blocked);
            }
    
            if (enemie1.body.blocked.down) {
                enemie1.direction = 'DOWN';
            }
    
            if (enemie1.direction === 'UP') {
                enemie1.setVelocityY(80);
                
                
            } 
            if (enemie1.direction === 'DOWN'){ 
                enemie1.setVelocityY(-80);
                
               
            }
           
    }
    /////////////////// comportement Object RestesHumains //////////////////////
    
                
    
        
            
            //scoreRestesHumains.setText('Restes Humains: ' + restesHumains);
            
    if(invincible == true){ // relance du compteur d'invulné player //
            compteur-- ;
            if(compteur == 0){
                compteur = 150;
                invincible = false ;
            } 
        }
    }
}


function collecteRestesHumains(player,collectible1){
            collectible1.destroy();
            restesHumains +=  1;
    
            scoreRestesHumains.setText("Vos restes humains: "+restesHumains, { fontSize: '36px', fill: '#ff0000' });

    }
    
function contactMonstre(player, enemie1){ 
            enemie1.destroy();
            random = Math.floor(Math.random()*Math.floor(4));
            if(random == 1){
                itemVie = itemVies.create(enemie1.x,enemie1.y,"PointDeVie");
            }
            vie -=  1;
    
            scoreVie.setText("Vos PV:  "+vie);
    
            if(vie <1 ){
                gameOver = true;
                this.physics.pause();
                this.add.text(635, 360, "Partie perdu", { fontSize: '36px', fill: '#ff0000' }).setScrollFactor(0);
            }
    }
function gagnerPV(player,itemVie){
        itemVie.destroy();
        vie +=  1;
    
        scoreVie.setText("Vos PV:  "+vie);
        
    
}
