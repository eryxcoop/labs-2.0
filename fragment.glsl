uniform float time;
uniform float progress;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vUv;
float PI = 3.1415;

void main() {
    vec4 ttt = texture2D(uTexture, vUv)
    gl_FragColor = vec4(vec3(1.), ttt.z);
}