function Display(canvasName, simulation) {
	this.targetSim = simulation;

	this.canvas = document.getElementById(canvasName);
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");

	this.render3D = new Render3D(this.targetSim);

	var midX = this.canvas.width/2;
	var midY = this.canvas.height/2;
	this.gradient = this.ctx.createRadialGradient(midX,midY,275,midX,midY,325);
	this.gradient.addColorStop(0, "#35CCFF");
	this.gradient.addColorStop(1, "black");
}

Display.prototype.update = function() {
	this.clearCanvas();
	this.render3D.update();
	this.ctx.drawImage(this.render3D.canvas,0,0);
	this.drawInterface();
}

Display.prototype.clearCanvas = function() {
	this.ctx.fillStyle = this.gradient;
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

}

Display.prototype.drawInterface = function() {
	this.ctx.fillStyle = "#ffffff";
	this.ctx.fillText("total verticies: "+this.render3D.modelScene.totalVerticies, 5,12);
}
