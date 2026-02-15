import clsx from "clsx"

import Nav from "@/components/Nav"
import useUIStore from "@/store"

import s from "./Homepage.module.css"

const Homepage = () => {
  const openInfo = useUIStore((s) => s.openInfo)

  return (
    <section className={s.section}>
      <Nav />

      <div className={s.content}>
        <div className={clsx(s.description, { [s.openInfo]: openInfo })}>
          <p>
            Welcome to the lab, these experiments are meticulously crafted by{" "}
            <a href="https://mooh.dev" target="_blank">
              mooh.dev
            </a>
            , including original ideas, inspirations, or pre-existing
            experiments. As a creative developer, I engage in the creation of
            these small-scale experiments, each crafted with precision and
            spontaneity.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Homepage
