//Global Variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

buttonList = [];
wireList = [];
var projector, mouse = {x: 0, y: 0};

var tries = 1;
var timeLimit = 28.5;
var sequenceLength = 9;

var x = 3000;
var texture; 

var messageArray = [];
var alphabetArray = shuffleAlphabet();
var sequence = createSequence(sequenceLength);

var timeContainer = document.getElementById("time");
var textContainer = document.getElementById("key");
var codeContainer = document.getElementById("seq");
var encodeText;
var message = "";


init();
animate();
			
function init(){
	scene = new THREE.Scene();
	
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,0,250);
	camera.lookAt(scene.position);
	
	if (Detector.webgl)
		renderer = new THREE.WebGLRenderer({antialias:true});
	else
		renderer = new THREE.CanvasRenderer(); 

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById('ThreeJS');
	container.appendChild(renderer.domElement);
	THREEx.WindowResize(renderer, camera);
	
	var light = new THREE.PointLight(0xffffff);
	light.position.set(-100,200,100);
	scene.add(light);
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	var axes = new THREE.AxisHelper(100);
	scene.add(axes);
	
	var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyboxMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide});
	var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	scene.add(skybox);
	
	//Base locations
	base_x = 0
	base_y = 0
	base_z = 0
	
	//Wire slot locations
	back_left = -35
	back_right = 35
	back_top = 50
	back_bottom = -50
	back_z = -10
	
	//Clock locations
	timer_x = 21
	timer_y = 60
	timer_z = 3
	
	//Wire locations
	wire_x = -15;
	wire_z = -10;
	
	//Button locations
	button_left = -30;
	button_middle = 0;
	button_right = 30;
	button_z = 5;
	button_top = 35;
	button_upper = 5;
	button_lower = -25;
	button_bottom = -55;
	
	font = "Bold 100px Arial";
	font_color = "rgb(0, 0, 0, 0.6)";
	button_color = "#fff2e6"
	
	//Base attributes
	var baseGeometry = new THREE.CubeGeometry(100, 150, 15);
	var baseMaterial = new THREE.MeshBasicMaterial({color: 0xa6a6a6});

	//clock
	var timerGeometry = new THREE.CubeGeometry(40, 20, 10);
	texture = new THREE.Texture(changeCanvas());
    var materials = [];
    var timerMaterial = new THREE.MeshBasicMaterial( { map: texture } );
    for ( var i = 0; i < 6; i ++ ) {
         materials.push( timerMaterial );
    }

	
	//Wire slot attributes
	var backGeometryOne = new THREE.CubeGeometry(10, 140, 15);
	var backGeometryTwo = new THREE.CubeGeometry(70, 40, 15);
	var backMaterial = new THREE.MeshBasicMaterial({color: 0x8c8c8c});
	
	var beepOneGeometry = new THREE.CylinderGeometry(7, 7, 10, 32);
	var beepOneMaterial = new THREE.MeshBasicMaterial({color: 0x8c8c8c});
	var beepTwoGeometry = new THREE.CylinderGeometry(7, 7, 10, 32);
	var beepTwoMaterial = new THREE.MeshBasicMaterial({color: 0x8c8c8c});
	
	//Wire attributes
	CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
	CustomSinCurve.prototype.constructor = CustomSinCurve;

	CustomSinCurve.prototype.getPoint = function(t){
		var tx = t * 5 - 1.5;
		var ty = Math.sin(2 * Math.PI * t);
		var tz = 0;

		return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
	};
	
	var wirePath = new CustomSinCurve(14);
	var wireGeometry = new THREE.TubeGeometry(wirePath, 10, 3, 10, false);
	var wireOneMaterial = new THREE.MeshBasicMaterial({color:0xff3333});
	var wireTwoMaterial = new THREE.MeshBasicMaterial({color:0x5cd65c});
	var wireThreeMaterial = new THREE.MeshBasicMaterial({color:0x4d94ff});

	//Button attributes
	var buttonGeometry = new THREE.CubeGeometry(22, 22, 10);
	var buttonOneCanvas = document.createElement('canvas');
	var buttonOneContext = buttonOneCanvas.getContext('2d');
	buttonOneContext.font = font;
	buttonOneContext.fillStyle = button_color ;
	buttonOneContext.fillRect(0, 0, 600, 600);
	buttonOneContext.fillStyle = font_color;
    buttonOneContext.fillText('1', 125, 110);
	var buttonOneTexture = new THREE.Texture(buttonOneCanvas);
	buttonOneTexture.needsUpdate = true;
	var buttonOneMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonOneTexture});
	
	var buttonTwoCanvas = document.createElement('canvas');
	var buttonTwoContext = buttonTwoCanvas.getContext('2d');
	buttonTwoContext.font = font;
	buttonTwoContext.fillStyle = button_color ;
	buttonTwoContext.fillRect(0, 0, 600, 600);
	buttonTwoContext.fillStyle = font_color;
	buttonTwoContext.fillText('2', 125, 110);
	var buttonTwoTexture = new THREE.Texture(buttonTwoCanvas);
	buttonTwoTexture.needsUpdate = true;
	var buttonTwoMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonTwoTexture});
	
	var buttonThreeCanvas = document.createElement('canvas');
	var buttonThreeContext = buttonThreeCanvas.getContext('2d');
	buttonThreeContext.font = font;
	buttonThreeContext.fillStyle = button_color ;
	buttonThreeContext.fillRect(0, 0, 600, 600);
	buttonThreeContext.fillStyle = font_color;
	buttonThreeContext.fillText('3', 125, 110);
	var buttonThreeTexture = new THREE.Texture(buttonThreeCanvas);
	buttonThreeTexture.needsUpdate = true;
	var buttonThreeMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonThreeTexture});
	
	var buttonFourCanvas = document.createElement('canvas');
	var buttonFourContext = buttonFourCanvas.getContext('2d');
	buttonFourContext.font = font;
	buttonFourContext.fillStyle = button_color ;
	buttonFourContext.fillRect(0, 0, 600, 600);
	buttonFourContext.fillStyle = font_color;
	buttonFourContext.fillText('4', 125, 110);
	var buttonFourTexture = new THREE.Texture(buttonFourCanvas);
	buttonFourTexture.needsUpdate = true;
	var buttonFourMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonFourTexture});
	
	var buttonFiveCanvas = document.createElement('canvas');
	var buttonFiveContext = buttonFiveCanvas.getContext('2d');
	buttonFiveContext.font = font;
	buttonFiveContext.fillStyle = button_color ;
	buttonFiveContext.fillRect(0, 0, 600, 600);
	buttonFiveContext.fillStyle = font_color;
	buttonFiveContext.fillText('5', 125, 110);
	var buttonFiveTexture = new THREE.Texture(buttonFiveCanvas);
	buttonFiveTexture.needsUpdate = true;
	var buttonFiveMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonFiveTexture});
	
	var buttonSixCanvas = document.createElement('canvas');
	var buttonSixContext = buttonSixCanvas.getContext('2d');
	buttonSixContext.font = font;
	buttonSixContext.fillStyle = button_color ;
	buttonSixContext.fillRect(0, 0, 600, 600);
	buttonSixContext.fillStyle = font_color;
	buttonSixContext.fillText('6', 125, 110);
	var buttonSixTexture = new THREE.Texture(buttonSixCanvas);
	buttonSixTexture.needsUpdate = true;
	var buttonSixMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonSixTexture});
	
	var buttonSevenCanvas = document.createElement('canvas');
	var buttonSevenContext = buttonSevenCanvas.getContext('2d');
	buttonSevenContext.font = font;
	buttonSevenContext.fillStyle = button_color ;
	buttonSevenContext.fillRect(0, 0, 600, 600);
	buttonSevenContext.fillStyle = font_color;
	buttonSevenContext.fillText('7', 125, 110);
	var buttonSevenTexture = new THREE.Texture(buttonSevenCanvas);
	buttonSevenTexture.needsUpdate = true;
	var buttonSevenMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonSevenTexture});
	
	var buttonEightCanvas = document.createElement('canvas');
	var buttonEightContext = buttonEightCanvas.getContext('2d');
	buttonEightContext.font = font;
	buttonEightContext.fillStyle = button_color ;
	buttonEightContext.fillRect(0, 0, 600, 600);
	buttonEightContext.fillStyle = font_color;
	buttonEightContext.fillText('8', 125, 110);
	var buttonEightTexture = new THREE.Texture(buttonEightCanvas);
	buttonEightTexture.needsUpdate = true;
	var buttonEightMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonEightTexture});
	
	var buttonNineCanvas = document.createElement('canvas');
	var buttonNineContext = buttonNineCanvas.getContext('2d');
	buttonNineContext.font = font;
	buttonNineContext.fillStyle = button_color ;
	buttonNineContext.fillRect(0, 0, 600, 600);
	buttonNineContext.fillStyle = font_color;
	buttonNineContext.fillText('9', 125, 110);
	var buttonNineTexture = new THREE.Texture(buttonNineCanvas);
	buttonNineTexture.needsUpdate = true;
	var buttonNineMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonNineTexture});
	
	var buttonAsteriskCanvas = document.createElement('canvas');
	var buttonAsteriskContext = buttonAsteriskCanvas.getContext('2d');
	buttonAsteriskContext.font = font;
	buttonAsteriskContext.fillStyle = button_color ;
	buttonAsteriskContext.fillRect(0, 0, 600, 600);
	buttonAsteriskContext.fillStyle = font_color;
	buttonAsteriskContext.fillText('*', 125, 110);
	var buttonAsteriskTexture = new THREE.Texture(buttonAsteriskCanvas);
	buttonAsteriskTexture.needsUpdate = true;
	var buttonAsteriskMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonAsteriskTexture});
	
	var buttonZeroCanvas = document.createElement('canvas');
	var buttonZeroContext = buttonZeroCanvas.getContext('2d');
	buttonZeroContext.font = font;
	buttonZeroContext.fillStyle = button_color ;
	buttonZeroContext.fillRect(0, 0, 600, 600);
	buttonZeroContext.fillStyle = font_color;
	buttonZeroContext.fillText('0', 125, 110);
	var buttonZeroTexture = new THREE.Texture(buttonZeroCanvas);
	buttonZeroTexture.needsUpdate = true;
	var buttonZeroMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonZeroTexture});
	
	var buttonHashCanvas = document.createElement('canvas');
	var buttonHashContext = buttonHashCanvas.getContext('2d');
	buttonHashContext.font = font;
	buttonHashContext.fillStyle = button_color ;
	buttonHashContext.fillRect(0, 0, 600, 600);
	buttonHashContext.fillStyle = font_color;
	buttonHashContext.fillText('#', 125, 110);
	var buttonHashTexture = new THREE.Texture(buttonHashCanvas);
	buttonHashTexture.needsUpdate = true;
	var buttonHashMaterial = new THREE.MeshBasicMaterial({color: 0xffffe6, map:buttonHashTexture});
	
	//Create Base
    base = new THREE.Mesh(baseGeometry, baseMaterial);
	base.position.x = base_x;
	base.position.y = base_y;
	base.position.z = base_z;
	base.name = "Base";
	scene.add(base);
	
	//Create back slot
	backOne = new THREE.Mesh(backGeometryOne, backMaterial);
	backOne.position.x = back_left;
	backOne.position.y = 0;
	backOne.position.z = back_z;
	base.add(backOne);
	backTwo = new THREE.Mesh(backGeometryOne, backMaterial);
	backTwo.position.x = back_right;
	backTwo.position.y = 0;
	backTwo.position.z = back_z;
	base.add(backTwo);
	backThree = new THREE.Mesh(backGeometryTwo, backMaterial);
	backThree.position.x = 0;
	backThree.position.y = back_top;
	backThree.position.z = back_z;
	base.add(backThree);
	backFour = new THREE.Mesh(backGeometryTwo, backMaterial);
	backFour.position.x = 0;
	backFour.position.y = back_bottom;
	backFour.position.z = back_z;
	base.add(backFour);

	//Create Wires
	wireOne = new THREE.Mesh(wireGeometry, wireOneMaterial);
	wireOne.position.x = wire_x;
	wireOne.position.y = 15;
	wireOne.position.z = wire_z;
	wireOne.name = "Red wire";
	base.add(wireOne);
	wireTwo = new THREE.Mesh(wireGeometry, wireTwoMaterial);
	wireTwo.position.x = wire_x;
	wireTwo.position.y = 0;
	wireTwo.position.z = wire_z;
	wireTwo.name = "Green wire";
	base.add(wireTwo);
	wireThree = new THREE.Mesh(wireGeometry, wireThreeMaterial);
	wireThree.position.x = wire_x;
	wireThree.position.y = -15;
	wireThree.position.z = wire_z;
	wireThree.name = "Blue wire";
	base.add(wireThree);

	//Create Buttons
    buttonOne = new THREE.Mesh(buttonGeometry, buttonOneMaterial);	
	buttonOne.position.x = button_left;
	buttonOne.position.y = button_top;
	buttonOne.position.z = button_z;
	buttonOne.name = "One";
	base.add(buttonOne);
	buttonTwo = new THREE.Mesh(buttonGeometry, buttonTwoMaterial);	
	buttonTwo.position.x = button_middle;
	buttonTwo.position.y = button_top;
	buttonTwo.position.z = button_z;
	buttonTwo.name = "Two";
	base.add(buttonTwo);
	buttonThree = new THREE.Mesh(buttonGeometry, buttonThreeMaterial);
	buttonThree.position.x = button_right;
	buttonThree.position.y = button_top;
	buttonThree.position.z = button_z;
	buttonThree.name = "Three";
	base.add(buttonThree);
	buttonFour = new THREE.Mesh(buttonGeometry, buttonFourMaterial);
	buttonFour.position.x = button_left;
	buttonFour.position.y = button_upper;
	buttonFour.position.z = button_z;
	buttonFour.name = "Four";
	base.add(buttonFour)
	buttonFive = new THREE.Mesh(buttonGeometry, buttonFiveMaterial);
	buttonFive.position.x = button_middle;
	buttonFive.position.y = button_upper;
	buttonFive.position.z = button_z;
	buttonFive.name = "Five";
	base.add(buttonFive);
	buttonSix = new THREE.Mesh(buttonGeometry, buttonSixMaterial);
	buttonSix.position.x = button_right;
	buttonSix.position.y = button_upper;
	buttonSix.position.z = button_z;
	buttonSix.name = "Six";
	base.add(buttonSix);
	buttonSeven = new THREE.Mesh(buttonGeometry, buttonSevenMaterial);
	buttonSeven.position.x = button_left;
	buttonSeven.position.y = button_lower;
	buttonSeven.position.z = button_z;
	buttonSeven.name = "Seven";
	base.add(buttonSeven);
	buttonEight = new THREE.Mesh(buttonGeometry, buttonEightMaterial);	
	buttonEight.position.x = button_middle;
	buttonEight.position.y = button_lower;
	buttonEight.position.z = button_z;
	buttonEight.name = "Eight";
	base.add(buttonEight);
	buttonNine = new THREE.Mesh(buttonGeometry, buttonNineMaterial);	
	buttonNine.position.x = button_right;
	buttonNine.position.y = button_lower;
	buttonNine.position.z = button_z;
	buttonNine.name = "Nine";
	base.add(buttonNine);
	buttonAsterisk = new THREE.Mesh(buttonGeometry, buttonAsteriskMaterial);
	buttonAsterisk.position.x = button_left;
	buttonAsterisk.position.y = button_bottom;
	buttonAsterisk.position.z = button_z;
	buttonAsterisk.name = "Asterisk";
	base.add(buttonAsterisk);
	buttonZero = new THREE.Mesh(buttonGeometry, buttonZeroMaterial);
	buttonZero.position.x = button_middle;
	buttonZero.position.y = button_bottom;
	buttonZero.position.z = button_z;	
	buttonZero.name = "Zero";
	base.add(buttonZero);
	buttonHash = new THREE.Mesh(buttonGeometry, buttonHashMaterial);
	buttonHash.position.x = button_right;
	buttonHash.position.y = button_bottom;
	buttonHash.position.z = button_z;
	buttonHash.name = "Hashtag";
	base.add(buttonHash);
	
	//Create Timer
	timer = new THREE.Mesh(timerGeometry, timerMaterial);
	timer.position.x = timer_x;
	timer.position.y = timer_y;
	timer.position.z = timer_z;
	timer.name = "Timer";
	scene.add(timer);
	
	beeperOne = new THREE.Mesh(beepOneGeometry, beepOneMaterial);
	beeperOne.position.x = -15;
	beeperOne.position.y = 60;
	beeperOne.position.z = 5;
	beeperOne.rotation.x = Math.PI / 2;
	base.add(beeperOne);
	
	beeperTwo = new THREE.Mesh(beepTwoGeometry, beepTwoMaterial);
	beeperTwo.position.x = -35;
	beeperTwo.position.y = 60;
	beeperTwo.position.z = 5;
	beeperTwo.rotation.x = Math.PI / 2;
	base.add(beeperTwo);

	// List of all buttons. Used to find which button is clicked
	buttonList.push(buttonOne);
	buttonList.push(buttonTwo);
	buttonList.push(buttonThree);
	buttonList.push(buttonFour);
	buttonList.push(buttonFive);
	buttonList.push(buttonSix);
	buttonList.push(buttonSeven);
	buttonList.push(buttonEight);
	buttonList.push(buttonNine);
	buttonList.push(buttonAsterisk);
	buttonList.push(buttonZero);
	buttonList.push(buttonHash);
	
	// List of all wires. Used to find which wire is clicked
	wireList.push(wireOne);
	wireList.push(wireTwo);
	wireList.push(wireThree);
	
	seq = getObjectNames(base, sequence);
	encodeText = match(seq,base);
	
	startTimer(timeLimit, base);
	textContainer.innerHTML = encodeText;
	codeContainer.innerHTML = message;
	
	projector = new THREE.Projector();
	
	//Event Listeners look for special event i.e. mousedown or mouseup
	document.addEventListener('mousedown', onClick, false);
	document.addEventListener('mouseup', resetButton, false);
	
}

