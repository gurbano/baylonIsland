var HW = require('./lib/HW'); //hw, camera, canvas
var SM = require('./lib/SM'); //scene manager


function App(div) {
	var self = this;
	var hw = this.hw = new HW(div);
	var sm = this.sm = new SM(hw);


	sm.load('AUDIO', sm);
	sm.load('TST1');
	sm.load('TERR1',{}, function (m) {
		var s = sm.load('SKYBOX1');
		sm.load('OBJ1', {}, function (mesh) {
			var ground = m['ground'];
			var trees = sm.load('TREE2', {ground: m['ground'], treeMesh: mesh});
			var w = sm.load('WATER1', [s,m,trees]); 
			var x = 0;
			var camera = sm.getCamera();
			sm.load('PHYS', sm);
			sm.load('POINTER1', ground);
			hw.engine.runRenderLoop(function() {
				camera.position.y = m['ground'].getHeightAtCoordinates(camera.position.x,camera.position.z) + 10;
				w.water.waveHeight = w.water.waveHeight + (0.01 * Math.sin(x));
				w.water.bumpHeight = (0.02 * (2+Math.cos(x)));
				//console.info(w.water.bumpHeight);
				x = x + 0.05;;
			    sm.scene.render();	    
					
			});
		});
	});
	

	

    this.beep = function (data) {
        console.log('beep!', data);
    }
}

module.exports = App;
