attribute vec3 vertex_position;
attribute vec3 vertex_normal;

varying vec3 vPos;
varying vec2 vUv;
varying float vFade;

uniform mat4 matrix_viewProjection;
uniform mat4 matrix_model;
uniform vec4 positions[KEYS];
uniform float width;
uniform vec3 sourcePos;
uniform float dist;
uniform float end;

void main(void)
{
    int index = int(vertex_position.z);
    
    //vec3 curPos = positions[index];
    //vec3 nextPos = positions[index+1];
    
    vec3 curPos = index==0? sourcePos : positions[index].xyz;
    vec3 nextPos = positions[index+1].xyz;
    
    //vec3 prevPos = index==1? sourcePos : positions[index-1];
    //vec3 curPos = index==0? sourcePos : mix(positions[index], prevPos, dist);
    //vec3 nextPos = mix(positions[index+1], curPos, dist);
    
    vec3 dir = normalize(nextPos - curPos);
    vec3 dir2 = cross(vec3(0,1,0), dir);
    
    vec3 pos = dir2 * vertex_position.y * width;
    pos += curPos;
    
    vec4 wpos = matrix_model * vec4(pos,1);
    gl_Position = matrix_viewProjection * wpos;
    vPos = wpos.xyz;
    vUv = vec2(vertex_position.y+0.5, index==0? vertex_position.z - dist : vertex_position.z);
    vFade = clamp(1.0 - (vertex_position.z - (end-3.0)), 0.0, 1.0) * positions[index].a;
}