//Creates 3D model in shape of sin curve
function CustomSinCurve(scale){
	THREE.Curve.call(this);
	this.scale = (scale === undefined) ? 1 : scale;

}

//Creates defusal sequence of Object IDs, returns the sequence
function createSequence(len){
    var actions = ['11', '12', '13', '14', '15', '16', '17', 
					'18', '19', '20', '21', '22', '23', '24', '25',];
					
	var seq = new Array;
	
	for(i = 0; i <= len; i++){
		index = Math.floor(Math.random() * actions.length)
		seq.push(actions[index]);
		actions.splice(index, 1);
	}

	return seq;
}

function startTimer(duration, scene) {
    var timer = duration, minutes, seconds;
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

		if (seconds % 2 === 0){
			beeperOne.material.color.setHex(0xff9999);
		}
		else {
			beeperOne.material.color.setHex(0x8c8c8c);
		}
		
        timeContainer.innerHTML = minutes + ":" + seconds;
		console.log(seconds);
		
		if(isDefused()){
			beeperOne.material.color.setHex(0x8c8c8c);
		}
		else{
			if (--timer < 0) {
				beeperOne.material.color.setHex(0xff9999);
				codeContainer.innerHTML = "YOU LOSE!";
				sequence = ['BOOM'];
				clearInterval(interval);
			}
			if(tries == 0){
				x = 0;
				beeperOne.material.color.setHex(0xff9999);
				codeContainer.innerHTML = "YOU LOSE!";
				sequence = ['BOOM'];
				clearInterval(interval);
			}
        }
    }, 1000);
}

