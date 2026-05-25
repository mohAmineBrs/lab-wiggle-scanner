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

const SPACING = 3.2
const TOTAL_WIDTH = COUNT * SPACING
const CURVE_AMPLITUDE = 0.6
const CURVE_WAVES = 2
const CURVE_FREQUENCY = (Math.PI * 2 * CURVE_WAVES) / TOTAL_WIDTH
const AUTO_SPEED = 1

function Card({
  index,
  bgColor,
  model,
  offsetRef,
  velocityRef,
  rotationsRef,
  modelRefs,
}: {
  index: number
  bgColor: string
  model: any
  offsetRef: React.RefObject<number>
  velocityRef: React.RefObject<number>
  rotationsRef: React.RefObject<Float32Array>
  modelRefs: React.RefObject<THREE.Mesh[]>
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    let rawPos = index * SPACING - offsetRef.current
    while (rawPos < -TOTAL_WIDTH / 2) rawPos += TOTAL_WIDTH
    while (rawPos > TOTAL_WIDTH / 2) rawPos -= TOTAL_WIDTH

    const curveY = Math.sin(rawPos * CURVE_FREQUENCY) * CURVE_AMPLITUDE
    const y = curveY + Math.sin(time * 0.8 + index * 0.25) * 0.05

    meshRef.current.position.set(rawPos, y, 0)

    const normalizedDist = Math.abs(rawPos) / (TOTAL_WIDTH / 2)
    const targetRotY =
      Math.sign(rawPos) * Math.PI * 0.5 * Math.min(normalizedDist * 2, 1)

    const lerpSpeed = Math.min(Math.abs(velocityRef.current) * 0.4 + 0.08, 1)
    rotationsRef.current[index] +=
      (targetRotY - rotationsRef.current[index]) * lerpSpeed
  })

  return (
    <group ref={meshRef} scale={1.2}>
      <Plane bgColor={bgColor} index={index} />
      <Model url={model} modelRefs={modelRefs} cardIndex={index} />{" "}
    </group>
  )
}

const Slider = () => {
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const isDragging = useRef(false)
  const lastPointerX = useRef(0)
  const autoSpeedRef = useRef(AUTO_SPEED)
  const rotationsRef = useRef(new Float32Array(COUNT))
  const scrollTimeout = useRef<any>(null)

  const modelRefs = useRef<THREE.Mesh[]>(Array(COUNT).fill(null))

  const { viewport } = useThree()

  useEffect(() => {
    const onScroll = (e: any) => {
      velocityRef.current -= e.deltaY * 0.0005
      autoSpeedRef.current = 0
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        autoSpeedRef.current = AUTO_SPEED
      }, 500)
    }
    window.addEventListener("wheel", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel", onScroll)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [])

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation()
    isDragging.current = true
    lastPointerX.current = e.clientX ?? 0
    autoSpeedRef.current = 0
  }, [])

  const handlePointerMove = useCallback((e: any) => {
    if (!isDragging.current) return
    const clientX = e.clientX ?? 0
    const delta = clientX - lastPointerX.current
    velocityRef.current = -delta * 0.015
    lastPointerX.current = clientX
  }, [])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    setTimeout(() => {
      autoSpeedRef.current = AUTO_SPEED
    }, 500)
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
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
          velocityRef={velocityRef}
          rotationsRef={rotationsRef}
          modelRefs={modelRefs}
        />
      ))}
    </group>
  )
}

export default Slider
