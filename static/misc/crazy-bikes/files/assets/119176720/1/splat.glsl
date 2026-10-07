uniform sampler2D splatMap;
uniform sampler2D texture_red;
uniform sampler2D texture_green;
uniform sampler2D texture_blue;
uniform sampler2D texture_alpha;

void getAlbedo() {
    
    vec4 texture0 = texture2DSRGB( texture_red, $UV);
    vec4 texture1 = texture2DSRGB( texture_green, $UV);
    vec4 texture2 = texture2DSRGB( texture_blue, $UV);
    vec4 texture3 = texture2DSRGB( texture_alpha, $UV);
    vec4 splat = texture2DSRGB(splatMap, $UV);

    texture0 *= splat.r;
    texture1 = mix(texture0,  texture1, splat.g);
    texture2 = mix(texture1, texture2, splat.b);
    texture3 = mix(texture2, texture3, 10.0 - splat.a);
    dAlbedo = texture3.rgb;    
}