function match(names,scene){
	var used = names;
	var encText ="";
	
	var index;
	var placment;
	for(i = 0; i <= sequenceLength; i ++){
		index = Math.floor(Math.random() * used.length);
		
		encText +=  alphabetArray[i] + " = " + used[index] + "<br/> ";
		
		for(f in sequence){
			if(((scene.getObjectById(parseInt(sequence[f]))).name).toString() == used[index]){
				placement = f;
			}
		}
		messageArray[placement] = alphabetArray[i];
		used.splice(index,1);
		
	}
	message = "";
	for(i = 0; i < messageArray.length; i++){
		message += " " + messageArray[i];
	}

	return encText;
}

//Returns true if the sequence length is 0. False otherwise.
function isDefused(){
	if(sequence.length == 0){
		return true 
	}
	else{
		return false
	}
}

//Resets button to original color and z position.
function resetButton(event){
	for(i = 0; i <= buttonList.length; i++){
		try{
			var color = 0xffffe6;
			buttonList[i].material.color.setHex(color);
			buttonList[i].position.z = 5;
		}
		catch(TypeError){}
	}
}

//Resets wires by adding them back to the scene.
function resetWires(){
	base.add(wireOne);
	base.add(wireTwo);
	base.add(wireThree);
}


function onClick(event){
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
	projector.unprojectVector(vector, camera);
	
	var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	var buttonIntersects = ray.intersectObjects(buttonList);
	var wireIntersects = ray.intersectObjects(wireList);
	
	//If camera position in the z axis is positive, only register button clicks.
	if(camera.position.z > 0){	
		if (buttonIntersects.length > 0){
			console.log('clicked: ' + buttonIntersects[0].object.id);
			
			//If the button that is clicked has the same id as the first element in the sequence array
			if(sequence[0] == buttonIntersects[0].object.id){
				var color = 0x98e698;
				//Set the color of the button green.
				buttonIntersects[0].object.material.color.setHex(color);
				//Simulate the button being clicked by changing the z position.
				buttonIntersects[0].object.position.z = 3;
				//Pop the first element in the sequence array off.
				sequence.shift();
			}
			//If the button that is clicked does not have the same id as the first element in the sequence array
			else{
				tries -= 1;
				var color = 0xff9999;
				//Set the color of the button to red.
				buttonIntersects[0].object.material.color.setHex(color);
				//Simulate the button being clicked by changing the z position.
				buttonIntersects[0].object.position.z = 3;
			}
		}
	}
	else{
		//If camera position in the z axis is negative, only register wire clicks.
		if (wireIntersects.length > 0){
			console.log('clicked: ' + wireIntersects[0].object.id);
			
			var child = base.getObjectById(wireIntersects[0].object.id);
			
			if(sequence[0] == wireIntersects[0].object.id){
				//Remove the clicked wire from the scene.
				base.remove(child);
				//Pop the current element in the sequence array off.
				sequence.shift();
			}
		}
	}
	
	seq = getObjectNames(base, sequence);
	console.log(seq);

}

