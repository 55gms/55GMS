varying vec3 vPos;
varying vec2 vUv;
varying float vFade;

uniform sampler2D textureD;
uniform vec3 sourcePos;

void main(void) {
    float mask = texture2D(textureD, vUv).g;
    vec3 diff = vPos - sourcePos;
    gl_FragColor = vec4(0,0,0, mask * vFade * clamp(dot(diff,diff),0.0,1.0));
}

