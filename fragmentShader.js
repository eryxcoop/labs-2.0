export default function fragmentShader() {
    return `
      uniform float time;
      uniform float progress;
      uniform vec3 uColor;
      uniform sampler2D uTexture;
      uniform vec4 resolution;
      varying vec2 vUv;
      varying vec3 vPosition;
      float PI = 3.14159265359;
      
      void main() {
        vec4 ttt = texture2D( uTexture, vUv );
        gl_FragColor = vec4(uColor, ttt.z);
        if (ttt.a - 1. < 0.0) {
          gl_FragColor.a = 0.0;
        }
      }
    `;
  }


