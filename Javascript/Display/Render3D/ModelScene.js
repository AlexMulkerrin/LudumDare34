function ModelScene(simulation) {
	this.targetSim = simulation;

	this.totalVerticies = 0;
	this.vertexArray = [];
}

ModelScene.prototype.createModels = function() {
	this.createElevationSphere(this.targetSim.width,this.targetSim.height,20);
	this.addCube([25,0,0],[1,0,0],1);
	this.createHomes();
	this.createStars();
}

ModelScene.prototype.createVoxels = function() {
	var colour = [];
	var position = [];

	var sim = this.targetSim;

	for (var i=0; i<sim.width; i++) {
		for (var j=0; j<sim.height; j++) {
			for (var k=0; k<sim.depth; k++) {
				if (sim.block[i][j][k] === 1) {
					position = [(i-sim.radius)*3, (j-sim.radius)*3, (k-sim.radius)*3];
					colour = [0,Math.random(),0.5];
					this.addCube(position, colour,1);
				}
			}
		}
	}

}

ModelScene.prototype.createElevationSphere = function(longitudeBands, latitudeBands, radius) {
	var vertexPositons = [];
	var vertexNormals = [];
	var vertexElevations = [];
	var vertexOcclusion = [];

	for (var latNum=0; latNum <= latitudeBands; latNum++) {
		var theta = latNum * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNum=0; longNum <= longitudeBands; longNum++) {
			var phi = longNum * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;

			var e = this.targetSim.terrain.elevation[longNum%longitudeBands][latNum%latitudeBands];
			var r = radius*(e*0.1+0.95);


			vertexNormals.push([x,y,z]);
			vertexPositons.push([x*r, y*r, z*r]);
			vertexElevations.push(e);
			vertexOcclusion.push(this.targetSim.terrain.getOcclusion(longNum%longitudeBands, latNum%latitudeBands));

		}
	}

	for (var latNum=0; latNum < latitudeBands; latNum++) {
		for (var longNum=0; longNum < longitudeBands; longNum++) {
			var a = latNum * (longitudeBands+1) + longNum;
			var b = a + longitudeBands +1;

			var pos = [];
			pos[0] = vertexPositons[a];
			pos[1] = vertexPositons[b];
			pos[2] = vertexPositons[a+1];
			pos[3] = vertexPositons[b+1];

			var norm = [];
			norm[0] = vertexNormals[a];
			norm[1] = vertexNormals[b];
			norm[2] = vertexNormals[a+1];
			norm[3] = vertexNormals[b+1];

			//var colour = [0,Math.random(),0.5];
			var biome = this.targetSim.terrain.biome[longNum][latNum];
			//var avElevation = vertexElevations[a]+vertexElevations[b]+vertexElevations[a+1]+vertexElevations[b+1]/4;
			var biomeColour = biomePalette[biome];

			var colour = [];
			colour[0] = scalarMultiplyVector3(1/vertexOcclusion[a], biomeColour);//[0,avElevation,0.5];
			colour[1] = scalarMultiplyVector3(1/vertexOcclusion[b], biomeColour);
			colour[2] = scalarMultiplyVector3(1/vertexOcclusion[a+1], biomeColour);
			colour[3] = scalarMultiplyVector3(1/vertexOcclusion[b+1], biomeColour);

			this.addQuad(pos, norm, colour);
		}
	}
}

ModelScene.prototype.createStars = function() {
	var pos = [];
	var norm = [];
	var colour = [];
	var disp = [[0,0],[0.003,0.005],[-0.003,0.005]];
	for (var i=0; i<1000; i++) {
		var theta = Math.random()*Math.PI;
		var phi = Math.random()*2*Math.PI;
		var r = Math.random()*50+500;

		for (var j=0; j<disp.length; j++) {

			var x = Math.cos(phi+disp[j][0]) * Math.sin(theta+disp[j][1]);
			var y = Math.cos(theta+disp[j][1]);
			var z = Math.sin(phi+disp[j][0]) * Math.sin(theta+disp[j][1]);


			pos[j] = [x*r, y*r, z*r];
			norm[j]= [-x,-y,-z];
			colour[j] = [1,1,1];
		}
		this.addTriangle(pos, norm, colour);
	}
}

ModelScene.prototype.createHomes = function() {
	var pos = [];
	var norm = [];
	var colour = [];
	for (var i=0; i<100; i++) {
		var theta = Math.random()*Math.PI;
		var phi = Math.random()*2*Math.PI;
		var r = 20;

		var x = Math.cos(phi) * Math.sin(theta);
		var y = Math.cos(theta);
		var z = Math.sin(phi) * Math.sin(theta);


		pos = [x*r, y*r, z*r];
		colour = [Math.random(),Math.random(),Math.random()];

		this.addCube(pos, colour,0.2);
	}
}

ModelScene.prototype.addCube = function(position, colour, scale) {
	var shape = new CubeMesh();
	var x,y,z;
	for (var i=0; i<shape.vertex.length; i++) {
		x = shape.vertex[i][0]*scale + position[0];
		y = shape.vertex[i][1]*scale + position[1];
		z = shape.vertex[i][2]*scale + position[2];
		this.vertexArray.push(x,y,z);
		this.vertexArray.push(colour[0],colour[1],colour[2]);
		this.vertexArray.push(shape.normal[i][0],shape.normal[i][1],shape.normal[i][2]);
		this.totalVerticies++;
	}
}

ModelScene.prototype.addQuad = function(pos, norm, colour) {
	this.addTriangle(
		[pos[0], pos[1], pos[2]],
		[norm[0], norm[1], norm[2]],
		[colour[0], colour[1], colour[2]]
	);
	this.addTriangle(
		[pos[1], pos[3], pos[2]],
		[norm[1], norm[3], norm[2]],
		[colour[1], colour[3], colour[2]]
	);
}

ModelScene.prototype.addTriangle = function(pos, norm, colour) {
	for (var i=0; i<pos.length; i++) {
		this.vertexArray.push(pos[i][0],pos[i][1],pos[i][2]);
		this.vertexArray.push(colour[i][0],colour[i][1],colour[i][2]);
		this.vertexArray.push(norm[i][0],norm[i][1],norm[i][2]);

		this.totalVerticies++;
	}

}

function Model(index, position) {
	this.index = index;
	this.size = 0;
	this.position = position
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
	var d = [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]];
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
