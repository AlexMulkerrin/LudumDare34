function TerrainGenerator(width, height) {
	random = new PseudorandomGenerator();
	this.seed = 13;//Math.floor(Math.random()*9000);
	random.setSeed(this.seed);

	this.width = width;
	this.height = height;
	this.elevation = [];
	for (var i=0; i<this.width; i++) {
		this.elevation[i] = [];
		for (var j=0; j<this.height; j++) {
			this.elevation[i][j] = 0;
		}
	}
	this.biome = [];
	for (var i=0; i<this.width; i++) {
		this.biome[i] = [];
		for (var j=0; j<this.height; j++) {
			this.biome[i][j] = biomeID.rock;
		}
	}

	this.raiseLand();
	this.selectBiome();
	//this.flattenOcean();

	this.setOcclusion();

	this.findBeaches();

}

TerrainGenerator.prototype.raiseLand = function() {
	var noise = new OctaveNoise(8);
	for (var i=0; i<this.width; i++) {
		var phi = i * 2 * Math.PI / this.width;
		var sinPhi = Math.sin(phi);
		var cosPhi = Math.cos(phi);


		for (var j=0; j<this.height; j++) {
			var theta = j * Math.PI / this.height;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;

			//this.elevation[i][j] = noise.compute(i*0.05,j*0.05);
			this.elevation[i][j] = noise.compute3D(x*3,y*3,z*3);
		}
	}
}

TerrainGenerator.prototype.selectBiome = function() {
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			this.biome[i][j] = biomeID.ocean;


			var avElev= this.elevation[i][j]+
			this.elevation[(i+1)%this.width][j]+
			this.elevation[i][(j+1)%this.height]+
			this.elevation[(i+1)%this.width][(j+1)%this.height]
			;// /4;

			if (avElev>3) {
			   this.biome[i][j] = biomeID.ice;
		   } else  if (avElev>2) {
				this.biome[i][j] = biomeID.rock;
			} else  if (avElev>1) {
 				this.biome[i][j] = biomeID.hill;
 			} else if (avElev>0) {
				this.biome[i][j] = biomeID.grass;
			} else if (avElev>-1) {
				this.biome[i][j] = biomeID.coast;
			}

			var temp =0;// Math.abs(j-this.height/2)/2 + this.elevation[i][j] - Math.random();
			if (temp>30 && avElev>0) {
				this.biome[i][j] = biomeID.ice;
			}
		}
	}
}

TerrainGenerator.prototype.flattenOcean = function() {
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			if (this.elevation[i][j]<0) this.elevation[i][j]=0;
		}
	}
}

TerrainGenerator.prototype.setOcclusion = function() {
	var adj = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];
	this.occlusion = [];
	for (var i=0; i<this.width; i++) {
		this.occlusion[i] = [];
		for (var j=0; j<this.height; j++) {
			this.occlusion[i][j] = 1;
			for (var e=0; e<adj.length; e++) {
				var x = (i + adj[e][0]) % this.width-1;
				if (x<0) x+=this.width-1;
				var y = (j +adj[e][1]) % this.height-1;
				if (y<0) y+=this.height-1;

				var diff = this.elevation[x][y] - this.elevation[i][j];
				if (diff>0) this.occlusion[i][j] += diff;
			}
		}
	}
}

TerrainGenerator.prototype.findBeaches = function() {
	var adj = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			if (this.biome[i][j] !== biomeID.ocean && this.biome[i][j] !== biomeID.coast) {
				for (var e=0; e<adj.length; e++) {
					var x = (i + adj[e][0]) % (this.width-1);
					if (x<0) x+=this.width;
					var y = (j +adj[e][1]) % (this.height-1);
					if (y<0) y+=this.height;

					if (this.biome[x][y] == biomeID.ocean || this.biome[x][y]== biomeID.coast) {
						this.biome[i][j] = biomeID.beach;
					}
				}
			}
		}
	}
}

TerrainGenerator.prototype.getOcclusion = function(x,y) {
	return this.occlusion[x][y];
}

function OctaveNoise(octaves) {
	this.perlin = [];
	this.octaves = octaves;
	for (var i=0; i<this.octaves; i++) {
		this.perlin[i] = new PerlinNoise();
	}
}

OctaveNoise.prototype.compute = function(x,y) {
	var result = 0
	var amplitude = 1;
	for (var i=0; i<this.octaves; i++) {
		result += this.perlin[i].compute( x/amplitude, y/amplitude) * amplitude;
		amplitude /= 2;
	}
	return result;
}

OctaveNoise.prototype.compute3D = function(x,y,z) {
	var result = 0
	var amplitude = 1;
	for (var i=0; i<this.octaves; i++) {
		result += this.perlin[i].compute3D( x/amplitude, y/amplitude, z/amplitude) * amplitude;
		amplitude /= 2;
	}
	return result;
}