//Returns the name of the object based on the scene and ids passed in.
function getObjectNames(scene, array){
	var seq = new Array;
	
	for(i in array){
		try{
			var object = scene.getObjectById(parseInt(array[i]));
			var name = object.name;
			seq.push(name.toString());
		}
		catch(TypeError){}
	}
	return seq;
}

function shuffleAlphabet() {
	var alphabetArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var currentIndex = alphabetArray.length
	var temp
	var Index;

	while (currentIndex !== 0) {
		Index = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temp = alphabetArray[currentIndex];
		alphabetArray[currentIndex] = alphabetArray[Index];
		alphabetArray[Index] = temp;
	}

  return alphabetArray;
}

function animate(){
    requestAnimationFrame(animate);
	render();		
	update();
}

function update(){
	controls.update();
	if(isDefused()){
		x = 0;
		beeperTwo.material.color.setHex(0x98e698);
		codeContainer.innerHTML = "YOU WIN!";
	}
}

function render(){
	changeCanvas();
 	texture.needsUpdate = true;
	renderer.render(scene, camera);
}

function changeCanvas() {
	if (x<=0){
		x = 0;
	}
	else{
		x = (x-1.675);
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext("2d");
		context.clearRect(0,0,600,600);
		context.font = "Bold 60px Orbitron";
		context.shadowBlur = "7";
		context.fillStyle = "#262626";
		context.fillRect(0, 0, 600, 600);
		context.fillStyle = "red";
		if(parseInt(x/100).toString().length == 1){
			context.fillText(("00:0" + parseInt(x/100)), 40, 100);
		}
		else{
			context.fillText(("00:" + parseInt(x/100)), 40, 100);
		}
	
		return canvas;
	}
}