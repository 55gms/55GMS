shader 0 version 100

attribute vec3 aPosition;
attribute vec2 aUv0;

uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;

varying vec2 vUv0;

void main(void)
{
    gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);
    vUv0 = aUv0; // Pass UVs directly to fragment shader
}