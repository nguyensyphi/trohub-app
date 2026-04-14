// import { apiGetMe } from "@/apis/user"
import { create } from "zustand"

export const useSearchStore = create((set, get) => ({
  currentSearchParams: [],
  setCurrentSearchParams: (searchParam) => {
    const { type, isMultiple, value } = searchParam
    const { currentSearchParams } = get()

    if (!value)
      return set(() => ({ currentSearchParams: currentSearchParams.filter((el) => el.type !== type) }))

    let newCurrentSearchParams = currentSearchParams
    if (!isMultiple) {
      const search = currentSearchParams.filter((el) => el.type === type)
      if (!search) newCurrentSearchParams = [...currentSearchParams, searchParam]
      newCurrentSearchParams = [...currentSearchParams.filter((el) => el.type !== type), searchParam]
    }

    return set(() => ({ currentSearchParams: newCurrentSearchParams }))
  },
  resetSearchStore: () => set(() => ({ currentSearchParams: [] })),
}))
