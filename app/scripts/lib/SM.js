/*SCENES*/
var TS = require('../scenes/TestScenes');

/*Scene manager*/
function SM(hw){
	var self = this;
	var scene = this.scene = new BABYLON.Scene(hw.engine);
    scene.fogDensity = 0.5;
    var camera = this.camera = new BABYLON.ArcRotateCamera('camera1', 0, Math.PI/3, 540, BABYLON.Vector3.Zero(), scene);
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