function Display(canvasName) {
	this.canvas = document.getElementById(canvasName);
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");

	this.render3D = new Render3D();
}

Display.prototype.update = function() {
	this.clearCanvas();
	this.render3D.update();
	this.ctx.drawImage(this.render3D.canvas,0,0);
	this.drawInterface();
}

Display.prototype.clearCanvas = function() {
	this.ctx.fillStyle = "#DCE5F2";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

}

Display.prototype.drawInterface = function() {
	this.ctx.fillStyle = "#ffffff";
	this.ctx.fillText("total verticies: "+this.render3D.modelScene.totalVerticies, 5,12);
}
