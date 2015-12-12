function ModelScene() {
	this.totalVerticies = 0;
	this.vertexArray = [];
}

ModelScene.prototype.addCube = function(position, colour) {
	var shape = new CubeMesh();
	var x,y,z;
	for (var i=0; i<shape.vertex.length; i++) {
		x = shape.vertex[i][0] + position[0];
		y = shape.vertex[i][1] + position[1];
		z = shape.vertex[i][2] + position[2];
		this.vertexArray.push(x,y,z);
		this.vertexArray.push(colour[0],colour[1],colour[2]);
		this.vertexArray.push(shape.normal[i][0],shape.normal[i][1],shape.normal[i][2]);
		this.totalVerticies++;
	}
}

function CubeMesh() {
	// corner verticies
	var c=[	[1,-1,1], [-1,1,1],		[1,1,1],	[-1,-1,1],
			[1,1,-1], [-1,1,-1],	[1,-1,-1],	[-1,-1,-1]];
	this.vertex =	[	c[0],	c[1],	c[2],
						c[3],	c[1],	c[0],
						c[4],	c[5],	c[6],
						c[7],	c[6],	c[5],

						c[2],	c[4],	c[0],
						c[4],	c[6],	c[0],
						c[5],	c[1],	c[7],
						c[3],	c[7],	c[1],

						c[4],	c[2],	c[1],
						c[5],	c[4],	c[1],
						c[7],	c[0],	c[6],
						c[0],	c[7],	c[3]];
	// array of face normals
	var d = [[0,0,-1],[0,0,1],[-1,0,0],[1,0,0],[0,-1,0],[0,1,0]];
	this.normal=[ d[0], d[0], d[0],
				d[0], d[0], d[0],
				d[1], d[1], d[1],
				d[1], d[1], d[1],

				d[2], d[2], d[2],
				d[2], d[2], d[2],
				d[3], d[3], d[3],
				d[3], d[3], d[3],

				d[4], d[4], d[4],
				d[4], d[4], d[4],
				d[5], d[5], d[5],
				d[5], d[5], d[5]];
}
