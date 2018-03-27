let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
	TilingSprite = PIXI.extras.TilingSprite;

let app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialiasing: false,
    transparent: false,
    resolution: window.devicePixelRatio,
    autoResize: true,
    backgroundColor: 0x361639
})
document.body.appendChild(app.view);

var backgroundBehind = PIXI.Sprite.fromImage('images/bgtile.jpg');
backgroundBehind.width = app.screen.width;
backgroundBehind.height = app.screen.height;
app.stage.addChild(backgroundBehind);

var background = PIXI.Sprite.fromImage('images/background_bot.png');
background.width = app.screen.width;
background.y = 800;
app.stage.addChild(background);

loader
    .add([
        'images/bahamut.png',
        'images/leviathan.png',
        'images/addBet.png',
        'images/onehealth.png',
        'images/onehealth_empty.png'    
    ])
    .on("progress", loadProgressHandler)
    .load(setup)
    .load(onAssetsLoaded);

function loadProgressHandler(loader, resource) {
    console.log("Loading.." + resource.url);
    console.log("Progres: " + loader.progress + "%");
}

function setup() {
    console.log("Assets loaded!");

    const hero = new Sprite(loader.resources['images/bahamut.png'].texture);
    hero.zIndex = 10;
    hero.width = 400;
    hero.height = 400;
    hero.x = 200;
    hero.y = 470;
    app.stage.addChild(hero);

    // let hero_health = new Sprite(loader.resources['images/healthbar_empty.png'].texture);
    // hero_health.x = 250;
    // hero_health.y = 20;
    // app.stage.addChild(hero_health);

    const enemy = new Sprite(loader.resources['images/leviathan.png'].texture);
    enemy.width = 400;
    enemy.height = 400;
    enemy.x = 1300;
    enemy.y = 470;
    app.stage.addChild(enemy);

    let infobar = new PIXI.Graphics();
    infobar.beginFill(0x1d1d1d);
    infobar.drawRect(0,902,4000,77);
    infobar.alpha = 0.8;
    app.stage.addChild(infobar);

    let balanceLeft = 500;
    const balance = new PIXI.Text('Balance: ' + balanceLeft,{fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
    balance.anchor.set(0.5, 0.5);
    balance.position.set(140,936);
    app.stage.addChild(balance);

    let heroPlusButton = new Sprite(loader.resources['images/addBet.png'].texture);
    heroPlusButton.x = hero.x + 170;
    heroPlusButton.y = 150;
    heroPlusButton.width = 70;
    heroPlusButton.height = 70;
    app.stage.addChild(heroPlusButton);
    heroPlusButton.interactive=true;
    heroPlusButton.on('pointerdown', addOneHero);

    const heroBetCounterLabel = new PIXI.Text('Bet',{fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
    heroBetCounterLabel.x = heroPlusButton.x - 70;
    heroBetCounterLabel.y = heroPlusButton.y - 5;
    app.stage.addChild(heroBetCounterLabel);

    let heroBetCounterNumber = new PIXI.Text(0, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
    heroBetCounterNumber.x = heroBetCounterLabel.x + 20;
    heroBetCounterNumber.y = heroBetCounterLabel.y + 36;
    app.stage.addChild(heroBetCounterNumber);

    let enemyPlusButton = new Sprite(loader.resources['images/addBet.png'].texture);
    enemyPlusButton.x = enemy.x + 150;
    enemyPlusButton.y = 150;
    enemyPlusButton.width = 70;
    enemyPlusButton.height = 70;
    app.stage.addChild(enemyPlusButton);
    enemyPlusButton.interactive=true;
    enemyPlusButton.on('pointerdown', addOneEnemy);

    const enemyBetCounterLabel = new PIXI.Text('Bet',{fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
    enemyBetCounterLabel.x = enemyPlusButton.x + 90;
    enemyBetCounterLabel.y = enemyPlusButton.y - 5;
    app.stage.addChild(enemyBetCounterLabel);

    let enemyBetCounterNumber = new PIXI.Text(0, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
    enemyBetCounterNumber.x = enemyBetCounterLabel.x + 20;
    enemyBetCounterNumber.y = enemyBetCounterLabel.y + 36;
    app.stage.addChild(enemyBetCounterNumber);

    const slot = new PIXI.Graphics();
    slot.beginFill()
    slot.drawRect(window.innerWidth / 2.4, 100, 300, 600);
    slot.alpha = 0.9;
    app.stage.addChild(slot);

    let numberOfLivesHero = 5,
        spacing = 90;
        xOffset = 150;
        yOffset = 20;

        for (let i = 0; i < numberOfLivesHero; i++) {

            let life_e = new Sprite(loader.resources['images/onehealth_empty.png'].texture);
            let life_ex = spacing * i + xOffset;
            let life_ey = i + yOffset;
            life_e.x = life_ex;
            life_e.y = life_ey;
    
            app.stage.addChild(life_e);
    
        }

    for (let i = 0; i < numberOfLivesHero; i++) {

        let life = new Sprite(loader.resources['images/onehealth.png'].texture);
        let lifex = spacing * i + xOffset;
        let lifey = i + yOffset;
        life.x = lifex;
        life.y = lifey;

        app.stage.addChild(life);

    }


    let numberOfLivesEnemy = 5,
        spacingEnemy = 90;
        xOffset = 1300;
        yOffset = 20;

        for (let i = 0; i < numberOfLivesEnemy; i++) {

            let lifeEnemy_e = new Sprite(loader.resources['images/onehealth_empty.png'].texture);
            let lifeEnemy_eX = spacing * i + xOffset;
            let lifeEnemy_eY = i + yOffset;
            lifeEnemy_e.x = lifeEnemy_eX;
            lifeEnemy_e.y = lifeEnemy_eY;
    
            app.stage.addChild(lifeEnemy_e);
    
        }

    for (let i = 0; i < numberOfLivesEnemy; i++) {

        let lifeEnemy = new Sprite(loader.resources['images/onehealth.png'].texture);
        let lifeEnemyX = spacing * i + xOffset;
        let lifeEnemyY = i + yOffset;
        lifeEnemy.x = lifeEnemyX;
        lifeEnemy.y = lifeEnemyY;

        app.stage.addChild(lifeEnemy);

    }



    function addOneHero () {
        console.log("it is true");
        heroBetCounterNumber.text++;
        }

    function addOneEnemy () {
        console.log("it is true");
        enemyBetCounterNumber.text++;
        }
    
}
var REEL_WIDTH = 300;
var SYMBOL_SIZE = 150;

//onAssetsLoaded handler builds the example.
function onAssetsLoaded()
{
	//Create different slot symbols.
	var slotTextures = [
		PIXI.Texture.fromImage('images/bahamut.png'),
		PIXI.Texture.fromImage('images/leviathan.png')
	];

	//Build the reels horizontally
	var reels = [];
	var reelContainer = new PIXI.Container();
	for( var i = 0; i < 1; i++)
	{
		var rc = new PIXI.Container();
		rc.x = i*REEL_WIDTH;
		reelContainer.addChild(rc);
		
		var reel = {
			container: rc,
			symbols:[],
			position:0,
			previousPosition:0,
			blur: new PIXI.filters.BlurFilter()
		};
		reel.blur.blurX = 0;
		reel.blur.blurY = 0;
		rc.filters = [reel.blur];
		
		//Build the symbols vertically
		for(var j = 0; j < 3; j++)
		{
			var symbol = new PIXI.Sprite(slotTextures[ Math.floor(Math.random()*slotTextures.length)]);
			//Scale the symbol to fit symbol area.
			symbol.y = j*SYMBOL_SIZE;
			symbol.scale.x = symbol.scale.y = Math.min( SYMBOL_SIZE / symbol.width, SYMBOL_SIZE/symbol.height);
			symbol.x = Math.round((SYMBOL_SIZE - symbol.width)/2);
			reel.symbols.push(symbol);
			rc.addChild(symbol);
		}
		reels.push(reel);
	}
	app.stage.addChild(reelContainer);
	
	//Build top & bottom covers and position reelContainer
	var margin = (app.screen.height - SYMBOL_SIZE*3)/5;
	reelContainer.y = 470;
	reelContainer.x = Math.round(app.screen.width / 2.2);
    var bottom = new PIXI.Graphics();
    bottom.beginFill(0x000000);
    bottom.alpha = 0.95;
    bottom.x = 750;
    bottom.y = 0;
	bottom.drawRect(0,826,400,77);
	
	//Add play text
	var style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 36,
		fontWeight: 'bold',
		fill: ['#ffffff', '#00ff99'], // gradient
		stroke: '#4a1850',
		strokeThickness: 5,
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 440
	});
	
	var playText = new PIXI.Text('CLICK TO SPIN!', style);
	playText.x = Math.round((bottom.width - playText.width)/2);
    playText.y = app.screen.height/1.19 + Math.round((margin-playText.height)/2);
	bottom.addChild(playText);
    
    app.stage.addChild(bottom);
	
	//Set the interactivity.
	bottom.interactive = true;
	bottom.buttonMode = true;
	bottom.addListener("pointerdown", function(){
		startPlay();
	});
	
	var running = false;
	
	//Function to start playing.
	function startPlay(){
		if(running) return;
		running = true;
		
		for(var i = 0; i < reels.length; i++)
		{
			var r = reels[i];
			var extra = Math.floor(Math.random()*2);
			tweenTo(r, "position", r.position + 10+i*10+extra, 2500+i*600+extra*600, backout(0.7), null, i == reels.length-1 ? reelsComplete : null);
		}
	}
	
	//Reels done handler.
	function reelsComplete(){
		running = false;
	}
	
	// Listen for animate update.
	app.ticker.add(function(delta) {
		//Update the slots.
		for( var i = 0; i < reels.length; i++)
		{
			var r = reels[i];
			//Update blur filter y amount based on speed.
			//This would be better if calculated with time in mind also. Now blur depends on frame rate.
			r.blur.blurY = (r.position-r.previousPosition)*80;
			r.previousPosition = r.position;
			
			//Update symbol positions on reel.
			for( var j = 0; j < r.symbols.length; j++)
			{
				var s = r.symbols[j];
				var prevy = s.y;
				s.y = (r.position + j)%r.symbols.length*SYMBOL_SIZE-SYMBOL_SIZE*2;
				if(s.y < 0 && prevy > SYMBOL_SIZE){
					//Detect going over and swap a texture. 
					//This should in proper product be determined from some logical reel.
					s.texture = slotTextures[Math.floor(Math.random()*slotTextures.length)];
					s.scale.x = s.scale.y = Math.min( SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE/s.texture.height);
					s.x = Math.round((SYMBOL_SIZE - s.width)/2);
				}
			}
		}
	});
}

//Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
var tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete)
{
	var tween = {
		object:object,
		property:property,
		propertyBeginValue:object[property],
		target:target,
		easing:easing,
		time:time,
		change:onchange,
		complete:oncomplete,
		start:Date.now()
	};
	
	tweening.push(tween);   
	return tween;
}
// Listen for animate update.
app.ticker.add(function(delta) {
	var now = Date.now();
	var remove = [];
	for(var i = 0; i < tweening.length; i++)
	{
		var t = tweening[i];
		var phase = Math.min(1,(now-t.start)/t.time);
		
		t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
		if(t.change) t.change(t);
		if(phase == 1)
		{
			t.object[t.property] = t.target;
			if(t.complete)
				t.complete(t);
			remove.push(t);
		}
	}
	for(var i = 0; i < remove.length; i++)
	{
		tweening.splice(tweening.indexOf(remove[i]),1);
	}
});

//Basic lerp funtion.
function lerp(a1,a2,t){
	return a1*(1-t) + a2*t;
}

//Backout function from tweenjs.
//https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
backout = function(amount) {
		return function(t) {
			return (--t*t*((amount+1)*t + amount) + 1);
		};
};



