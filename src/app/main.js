var renderer = PIXI.autoDetectRenderer(
	window.innerWidth, window.innerHeight,
	{antialiasing: false, transparent: false, resolution: 1}  
  );

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
	TilingSprite = PIXI.extras.TilingSprite;

let app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
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
background.y = window.innerHeight/1.218;
app.stage.addChild(background);

loader

	.add('images/onehealth.png')
	.add('images/onehealth_empty.png')
	.add('goblins', 'images/goblins.json')
	.add('goblinHead', 'images/goblinHead.png')
	.add('goblinGirlHead', 'images/goblinGirlHead.png')
    .on("progress", loadProgressHandler)
    .load(setup)
	.load(onAssetsLoaded);
	
function loadProgressHandler(loader, resource) {
    console.log("Loading.." + resource.url);
    console.log("Progres: " + loader.progress + "%");
}

let heroPlusButton = PIXI.Sprite.fromImage('images/addBet.png');
heroPlusButton.x = 370;
heroPlusButton.y = 150;
heroPlusButton.width = 70;
heroPlusButton.height = 70;
app.stage.addChild(heroPlusButton);
heroPlusButton.interactive = true;
heroPlusButton.buttonMode = true;
heroPlusButton.on('pointerdown', addOneHero);

const heroBetCounterLabel = new PIXI.Text('Bet',{fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
heroBetCounterLabel.x = heroPlusButton.x - 70;
heroBetCounterLabel.y = heroPlusButton.y - 5;
app.stage.addChild(heroBetCounterLabel);

let heroBetCounterNumber = new PIXI.Text(0, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
heroBetCounterNumber.x = heroBetCounterLabel.x + 20;
heroBetCounterNumber.y = heroBetCounterLabel.y + 36;
app.stage.addChild(heroBetCounterNumber);

let enemyPlusButton = PIXI.Sprite.fromImage('images/addBet.png');
enemyPlusButton.x = 1450;
enemyPlusButton.y = 150;
enemyPlusButton.width = 70;
enemyPlusButton.height = 70;
app.stage.addChild(enemyPlusButton);
enemyPlusButton.interactive = true;
enemyPlusButton.buttonMode = true;
enemyPlusButton.on('pointerdown', addOneEnemy);

const enemyBetCounterLabel = new PIXI.Text('Bet',{fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
enemyBetCounterLabel.x = enemyPlusButton.x + 90;
enemyBetCounterLabel.y = enemyPlusButton.y - 5;
app.stage.addChild(enemyBetCounterLabel);

let enemyBetCounterNumber = new PIXI.Text(0, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
enemyBetCounterNumber.x = enemyBetCounterLabel.x + 20;
enemyBetCounterNumber.y = enemyBetCounterLabel.y + 36;
app.stage.addChild(enemyBetCounterNumber);

const balance = new PIXI.Text('Balance: ',{fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});
let balanceLeft = new PIXI.Text(500, {fontFamily: 'Arial-Bold', fontSize: 36, fill: 0xffffff, align: 'center'});

let totalBets = new PIXI.Text(0);

function setup() {
	console.log("Assets loaded!");
	backgroundAudio();

    let infobar = new PIXI.Graphics();
    infobar.beginFill(0x1d1d1d);
    infobar.drawRect(0,902,4000,77);
    infobar.alpha = 0.8;
    app.stage.addChild(infobar);

    balance.anchor.set(0.5, 0.5);
    balance.position.set(140,936);
	app.stage.addChild(balance);

    balanceLeft.anchor.set(0.5, 0.5);
    balanceLeft.position.set(balance.x + 100,936);
    app.stage.addChild(balanceLeft);

    const slot = new PIXI.Graphics();
    slot.beginFill()
	slot.drawRect(window.innerWidth / 2.38, 150, 300, 180);
    slot.drawRect(window.innerWidth / 2.38, 330, 300, 180);
	slot.drawRect(window.innerWidth / 2.38, 510, 300, 180);
    slot.alpha = 0.9;
    app.stage.addChild(slot);

	const winnerSelector = new PIXI.Graphics();
	winnerSelector.lineStyle(10, 0x666dd6, 1);
	winnerSelector.moveTo(20,200);
	winnerSelector.lineTo(20,240);
	winnerSelector.lineTo(80,220);
	winnerSelector.lineTo(20,200);
	winnerSelector.x = window.innerWidth / 2.55;
	winnerSelector.y = 170;
	
	app.stage.addChild(winnerSelector);

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
	function backgroundAudio () {
		var audio_bg = document.getElementById("audio_bg");
		audio_bg.play();
		audio_bg.loop = true;
		if(audio_roll.play) {
			audio_bg.paused = true;
		}
	}
}

function addOneHero () {
	console.log("it is true");
	heroBetCounterNumber.text++;
	totalBets.text++;
	console.log(totalBets.text);
	balanceLeft.text--;
	if(balanceLeft.text <0) {
		alert("You are out of cash!");
		balanceLeft.text++;
		totalBets.text --;
		heroBetCounterNumber.text--;
		console.log(totalBets.text);
	}
	var audio_bet = document.getElementById("audio_bet");
	if (audio_bet.paused) {
		audio_bet.play();        
	} else {
		audio_bet.currentTime = 0;
	}
}

function addOneEnemy () {
	console.log("it is true");
	enemyBetCounterNumber.text++;
	totalBets.text++;
	console.log(totalBets.text);
	balanceLeft.text--;
	if(balanceLeft.text <0) {
		alert("You are out of cash!");
		balanceLeft.text++;
		totalBets.text --;
		enemyBetCounterNumber.text--;
	}
	var audio_bet = document.getElementById("audio_bet");
	if (audio_bet.paused) {
		audio_bet.play();        
	} else {
		audio_bet.currentTime = 0;
	}
	}    
var REEL_WIDTH = 300;
var SYMBOL_SIZE = 150;

//onAssetsLoaded handler builds the example.
function onAssetsLoaded(loader, res)
{
	//Adding new variable to bring in goblin Spine animation
	var goblin = new PIXI.spine.Spine(res.goblins.spineData);

	goblin.skeleton.setSkinByName('goblin');
	goblin.skeleton.setSlotsToSetupPose();

	goblin.x = 350;
	goblin.y = 860;

	goblin.scale.set(1.8);
	goblin.state.setAnimation(0, 'walk', true);
	app.stage.addChild(goblin);

	//Adding new variable to bring in goblinGirl Spine animation
	var goblinGirl = new PIXI.spine.Spine(res.goblins.spineData);

	goblinGirl.skeleton.setSkinByName('goblingirl');
	goblinGirl.skeleton.setSlotsToSetupPose();

	goblinGirl.scale.x = -1.8;
	goblinGirl.scale.y = 1.8;
	goblinGirl.x = 1550;
	goblinGirl.y = 860;

	goblinGirl.state.setAnimation(0, 'walk', true);
	app.stage.addChild(goblinGirl);

	//Create different slot symbols.
	var slotTextures = [
		PIXI.Texture.fromImage('goblinHead', 'images/goblinHead.png'),
		PIXI.Texture.fromImage('goblinGirlHead', 'images/goblinGirlHead.png')
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
	
	//Build "CLICK TO SPIN" button and position reelContainer(Slot symbols)
	var margin = (app.screen.height - SYMBOL_SIZE*3)/5;
	reelContainer.y = 500;
	reelContainer.x = Math.round(app.screen.width / 2.18);
    var bottom = new PIXI.Graphics();
    bottom.x = 750;
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
	
	function slotRoll(){
		var audio_roll = document.getElementById("audio_roll");
		if(audio_roll.paused) {
			audio_roll.play();
			audio_roll.volume = 0.4;
		} else {
			audio_roll.currentTime = 0;
		}
	}

	//Function to start playing.
	function startPlay(){
		if(running) return;
		running = true;
		slotRoll();
		removeBets();
		
		for(var i = 0; i < reels.length; i++){
			var r = reels[i];
			var extra = Math.floor(Math.random()*4);
			tweenTo(r, "position", r.position + 10+i*10+extra, 2500+i*600+extra*600, backout(0.6), null, i == reels.length-1 ? reelsComplete : null);
		}
	}

	function removeBets() {
		if(running) {
			heroBetCounterNumber.text = 0;
			enemyBetCounterNumber.text = 0;
			console.log('Total ammount betted ' + totalBets.text);
		}
	}
	
	//Reels done handler.
	function reelsComplete(){
		let centerSymbol = reels[0].symbols[1];
		console.log(centerSymbol.texture.textureCacheIds);
		running = false;
		balanceUpdate();
		totalBets.text = 0;
	}

	function balanceUpdate() {
		if(heroBetCounterNumber.text > 0 && centerSymbol.texture.textureCacheIds[0] === "goblinHead", "images/goblinHead.png") {
			console.log("It should work..");
			balanceLeft.text = Number(balanceLeft.text) + Number(((totalBets.text-heroBetCounterNumber.text)*2)); 
		} else if (enemyBetCounterNumber.text > 0 && centerSymbol.texture.textureCacheIds[0] === "goblinGirlHead", "images/goblinGirlHead.png") {
			console.log("It should work..");
			balanceLeft.text = Number(balanceLeft.text) + Number(((totalBets.text-enemyBetCounterNumber.text)*2)); 
		}
	}
	
	// Listen for animate update.
	app.ticker.add(function(delta) {
		//Update the slots.
		for( var i = 0; i < reels.length; i++)
		{
			var r = reels[i];
			//Update blur filter y amount based on speed.
			r.blur.blurY = (r.position-r.previousPosition)*50;
			r.previousPosition = r.position;
			
			//Update symbol positions on reel.
			for( var j = 0; j < r.symbols.length; j++)
			{
				var s = r.symbols[j];
				var prevy = s.y;
				s.y = (r.position + j)%r.symbols.length*SYMBOL_SIZE-SYMBOL_SIZE*2;
				if(s.y < 0 && prevy > SYMBOL_SIZE){
					//Detect going over and swap a texture. 
					s.texture = slotTextures[Math.floor(Math.random()*slotTextures.length)];
					s.scale.x = s.scale.y = Math.min( SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE/s.texture.height)*6;
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
	return a1*(10-t) + a2*t;
}

//Backout function from tweenjs.
//https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
backout = function(amount) {
		return function(t) {
			return (--t*t*((amount+1)*t + amount) + 1);
		};
};