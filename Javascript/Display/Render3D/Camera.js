function Camera() {
	this.projectionMatrix = getProjectionMatrix4(40, window.innerWidth/window.innerHeight, 1, 100);
	this.modelMatrix = identityMatrix4();
	this.viewMatrix = identityMatrix4();
	this.viewMatrix = translateMatrix4(this.viewMatrix, 0, -2, -50);
	this.normalMatrix = emptyMatrix3();
}

Camera.prototype.update = function() {

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

function emptyMatrix3() {
	return [0, 0, 0,
			0, 0, 0,
			0, 0, 0
		];
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
