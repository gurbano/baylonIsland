var HW = require('./lib/HW'); //hw, camera, canvas
var SM = require('./lib/SM'); //scene manager


function App(div) {
	var self = this;
	var hw = this.hw = new HW(div);
	var sm = this.sm = new SM(hw);

	sm.load('TST1');
	sm.load('TERR1',{}, function (m) {
		var trees = sm.load('TREE1', m['ground']);
		var s = sm.load('SKYBOX1');
		sm.load('WATER1', [s,m, trees]);
	});
	

	

	hw.engine.runRenderLoop(function() {
	    sm.scene.render();	    
	});
    this.beep = function (data) {
        console.log('beep!', data);
    }
}

module.exports = App;
