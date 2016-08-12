'use strict';


window.addEventListener('DOMContentLoaded', function() {
    var App = require('./app');
    var app = new App('renderCanvas');
    app.beep();  
});