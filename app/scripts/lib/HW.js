var conf = require('../conf/conf');
function HW(div){
	var self = this;
	var canvas = this.canvas =  document.getElementById(div);
	var engine = this.engine = new BABYLON.Engine(canvas, true);
	this.start = function (argument) {
		
	}
	window.addEventListener('resize', function() {
	    engine.resize();
	});


}

module.exports = HW;