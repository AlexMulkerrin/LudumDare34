function Control(canvasName, simulation, display) {
	this.targetCanvas = document.getElementById(canvasName);
	this.targetSim = simulation;
	this.targetDisplay = display;

	this.mouse = new Mouse();

	this.createCanvasEventHandlers();
}

Control.prototype.createCanvasEventHandlers = function() {
	var c = this.targetCanvas;
	var t = this;

	c.onmousedown = function (event) { t.mousePressed(event); };
	document.onmouseup = function (event) { t.mouseReleased(event); };
	document.onmousemove = function (event) { t.mouseUpdateCoords(event); };

	c.onmousewheel = function(event){t.mouseWheel(event.wheelDelta); return false;};
	c.onwheel = function(event){t.mouseWheel(event); return false;};

	c.oncontextmenu = function(event){return false;};
	c.onselectstart = function(event){return false;};
}

Control.prototype.mousePressed = function(event) {
	this.mouse.isPressed = true;
	this.mouse.oldX = event.clientX;
	this.mouse.oldY = event.clientY;
	this.targetDisplay.render3D.camera.setOrbit(0,0,0);
}

Control.prototype.mouseReleased = function(event) {
	this.mouse.isPressed = false;
	this.mouse.isReleased = true;
}

Control.prototype.mouseUpdateCoords = function(event) {
	var m = this.mouse;
	m.x = event.clientX;
	m.y = event.clientY;

	if (m.isPressed) {
		var deltaX = m.x - m.oldX;
		var deltaY = m.y - m.oldY;
		this.targetDisplay.render3D.camera.orbit(deltaY,deltaX, 0);
	}
	if (m.isReleased) {
		var deltaX = m.x - m.oldX;
		var deltaY = m.y - m.oldY;
		this.targetDisplay.render3D.camera.setOrbit(deltaY,deltaX, 0);
	}
	m.isReleased = false;
	m.oldX = m.x;
	m.oldY = m.y;
}

Control.prototype.mouseWheel = function(event) {
	var change = -event.deltaY || event.wheelDelta;
	if (change > 0) {
		this.targetDisplay.render3D.camera.lowerOrbit();
	} else {
		this.targetDisplay.render3D.camera.raiseOrbit();
	}
}

function Mouse() {
	this.x = 0;
	this.y = 0;
	this.oldX = 0;
	this.oldY = 0;
	this.isPressed = false;
	this.buttonPressed = 0;
}
