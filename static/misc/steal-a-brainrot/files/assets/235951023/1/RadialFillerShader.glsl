// radialFillerShader.shader

attribute vec3 aPosition;
attribute vec2 aUv0;

uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;

varying vec2 vUv;

void main(void) {
    vUv = aUv0;
    gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);
}
// #FRAGMENT
precision mediump float;

uniform sampler2D uDiffuseMap;
uniform float uFillAmount;

varying vec2 vUv;

void main(void) {
    vec2 center = vec2(0.5, 0.5);
    vec2 dir = vUv - center;
    float angle = atan(dir.y, dir.x);
    float radius = length(dir);

    angle = angle < 0.0 ? angle + 6.28318530718 : angle;
    float maxAngle = uFillAmount * 6.28318530718;

    if (radius > 0.5 || angle > maxAngle) discard;

    gl_FragColor = texture2D(uDiffuseMap, vUv);
}
