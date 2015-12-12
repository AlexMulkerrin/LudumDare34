function TerrainGenerator(width, height) {
	random = new PseudorandomGenerator();
	this.seed = Math.floor(Math.random()*9000);
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
	this.raiseLand();
	this.selectBiome();
	this.flattenOcean();
	return this;
}

TerrainGenerator.prototype.raiseLand = function() {
	var noise = new OctaveNoise(8);
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			this.elevation[i][j] = noise.compute(i*0.05,j*0.05);
		}
	}
}

TerrainGenerator.prototype.selectBiome = function() {
	this.biome = [];
	for (var i=0; i<this.width; i++) {
		this.biome[i] = [];
		for (var j=0; j<this.height; j++) {
			this.biome[i][j] = biomeID.ocean;


			var avElev= this.elevation[i][j]+
			this.elevation[(i+1)%this.width][j]+
			this.elevation[i][(j+1)%this.height]+
			this.elevation[(i+1)%this.width][(j+1)%this.height]
			;// /4;

			if (avElev>2) {
			   this.biome[i][j] = biomeID.ice;
		   } else  if (avElev>1) {
				this.biome[i][j] = biomeID.rock;
			} else if (avElev>0) {
				this.biome[i][j] = biomeID.beach;
			} else if (avElev>-1) {
				this.biome[i][j] = biomeID.coast;
			}

			var temp = Math.abs(j-this.height/2)/2 + this.elevation[i][j] - Math.random();
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
