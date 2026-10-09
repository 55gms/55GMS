uniform vec3 material_diffuse;

uniform sampler2D texture_mask;
uniform sampler2D dirt_texture;

void getAlbedo() {
    float dirt = texture2DBias(dirt_texture, vUv0 * 10.0, textureBias).r * 2.0;
    float maskValue = texture2DBias(texture_mask, vUv0, textureBias).x;

    float t = dirt + maskValue * (1.0 - dirt);
    dAlbedo = mix(material_diffuse.rgb, vec3(1.0), t) + 0.1;
}