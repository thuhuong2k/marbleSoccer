// declare a bunch of variable we will need later
var startTime	= Date.now();
var container;
var keyboard, devOrientation, world;
var microphysics;
var camera, scene, renderer, stats;
var skyboxMesh;


Marble.PageGameRound	= function()
{
	// bootstrap functions
	if ( ! Detector.webgl ){
		// test if webgl is supported
		Detector.addGetWebGLMessage();
	}else{
		// initialiaze everything
		this._init();	
		this._animate();
	}
}
Marble.PageGameRound.prototype.destroy	= function()
{
	
}

Marble.PageGameRound.prototype._init	= function(){
	// create the container element
	container = document.getElementById( 'canvasContainer' );

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer({
		antialias		: true,
		preserveDrawingBuffer	: true 
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	
	keyboard	= new THREEx.KeyboardState();
	devOrientation	= new THREEx.DeviceOrientationState();
	// create the renderer cache
	renderer._microCache	= new MicroCache();

	// init the Stats and append it to the Dom - performance vuemeter
	stats	= new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom	= '0px';
	container.appendChild( stats.domElement );

	// create the Scene
	scene = new THREE.Scene();

	var ambient	= new THREE.AmbientLight( 0xFFFFFF );
	scene.addLight( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.addLight( directionalLight );
	
	var mesh	= new THREE.Mesh( new THREE.SphereGeometry(75,16,8), new THREE.MeshNormalMaterial() );
	scene.addObject(mesh);	
	
	// init THREEx.Microphysics
	microphysics	= new THREEx.Microphysics().start();

	world		= new Marble.World({
		scene	: scene
	});

	THREEx.WindowResize(renderer, world.camera().object());
}

// ## Animate and Display the Scene
Marble.PageGameRound.prototype._animate	= function(){
	// render the 3D scene
	this._render();
	// relaunch the 'timer' 
	requestAnimationFrame( this._animate.bind(this) );
	// update the stats
	stats.update();
}

// ## Render the 3D Scene
Marble.PageGameRound.prototype._render = function(){
	// update THREEx.Microphysics
	microphysics.update(scene);

	// world .tick()
	world.tick();
	
	// actually display the scene in the Dom element
	renderer.render( scene, world.camera().object() );
}