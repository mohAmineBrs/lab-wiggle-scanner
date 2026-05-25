import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Environment, Loader, Preload } from "@react-three/drei"

import Slider from "./Slider"

const Experiment = ({
  eventSource,
}: {
  eventSource: React.RefObject<HTMLDivElement>
}) => {
  return (
    <div className="canvas">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        eventSource={eventSource}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <Slider />
          <Environment preset="warehouse" />
          <Preload all />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}

export default Experiment
