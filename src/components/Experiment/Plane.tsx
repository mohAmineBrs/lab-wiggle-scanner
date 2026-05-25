import { useEffect, useRef, useState } from "react"
//@ts-ignore
import { WiggleBone } from "wiggle"
import * as THREE from "three"
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

import { PlaneMaterial } from "./PlaneMaterial"

import model from "./assets/models/rigged-plane.glb"

const Plane = ({ bgColor, index }: { bgColor: string; index: number }) => {
  //@ts-ignore
  const { scene } = useGLTF(model)
  const skinnedMesh = useRef<any>(null!)
  const rootBone = useRef<any>(null!)
  const wiggleBones = useRef<any[]>([])
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group
    const nodes: { [key: string]: any } = {}

    clone.traverse((obj: any) => {
      nodes[obj.name] = obj
    })

    const mesh = nodes["Plane"] as THREE.SkinnedMesh
    mesh.userData.isPlane = true
    skinnedMesh.current = mesh
    clone.scale.set(1, 1.2, 1)
    clone.position.set(0, 0, -0.35)

    const material = new PlaneMaterial()
    material.uColor = new THREE.Color(bgColor)
    material.transparent = true
    material.side = THREE.DoubleSide

    mesh.material = material

    mesh.skeleton.bones.forEach((bone: any) => {
      if (!bone.parent.isBone) {
        rootBone.current = bone
      } else {
        const wiggleBone = new WiggleBone(bone, { velocity: 0.55 })
        wiggleBones.current.push(wiggleBone)
      }
    })

    setClonedScene(clone)

    return () => {
      wiggleBones.current.forEach((wb: any) => wb.dispose())
      wiggleBones.current = []
    }
  }, [scene])

  useFrame((_, delta) => {
    if (!clonedScene) return
    const clampedDelta = Math.min(delta, 1 / 30)
    wiggleBones.current.forEach((wb: any) => wb.update(clampedDelta))
  })

  if (!clonedScene) return null

  return <primitive object={clonedScene} />
}

export default Plane
