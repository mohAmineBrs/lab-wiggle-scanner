import { Canvas } from "@react-three/fiber"

const Experiment = ({
  eventSource,
}: {
  eventSource: React.RefObject<HTMLDivElement>
}) => {
  return (
    <div className="canvas">
      <Canvas
        dpr={[1, 2]}
        eventSource={eventSource}
        eventPrefix="client"
        flat
      ></Canvas>
    </div>
  )
}

export default Experiment
