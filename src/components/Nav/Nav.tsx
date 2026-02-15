import clsx from "clsx"

import useUIStore from "@/store"

import Info from "@/assets/svgs/info.svg?react"
import Site from "@/assets/svgs/site.svg?react"
import LinkedIn from "@/assets/svgs/linkedin.svg?react"
import Github from "@/assets/svgs/github.svg?react"
import Code from "@/assets/svgs/code.svg?react"

import s from "./Nav.module.css"

const Nav = () => {
  const setOpenInfo = useUIStore((s) => s.setOpenInfo)
  const openInfo = useUIStore((s) => s.openInfo)

  return (
    <div className={s.wrapper}>
      <ul className={s.list}>
        <li className={clsx(s.item, { [s.openInfo]: openInfo })}>
          <a onClick={() => setOpenInfo(!openInfo)}>
            <Info />
          </a>
        </li>
        <li className={s.item}>
          <a href="https://mooh.dev" target="_blank">
            <Site />
          </a>
        </li>
        <li className={s.item}>
          <a href="https://www.linkedin.com/in/moohdev/" target="_blank">
            <LinkedIn />
          </a>
        </li>
        <li className={s.item}>
          <a href="https://github.com/mohAmineBrs" target="_blank">
            <Github />
          </a>
        </li>
        <li className={s.item}>
          <a
            href="https://github.com/mohAmineBrs/lab-boilerplate"
            target="_blank"
          >
            <Code />
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Nav
