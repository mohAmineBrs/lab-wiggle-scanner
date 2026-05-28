import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { animate } from "framer-motion"
import { useProgress } from "@react-three/drei"

import { LensMaterial } from "./LensMaterial"

const LENS_WIDTH = 2
const LENS_HEIGHT = 3

const Lens = ({ modelRefs }: { modelRefs: React.RefObject<THREE.Mesh[]> }) => {
  const lens = useRef<THREE.Mesh>(null!)

  const { gl, size } = useThree()

  const { progress } = useProgress()

  const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
    format: THREE.RGBAFormat,
  })

  useFrame((state) => {
    const { gl, scene, camera } = state
    const savedMaterials = modelRefs.current.map(
      (mesh: THREE.Mesh) => mesh?.material ?? null,
    )
    modelRefs.current.forEach((mesh: THREE.Mesh) => {
      if (!mesh) return
      mesh.material = new THREE.MeshBasicMaterial({
        color: "#2cff05",
        wireframe: true,
      })
    })

    const hidden: THREE.Object3D[] = []
    scene.traverse((obj) => {
      if (obj.userData.isPlane || obj === lens.current) {
        obj.visible = false
        hidden.push(obj)
      }
    })
    const prevClearColor = gl.getClearColor(new THREE.Color())
    const prevClearAlpha = gl.getClearAlpha()
    gl.setClearColor(new THREE.Color(0x000000), 0)
    gl.setRenderTarget(renderTarget)
    gl.clear()
    gl.render(scene, camera)
    ;(lens.current.material as any).uTexture = renderTarget.texture

    modelRefs.current.forEach((mesh: THREE.Mesh, i: number) => {
      if (!mesh || !savedMaterials[i]) return
      mesh.material = savedMaterials[i]
    })
    hidden.forEach((obj) => (obj.visible = true))
    gl.setClearColor(prevClearColor, prevClearAlpha)
    gl.setRenderTarget(null)
  })

  useEffect(() => {
    if (!lens.current) return
    lens.current.scale.set(0, 0, 0)

    if (progress > 99) {
      animate(0, 1, {
        duration: 0.8,
        delay: 0.5,
        ease: "backOut",
        onUpdate: (value) => {
          lens.current.scale.set(value, value, value)
        },
      })
    }
  }, [progress])

  return (
    <mesh ref={lens} position={[0, 0, 2]} scale={0}>
      <planeGeometry args={[LENS_WIDTH, LENS_HEIGHT]} />
      {/* @ts-ignore */}
      <lensMaterial
        key={LensMaterial.key}
        uTexture={renderTarget.texture}
        uResolution={[
          size.width * gl.getPixelRatio(),
          size.height * gl.getPixelRatio(),
        ]}
        uAspect={LENS_HEIGHT / LENS_WIDTH}
      />
    </mesh>
  )
}

export default Lens
