uniform sampler2D texture_msdfMap;

#ifdef GL_OES_standard_derivatives
#define USE_FWIDTH
#endif

#ifdef GL2
#define USE_FWIDTH
#endif

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float map(float min, float max, float v) {
    return (v - min) / (max - min);
}

uniform float font_sdfIntensity;
uniform float font_pxrange;
uniform float font_textureWidth;
uniform float time;
uniform float outlineThickness; // Uniform to control outline thickness

uniform vec3 colors[10];
uniform int colorCount;

vec4 getRainbowColor(float value) {
    if (colorCount == 0) return vec4(1.0); // fallback white

    // Normalize value to a 0-1 range
    float t = fract(value);

    // Scale to color array range
    float scaled = t * float(colorCount);
    int index1 = int(floor(scaled)) % colorCount;
    int index2 = (index1 + 1) % colorCount;

    float localT = fract(scaled);

    vec3 color1 = colors[index1];
    vec3 color2 = colors[index2];

    vec3 finalColor = mix(color1, color2, localT);
    return vec4(finalColor, 1.0);
}


vec4 applyMsdf(vec4 color) {
    vec3 tsample = texture2D(texture_msdfMap, vUv0).rgb;
    float sigDist = median(tsample.r, tsample.g, tsample.b);

    #ifdef USE_FWIDTH
        vec2 w = fwidth(vUv0);
        float smoothing = clamp(w.x * font_textureWidth / font_pxrange, 0.0, 0.5);
    #else
        float font_size = 16.0; 
        float smoothing = clamp(font_pxrange / font_size, 0.0, 0.5);
    #endif

    float mapMin = 0.05;
    float mapMax = clamp(1.0 - font_sdfIntensity, mapMin, 1.0);
    float sigDistInner = map(mapMin, mapMax, sigDist);
    float center = 0.4;

    // Text opacity
    float inside = smoothstep(center - smoothing, center + smoothing, sigDistInner);

    // Outline opacity
    float outlineEdge = 0.5 + outlineThickness;
    float outline = smoothstep(outlineEdge - smoothing, outlineEdge + smoothing, sigDistInner);

    // Rainbow effect based on UV coordinates and time
     // Calculate global position for linear rainbow effect
    float globalPosition = -gl_FragCoord.x / 500.0 + time; // Adjust scaling for desired gradient length

    // Rainbow effect for text
    vec4 rainbowColorOutline = getRainbowColor(globalPosition);  // Rainbow for text

   // vec4 rainbowColorOutline = getRainbowColor(vUv0.x - time);  // Rainbow effect for text
    //vec4 rainbowColorOutline = getRainbowColor(vUv0.x - time + 0.2);  // Slightly shifted rainbow for outline
    vec4 rainbowColorText  = vec4(0, 0, 0, 1.0); //black outline

    // Mix colors
    vec4 finalTextColor = mix(vec4(0.0), rainbowColorText, inside);  // Text color
    vec4 finalOutlineColor = mix(vec4(0.0), rainbowColorOutline, outline);  // Outline color

    // Combine text and outline with a smooth transition
    return finalOutlineColor + finalTextColor * (1.0 - outline); 
}