// creates a Perlin Noise object which can be polled for smoothly varying noise
// values in x,y coordinates
function PerlinNoise() {
	this.noise = [];
	this.generateNoise();
}
PerlinNoise.prototype.generateNoise = function() {
	var i;
	for (i=0; i<=256; i++) {
		this.noise[i] = i;
	}

	for (i=0; i<256; i++) {
		var newValue = random.integer(256 - i) + i;
		var prevValue = this.noise[i];

		this.noise[i] = this.noise[newValue];
		this.noise[newValue] = prevValue;
		this.noise[i + 256] = this.noise[i];
	}
}
PerlinNoise.prototype.compute = function(x,y) {
	var intX = Math.floor(x) & 255;
	var intY = Math.floor(y) & 255;

	var decX = x - Math.floor(x);
	var decY = y - Math.floor(y);

	var u = this.fade(decX);
	var v = this.fade(decY);

	var a = this.noise[intX] + intY;
	var aa = this.noise[a];
	var ab = this.noise[a+1];

	var b = this.noise[intX+1] + intY;
	var ba = this.noise[b];
	var bb = this.noise[b+1];

	var result = this.lerp(
					v,
					this.lerp(
						u,
						this.grad(this.noise[aa], decX, decY),
						this.grad(this.noise[ba], decX-1, decY)
					),
					this.lerp(
						u,
						this.grad(this.noise[ab], decX, decY-1),
						this.grad(this.noise[bb], decX-1, decY-1)
					)
				);
	return result;
}

PerlinNoise.prototype.compute3D = function(x,y,z) {
	var ix0 = Math.floor( x ); // Integer part of x
    var iy0 = Math.floor( y ); // Integer part of y
    var iz0 = Math.floor( z ); // Integer part of z
    var fx0 = x - ix0;        // Fractional part of x
    var fy0 = y - iy0;        // Fractional part of y
    var fz0 = z - iz0;        // Fractional part of z
    var fx1 = fx0 - 1.0;
    var fy1 = fy0 - 1.0;
    var fz1 = fz0 - 1.0;
    var ix1 = ( ix0 + 1 ) & 0xff; // Wrap to 0..255
    var iy1 = ( iy0 + 1 ) & 0xff;
    var iz1 = ( iz0 + 1 ) & 0xff;
    var ix0 = ix0 & 0xff;
    var iy0 = iy0 & 0xff;
    var iz0 = iz0 & 0xff;

    r = this.fade( fz0 );
    t = this.fade( fy0 );
    s = this.fade( fx0 );

	var perm = this.noise;
	var nxy0 = grad3(perm[ix0 + perm[iy0 + perm[iz0]]], fx0, fy0, fz0);
    var nxy1 = grad3(perm[ix0 + perm[iy0 + perm[iz1]]], fx0, fy0, fz1);
    var nx0 = this.lerp( r, nxy0, nxy1 );

    var nxy0 = grad3(perm[ix0 + perm[iy1 + perm[iz0]]], fx0, fy1, fz0);
    var nxy1 = grad3(perm[ix0 + perm[iy1 + perm[iz1]]], fx0, fy1, fz1);
    var nx1 = this.lerp( r, nxy0, nxy1 );

    var n0 = this.lerp( t, nx0, nx1 );

    var nxy0 = grad3(perm[ix1 + perm[iy0 + perm[iz0]]], fx1, fy0, fz0);
    var nxy1 = grad3(perm[ix1 + perm[iy0 + perm[iz1]]], fx1, fy0, fz1);
    var nx0 = this.lerp( r, nxy0, nxy1 );

    var nxy0 = grad3(perm[ix1 + perm[iy1 + perm[iz0]]], fx1, fy1, fz0);
    var nxy1 = grad3(perm[ix1 + perm[iy1 + perm[iz1]]], fx1, fy1, fz1);
    var nx1 = this.lerp( r, nxy0, nxy1 );

    var n1 = this.lerp( t, nx0, nx1 );

	return this.lerp(s, n0, n1);

}

PerlinNoise.prototype.fade = function(a) {
	return a * a * a * (a * ((a * 6) -15) +10);
}
PerlinNoise.prototype.grad = function(hash, x, y) {
	hash = hash & 15;
	var u = hash < 8 ? x : y;
	var v = hash < 4 ? y : (hash !== 12 && hash !== 14 ? 0 : x);

	return ((hash & 1) == 0 ? u : -u) + ((hash & 2) == 0 ? v : -v);
}
PerlinNoise.prototype.lerp = function(t, a, b) {
	return a + t * (b - a);
}


function grad3(hash, x, y, z) {
	var h = hash & 15;     // Convert low 4 bits of hash code into 12 simple
	var u = h<8 ? x : y; // gradient directions, and compute dot product.
	var v = h<4 ? y : h==12||h==14 ? x : z; // Fix repeats at h = 12 to 15
   return ((h&1)? -u : u) + ((h&2)? -v : v);
}

// class for seedable random number generator
function PseudorandomGenerator() {
	this.seed;
	// variables for multiplt with carry method
	this.mw;
	this.mz;
}
PseudorandomGenerator.prototype.setSeed = function(seed) {
	this.seed = seed;
	this.mw = seed;
	this.mz = 987654321;
}
PseudorandomGenerator.prototype.getNext = function() {
	var result;
	var mask = 0xffffffff;
	this.mz = (36969 * (this.mz & 65535) + (this.mz >> 16)) & mask;
	this.mw = (18000 * (this.mw & 65535) + (this.mw >> 16)) & mask;
	result =((this.mz << 16) + this.mw) & mask;
	result /= 4294967296;
	return result + 0.5;
}
PseudorandomGenerator.prototype.integer = function(max) {
	return Math.floor(this.getNext()*max);
}
