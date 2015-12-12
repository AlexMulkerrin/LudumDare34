uniform mat4 ProjectionMatrix;
uniform mat4 ViewMatrix;
uniform mat4 ModelMatrix;
uniform mat3 NormalMatrix;

attribute vec3 position;
attribute vec3 colour;
varying vec3 normal;

void main(void) {
	gl_Position = ProjectionMatrix * ViewMatrix * ModelMatrix * vec4(position, 1.0);
	vertexColour = colour;
	vertexNormal = normalize(NormalMatrix * normal);
}
