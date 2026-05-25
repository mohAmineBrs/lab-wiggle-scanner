import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"

export const PlaneMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("#ffffff"),
  },
  // vertex shader
  /*glsl*/ `
    #include <common>
    #include <skinning_pars_vertex>

    varying vec2 vUv;

    void main() {
      vUv = uv;

      #include <beginnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>

      #include <begin_vertex>
      #include <skinning_vertex>

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/ `
    uniform vec3 uColor;

    varying vec2 vUv;
    
    void main(){

      float grad = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

      vec3 finalColor = mix(uColor * 0.1, uColor, grad);
      
      gl_FragColor = vec4(finalColor, 1.);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
)

extend({ PlaneMaterial })
