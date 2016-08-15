/*SCENES*/
var TS = require('../scenes/TestScenes');
var AM = require('./AM');
/*Scene manager*/
function SM(hw){
	var self = this;
    this.am = new AM();
	var scene = this.scene = new BABYLON.Scene(hw.engine);
    scene.fogDensity = 0.5;
    var camera = this.camera = new BABYLON.ArcRotateCamera('camera1', 0, Math.PI/3, 540, BABYLON.Vector3.Zero(), scene);
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, -15), scene);
    // target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // attach the camera to the canvas
    camera.attachControl(hw.canvas, false);
    this.getScene = function () {
    	return scene;
    }
    this.getCamera = function () {
    	return camera;
    }
    this.load = function (scene_name, args, cb) {/*TST1'*/
    	if(TS[scene_name]){
    		return TS[scene_name](scene, args, cb);
    	}else{
            console.error('Cant load the scene ' + scene_name );
        }
    }
    this.enablePhysics = function () {
        this.meshesColliderList = [];
        var scene = this.scene;
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());
        for (var i = 1; i < scene.meshes.length; i++) {
            if (scene.meshes[i].checkCollisions && scene.meshes[i].isVisible === false) {
                scene.meshes[i].setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, 
                                                friction: 0.5, restitution: 0.7 });
                this.meshesColliderList.push(scene.meshes[i]);
            }
        }
    }

    var camerasBorderFunction = function () {
        //Angle
        if (camera.beta < 0.1)
            camera.beta = 0.1;
        else if (camera.beta > (Math.PI / 2) * 0.9)
            camera.beta = (Math.PI / 2) * 0.9;

  //Zoom
        if (camera.radius > 540*2)
            camera.radius = 540*2;

        if (camera.radius < 50)
            camera.radius = 50;
    };

    scene.registerBeforeRender(camerasBorderFunction);
   
}

module.exports = SM;