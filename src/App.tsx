import { useRef } from "react"

import Homepage from "@/components/Homepage"
import Experiment from "@/components/Experiment/Experiment"

import "./App.css"

function App() {
  const eventSource = useRef<HTMLDivElement>(null!)

  return (
    <main ref={eventSource} data-theme="dark">
      <Homepage />
      <Experiment eventSource={eventSource} />
    </main>
  )
}

export default App
