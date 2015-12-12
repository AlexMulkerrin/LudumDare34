function Display(canvasName) {
	this.canvas = document.getElementById(canvasName);
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");
}

Display.prototype.update = function() {
	this.clearCanvas();
}

Display.prototype.clearCanvas = function() {
	this.ctx.fillStyle = "#DCE5F2";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
