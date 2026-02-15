import { create } from "zustand"

interface IUIStore {
  openInfo: boolean
  setOpenInfo: (openInfo: boolean) => void
}

const useUIStore = create<IUIStore>((set) => ({
  openInfo: false,
  setOpenInfo: (openInfo) => set({ openInfo }),
}))

export default useUIStore
