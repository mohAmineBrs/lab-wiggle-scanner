import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"

export const LensMaterial = shaderMaterial(
  {
    uTexture: null,
    uResolution: [1, 1],
    uAspect: 1,
    uBorderColor: [1, 1, 1, 1],
    uBorderWidth: 0.02,
  },
  // vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/ `
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform float uAspect;
    uniform vec4 uBorderColor;
    uniform float uBorderWidth;

    varying vec2 vUv;
    
    void main(){
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec4 color = texture2D(uTexture, uv);

      // Correct border width for aspect ratio
      float bx = uBorderWidth;
      float by = uBorderWidth / uAspect;

      float borderMask = 1.0 - step(bx, vUv.x)
                            + step(1.0 - bx, vUv.x)
                            + 1.0 - step(by, vUv.y)
                            + step(1.0 - by, vUv.y);

      borderMask = clamp(borderMask, 0.0, 1.0);

      gl_FragColor = mix(color, uBorderColor, borderMask);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
)

extend({ LensMaterial })
