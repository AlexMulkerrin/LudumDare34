function Simulation(w,h,d) {
	this.width = w;
	this.height = h;
	this.depth = d;
	this.block = [];

	this.radius = Math.floor(this.width/2);
	this.createBlocks();
}

Simulation.prototype.createBlocks = function() {
	for (var i=0; i<this.width; i++) {
		this.block[i] = [];
		for (var j=0; j<this.height; j++) {
			this.block[i][j] = [];
			for (var k=0; k<this.depth; k++) {
				if (this.isWithinRadiusEven(i,j,k)) {
					this.block[i][j][k] = 1;
				} else {
					this.block[i][j][k] = 0;
				}
			}
		}
	}
}

Simulation.prototype.isWithinRadiusEven = function(x,y,z) {
	var sX = 0.5 + x - this.width/2;
	var sY = 0.5 + y - this.height/2;
	var sZ = 0.5 + z - this.depth/2;
	var distance = sX*sX + sY*sY + sZ*sZ;

	if (distance <= this.radius*this.radius) {
		return true;
	} else {
		return false;
	}
}
