function Render3D() {
	this.canvas = document.createElement('canvas');
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	this.gl = this.canvas.getContext("webgl");

	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	this.camera = new Camera();

	this.initialise();
}

Render3D.prototype.initialise = function() {
	this.createShaderProgram();
	this.createPointers();

	this.createModels();

	this.createBuffers();
}

Render3D.prototype.createShaderProgram = function() {
	var gl = this.gl;
	var vertexShader = this.getShader("vertShader");
	var fragmentShader = this.getShader("fragShader");

	this.shaderProgram = gl.createProgram();
	gl.attachShader(this.shaderProgram, vertexShader);
	gl.attachShader(this.shaderProgram, fragmentShader);
	gl.linkProgram(this.shaderProgram);
	gl.useProgram(this.shaderProgram);
}
Render3D.prototype.getShader = function(name) {
	var gl = this.gl;
	var shaderScript = document.getElementById(name);
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

Render3D.prototype.createPointers = function() {
	this.pointer = {};
	var gl = this.gl;
	var p = this.pointer;
	var s = this.shaderProgram;

	// view point transforms
	p.projectionMatrix = gl.getUniformLocation(s, "ProjectionMatrix");
	p.viewMatrix = gl.getUniformLocation(s, "ViewMatrix");
	p.modelMatrix = gl.getUniformLocation(s, "ModelMatrix");

	// lighting pointers
	p.normalMatrix = gl.getUniformLocation(s, "NormalMatrix");
	p.ambient = gl.getUniformLocation(s, "Ambient");
	p.lightColour = gl.getUniformLocation(s, "LightColour");
	p.lightDirection = gl.getUniformLocation(s, "LightDirection");

	// vertex attribute array pointers
	p.vertexPosition = gl.getAttribLocation(s, "position");
	gl.enableVertexAttribArray(p.vertexPosition);

	p.vertexColour = gl.getAttribLocation(s,"colour");
	gl.enableVertexAttribArray(p.vertexColour);

	p.vertexNormal = gl.getAttribLocation(s, "normal");
	gl.enableVertexAttribArray(p.vertexNormal);
}

Render3D.prototype.createModels = function() {
	this.modelScene = {};//new ModelScene();
	this.modelScene.totalVerticies=0;
	this.modelScene.vertexArray = [];
}

Render3D.prototype.createBuffers= function() {
	var gl = this.gl;
	this.arrayBufferObjectID = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBufferObjectID);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelScene.vertexArray), gl.DYNAMIC_DRAW);

	// structure of data in vertex array: index 0:postion, 3:colour, 6:normal with 3 entries each.
	// each entry is a float filling 4 bytes therefore total size per vertex = 4*9
	gl.vertexAttribPointer(this.pointer.vertexPosition, 3, gl.FLOAT, false, 4*9, 0);
	gl.vertexAttribPointer(this.pointer.vertexColour, 3, gl.FLOAT, false, 4*9, 4*3);
	gl.vertexAttribPointer(this.pointer.vertexNormal, 3, gl.FLOAT, false, 4*9, 4*6);

}

Render3D.prototype.update = function() {
	this.camera.update();
	this.drawModelScene();
}

Render3D.prototype.drawModelScene = function() {
	var gl = this.gl;
	var p = this.pointer;
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

	// update pointers to view point transforms
	gl.uniformMatrix4fv(p.projectionMatrix, false, this.camera.projectionMatrix);
	gl.uniformMatrix4fv(p.viewMatrix, false, this.camera.viewMatrix);
	gl.uniformMatrix4fv(p.modelMatrix, false, this.camera.modelMatrix);

	//update pointers to lighting variables
	gl.uniformMatrix3fv(p.normalMatrix, false, this.camera.normalMatrix);
	gl.uniform3fv(p.ambient, [0.08,0.08,0.08]);
	gl.uniform3fv(p.lightColour, [1.0,1.0,1.0]);
	gl.uniform3fv(p.lightDirection, [0.0,-0.5,-1.0]);

	gl.drawArrays(gl.TRIANGLES, 0, this.modelScene.totalVerticies);
	gl.flush();
}
