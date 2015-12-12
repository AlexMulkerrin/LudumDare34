function Camera() {
	this.projectionMatrix = getProjectionMatrix4(40, window.innerWidth/window.innerHeight, 1, 100);
	this.modelMatrix = identityMatrix4();
	this.viewMatrix = identityMatrix4();
	this.viewMatrix = translateMatrix4(this.viewMatrix, 0, -2, -50);
	this.normalMatrix = emptyMatrix3();
}

Camera.prototype.update = function() {
	this.modelMatrix = rotateY(this.modelMatrix, 0.02);

	this.normalMatrix = emptyMatrix3();
	this.normalMatrix = mat4toInverseMat3(this.modelMatrix, this.normalMatrix);
	this.normalMatrix = mat3transpose(this.normalMatrix);
}

function identityMatrix4() {
	return [1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
}

function translateMatrix4(matrix, tx, ty, tz) {
	var newMat = matrix.slice(0);
	newMat[12] += tx;
	newMat[13] += ty;
	newMat[14] += tz;
	return newMat;
}

function rotateY(m,angle) {
	var c=Math.cos(angle);
	var s=Math.sin(angle);
	var mv0=m[0], mv4=m[4], mv8=m[8];
	m[0]=m[0]*c-m[2]*s;
	m[4]=m[4]*c-m[6]*s;
	m[8]=m[8]*c-m[10]*s;

	m[2]=m[2]*c+mv0*s;
	m[6]=m[6]*c+mv4*s;
	m[10]=m[10]*c+mv8*s;

	return m;
}

function emptyMatrix3() {
	return [0, 0, 0,
			0, 0, 0,
			0, 0, 0
		];
}

function mat4toInverseMat3(a,b){
	var c = a[0],
	d = a[1],
	e = a[2],
	g = a[4],
	f = a[5],
	h = a[6],
	i = a[8],
	j = a[9],
	k = a[10],
	l = k*f-h*j,o = -k*g+h*i,m = j*g-f*i,n = c*l+d*o+e*m;
	if(!n) return null;
	n = 1/n;
	b[0] = l*n;
	b[1] = (-k*d+e*j)*n;
	b[2] = (h*d-e*f)*n;
	b[3] = o*n;
	b[4] = (k*c-e*i)*n;
	b[5] = (-h*c+e*g)*n;
	b[6] = m*n;
	b[7] = (-j*c+d*i)*n;
	b[8] = (f*c-d*g)*n;
	return b;
}

function mat3transpose(a,b){
	if(!b||a === b){
		var c = a[1],d = a[2],e = a[5];
		a[1] = a[3];
		a[2] = a[6];
		a[3] = c;
		a[5] = a[7];
		a[6] = d;
		a[7] = e;
		return a;
	}
	b[0] = a[0];
	b[1] = a[3];
	b[2] = a[6];
	b[3] = a[1];
	b[4] = a[4];
	b[5] = a[7];
	b[6] = a[2];
	b[7] = a[5];
	b[8] = a[8];
	return b;
}

function getProjectionMatrix4(angle, a, minZ, maxZ) {
	var tan = Math.tan(degToRad(0.5*angle));
	var A = -(maxZ+minZ)/(maxZ - minZ);
	var B = (-2*maxZ*minZ)/(maxZ-minZ);

	return [
			0.5/tan,	0,			0,	0,
			0,			0.5*a/tan,	0, 	0,
			0,			0,			A,	-1,
			0,			0,			B,	0
	];
}

function degToRad(angle) {
	return(angle*Math.PI/180);
}
