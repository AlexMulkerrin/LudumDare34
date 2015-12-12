
function loadProgram() {
	var program = new Program("growCanvas");

	program.display.update();
	setInterval(function(){program.update();}, program.refreshDelay);
}

function Program(canvasName) {
	this.refreshDelay = 50;

	this.display = new Display(canvasName);
}

Program.prototype.update = function() {
	this.display.update();
}
