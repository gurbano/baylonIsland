
/*Audio manager*/
function AM(hw){
	var self = this;
    var library = {};
	this.add = function (name, obj) {
        library[name] = obj;
    };
    this.get = function (name) {
        return library[name];
    }
}

module.exports = AM;