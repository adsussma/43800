var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

buttonList = [];
wireList = [];
var projector, mouse = {x: 0, y: 0};

var tries = 1;
var timeLimit = 30;
var sequenceLength = 12;
var sequence = createSequence();

init();
animate();
			
function init(){
	scene = new THREE.Scene();
	
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,0,250);
	camera.lookAt(scene.position);	
	
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer({antialias:true});
	else
		renderer = new THREE.CanvasRenderer(); 

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	THREEx.WindowResize(renderer, camera);
	
	var light = new THREE.PointLight(0xffffff);
	light.position.set(-100,200,100);
	scene.add(light);
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	var axes = new THREE.AxisHelper(100);
	scene.add( axes );
	
	//Create and set floor
	/*
	var floorTexture = new THREE.ImageUtils.loadTexture('floor.png');
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set(10, 10);
	var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	*/
	
	var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
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
	clock_x = 0
	clock_y = 57
	clock_z = 3
	
	//Button locations
	button_left = -30;
	button_middle = 0;
	button_right = 30;
	button_z = 5;
	button_top = 30;
	button_upper = 0;
	button_lower = -30;
	button_bottom = -60;
	
	//Base attributes
	var baseGeometry = new THREE.CubeGeometry(100, 150, 15);
	var baseMaterial = new THREE.MeshBasicMaterial({color: 0x404040});
	
	//Wire slot attributes
	var backGeometryOne = new THREE.CubeGeometry(10, 140, 15);
	var backGeometryTwo = new THREE.CubeGeometry(70, 40, 15);
	var backMaterial = new THREE.MeshBasicMaterial({color: 0x808080});
	
	//Clock attributes
	var clockGeometry = new THREE.CubeGeometry(90, 25, 10);
	var clockMaterial = new THREE.MeshBasicMaterial({color:0x808080});
	
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
	var buttonOneMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonTwoMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonThreeMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonFourMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonFiveMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonSixMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonSevenMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonEightMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonNineMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonAsteriskMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonZeroMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	var buttonHashMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	
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

	//Create Clock face
	clock = new THREE.Mesh(clockGeometry, clockMaterial);
	clock.position.x = clock_x;
	clock.position.y = clock_y;
	clock.position.z = clock_z;
	base.add(clock);

	//Create Wires
	wireOne = new THREE.Mesh(wireGeometry, wireOneMaterial);
	wireOne.position.x = -15;
	wireOne.position.y = 15;
	wireOne.position.z = -10;
	wireOne.name = "Red wire";
	base.add(wireOne);
	wireTwo = new THREE.Mesh(wireGeometry, wireTwoMaterial);
	wireTwo.position.x = -15;
	wireTwo.position.y = 0;
	wireTwo.position.z = -10;
	wireTwo.name = "Green wire";
	base.add(wireTwo);
	wireThree = new THREE.Mesh(wireGeometry, wireThreeMaterial);
	wireThree.position.x = -15;
	wireThree.position.y = -15;
	wireThree.position.z = -10
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
	saveSequence(seq);
	console.log(seq);

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
function createSequence(){
    var actions = ['12', '13', '14', '15', '16', '17', '18', 
					'19', '20', '21', '22', '23', '24', '25', '26',];
					
	var seq = new Array;
	
	for(i = 0; i <= sequenceLength; i++){
		index = Math.floor(Math.random() * actions.length)
		seq.push(actions[index]);
		actions.splice(index, 1);
	}

	return seq;
}

//Returns true if the sequence length is 0. False otherwise.
function isFinished(){
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
			var color = 0xcccccc;
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
				var color = 0x5cd65c;
				//Set the color of the button green.
				buttonIntersects[0].object.material.color.setHex(color);
				//Simulate the button being clicked by changing the z position.
				buttonIntersects[0].object.position.z = 3;
				//Pop the first element in the sequence array off.
				sequence.shift();
			}
			//If the button that is clicked does not have the same id as the first element in the sequence array
			else{
				var color = 0xff3333;
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

//Saves the sequence as a cookie. Could be used to have the defusal code displayed on a different page.
function saveSequence(string){
	document.cookie = "sequence=" + string;
	console.log(document.cookie);
}

function animate(){
    requestAnimationFrame(animate);
	render();		
	update();
}

function update(){
	controls.update();
	if(isFinished()){
		console.log("You win!");
	}
}

function render(){
	renderer.render(scene, camera);
}
