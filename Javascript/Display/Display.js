const biomeID = { rock:0, ocean:1, coast:2, beach:3, grass:4, hill:5,mountain:6, plain:7, desert:8, tundra:9, ice:10};

//const biomePalette = ["#0000ff","#eeeeff","#ffffee", "#ddffdd", "ccddcc",
//						"#eeeeee", "#ffdd00", "#eecc00", "#ddcccc", "#ffffff",  "#ffffff"
//					];

const biomePalette = [[0.3,0.3,0.3],[0,0,0.5],[0.1,0.1,1],[0.5,0.5,0.5],[0.5,0.5,0.5],
						[0.5,0.5,0.5],[0.5,0.5,0.5],[0.5,0.5,0.5],[0.5,0.5,0.5],[0.5,0.5,0.5], [1,1,1]
];

function Display(canvasName, simulation) {
	this.targetSim = simulation;

	this.canvas = document.getElementById(canvasName);
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");

	this.createBackground();

	this.render3D = new Render3D(this.targetSim);
}

Display.prototype.createBackground = function() {
	this.background = document.createElement('canvas');
	this.background.width = window.innerWidth;
	this.background.height = window.innerHeight;
	this.background.ctx = this.background.getContext("2d");

	var midX = this.background.width/2;
	var midY = this.background.height/2;
	this.background.gradient = this.background.ctx.createRadialGradient(midX,midY,275,midX,midY,325);
	this.background.gradient.addColorStop(0, "#35CCFF");
	this.background.gradient.addColorStop(1, "black");
	this.background.ctx.fillStyle = this.background.gradient;
	this.background.ctx.fillRect(0, 0, this.background.width, this.background.height);
}

Display.prototype.update = function() {
	this.clearCanvas();
	this.render3D.update();
	this.ctx.drawImage(this.render3D.canvas,0,0);
	this.drawInterface();
}

Display.prototype.clearCanvas = function() {
	this.ctx.fillStyle = this.gradient;
	this.ctx.drawImage(this.background,0,0);

}

Display.prototype.drawInterface = function() {
	this.ctx.fillStyle = "#ffffff";
	this.ctx.fillText("total verticies: "+this.render3D.modelScene.totalVerticies, 5,12);
}


function colourStringToVector3(str) {

}
