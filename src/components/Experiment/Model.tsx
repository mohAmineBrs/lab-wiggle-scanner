import { useEffect, useRef, useState } from "react"
//@ts-ignore
import { WiggleBone } from "wiggle"
import * as THREE from "three"
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js"

import { useGLTF, useProgress } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { animate } from "framer-motion"

const Model = ({
  url,
  modelRefs,
  cardIndex,
}: {
  url: any
  modelRefs: React.RefObject<THREE.Mesh[]>
  cardIndex: number
}) => {
  //@ts-ignore
  const { scene } = useGLTF(url)
  const skinnedMesh = useRef<any>(null!)
  const rootBone = useRef<any>(null!)
  const wiggleBones = useRef<any[]>([])
  const [clonedScene, setClonedScene] = useState<THREE.Group | null>(null)

  const { progress } = useProgress()

  useEffect(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group
    const nodes: { [key: string]: any } = {}

    clone.traverse((obj: any) => {
      nodes[obj.name] = obj
    })

    const mesh = nodes["model"] as THREE.SkinnedMesh
    skinnedMesh.current = mesh
    modelRefs.current[cardIndex] = mesh

    mesh.skeleton.bones.forEach((bone: any) => {
      if (!bone.parent.isBone) {
        rootBone.current = bone
      } else {
        const wiggleBone = new WiggleBone(bone, { velocity: 0.25 })
        wiggleBones.current.push(wiggleBone)
      }
    })

    setClonedScene(clone)

    return () => {
      wiggleBones.current.forEach((wb: any) => wb.dispose())
      wiggleBones.current = []
    }
  }, [scene])

  useEffect(() => {
    if (!clonedScene) return
    clonedScene.scale.set(0.001, 0.001, 0.001)
    clonedScene.rotation.y = Math.PI / 2
    clonedScene.rotation.z = Math.PI / 2

    if (progress > 99) {
      animate(0.001, 1.2, {
        duration: 0.6,
        delay: 0.1,
        ease: "backOut",
        onUpdate: (value) => {
          clonedScene.scale.set(value, value, value)
        },
      })
      animate(Math.PI / 2, 0, {
        duration: 0.8,
        delay: 0.1,
        ease: "backOut",
        onUpdate: (value) => {
          clonedScene.rotation.y = value
          clonedScene.rotation.z = value
        },
      })
    }
  }, [progress, clonedScene])

  useFrame((_, delta) => {
    if (!clonedScene) return
    const clampedDelta = Math.min(delta, 1 / 30)
    wiggleBones.current.forEach((wb: any) => wb.update(clampedDelta))
  })

  if (!clonedScene) return null

  return <primitive object={clonedScene} />
}

export default Model
