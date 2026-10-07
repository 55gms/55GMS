uniform sampler2D splatMap;
uniform sampler2D texture_red;
uniform sampler2D texture_green;
uniform sampler2D texture_blue;
uniform sampler2D texture_alpha;

varying float vAmount;

void getAlbedo() {
    vec2 repeatUV = fract(80.0 * $UV);
    vec2 repeatSplatUV = fract(1.0 * $UV);

    vec4 texture0 = $DECODE(texture2D(texture_red, repeatUV));
    vec4 texture1 = $DECODE(texture2D(texture_green, repeatUV));
    vec4 texture2 = $DECODE(texture2D(texture_blue, repeatUV));
    vec4 texture3 = $DECODE(texture2D(texture_alpha, repeatUV));
    vec4 splat = $DECODE(texture2D(splatMap, repeatSplatUV));

    texture0 *= splat.r;
    texture1 = mix(texture0, texture1, smoothstep(0.01, 0.03, splat.g));
    texture2 = mix(texture1, texture2, smoothstep(0.01, 0.03, splat.b));
    texture3 = mix(texture2, texture3, smoothstep(0.01, 0.03, 1.0 - splat.a));
    dAlbedo = texture3.rgb;
}
