import { useRef, useCallback, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

import Plane from "./Plane"

import model1 from "./assets/models/rigged-croissant.glb"
import model2 from "./assets/models/rigged-fish.glb"
import model3 from "./assets/models/rigged-hotdog.glb"
import model4 from "./assets/models/rigged-mushroom.glb"
import model5 from "./assets/models/rigged-pizza.glb"
import model6 from "./assets/models/rigged-icecream.glb"
import model7 from "./assets/models/rigged-turnip.glb"
import model8 from "./assets/models/rigged-meat.glb"
import model9 from "./assets/models/rigged-fruitice.glb"

import Model from "./Model"
import Lens from "./Lens"

const dataArray = [
  { color: "#c8a96e", model: model1 },
  { color: "#4a9eff", model: model2 },
  { color: "#d4522a", model: model3 },
  { color: "#e1ad2b", model: model4 },
  { color: "#ff6b35", model: model5 },
  { color: "#a8e6cf", model: model6 },
  { color: "#4caf50", model: model7 },
  { color: "#8b4513", model: model8 },
  { color: "#ff9de2", model: model9 },
]
const COUNT = dataArray.length

const SPACING = 3.3
const TOTAL_WIDTH = COUNT * SPACING
const CIRCLE_RADIUS = 10
const CIRCLE_CENTER_Y = -10
const AUTO_SPEED = 0.25

function Card({
  index,
  bgColor,
  model,
  offsetRef,
  modelRefs,
}: {
  index: number
  bgColor: string
  model: string
  offsetRef: React.RefObject<number>
  modelRefs: React.RefObject<THREE.Mesh[]>
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    let rawPos = index * SPACING - offsetRef.current
    while (rawPos < -TOTAL_WIDTH / 2) rawPos += TOTAL_WIDTH
    while (rawPos > TOTAL_WIDTH / 2) rawPos -= TOTAL_WIDTH

    const angle = rawPos / CIRCLE_RADIUS

    const x = Math.sin(angle) * CIRCLE_RADIUS
    const y =
      CIRCLE_CENTER_Y +
      Math.cos(angle) * CIRCLE_RADIUS +
      Math.sin(time * 0.8 + index * 0.25) * 0.04

    meshRef.current.position.set(x, y, 0)

    const scaleFactor = Math.max(0.3, Math.exp(-Math.pow(angle, 2) * 0.6))

    meshRef.current.scale.setScalar(1.2 * scaleFactor)
  })

  return (
    <group ref={meshRef} scale={1.2}>
      <Plane bgColor={bgColor} index={index} />
      <Model url={model} modelRefs={modelRefs} cardIndex={index} />
    </group>
  )
}

const Slider = () => {
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const isDragging = useRef(false)
  const lastPointerX = useRef(0)
  const autoSpeedRef = useRef(AUTO_SPEED)

  const modelRefs = useRef<THREE.Mesh[]>(Array(COUNT).fill(null))

  const { viewport } = useThree()

  useEffect(() => {
    const onScroll = (e: WheelEvent) => {
      velocityRef.current -= e.deltaY * 0.0005
      autoSpeedRef.current = 0
      autoSpeedRef.current = AUTO_SPEED
    }
    window.addEventListener("wheel", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel", onScroll)
    }
  }, [])

  const handlePointerDown = useCallback((e: PointerEvent) => {
    e.stopPropagation()
    isDragging.current = true
    lastPointerX.current = e.clientX ?? 0
    autoSpeedRef.current = 0
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current) return
    const clientX = e.clientX ?? 0
    const delta = clientX - lastPointerX.current
    velocityRef.current = -delta * 0.015
    lastPointerX.current = clientX
  }, [])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    autoSpeedRef.current = AUTO_SPEED
  }, [])

  useFrame((_, delta) => {
    const dt = Math.max(delta, 0.05)
    if (!isDragging.current) {
      velocityRef.current +=
        (-autoSpeedRef.current * dt - velocityRef.current) * 0.05
    }
    offsetRef.current += velocityRef.current
    if (!isDragging.current) velocityRef.current *= 0.98
    offsetRef.current =
      ((offsetRef.current % TOTAL_WIDTH) + TOTAL_WIDTH) % TOTAL_WIDTH
  })

  return (
    <group position={[0, 0, 1]}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        visible={false}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Lens modelRefs={modelRefs} />

      {dataArray.map((item, i) => (
        <Card
          key={i}
          index={i}
          bgColor={item.color}
          model={item.model}
          offsetRef={offsetRef}
          modelRefs={modelRefs}
        />
      ))}
    </group>
  )
}

export default Slider
