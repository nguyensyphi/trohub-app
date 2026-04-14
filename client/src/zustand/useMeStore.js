// import { apiGetMe } from "@/apis/user"
import { apiGetMe } from "@/apis/user"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useMeStore = create(
  persist(
    (set) => ({
      token: null,
      me: null,
      googleData: null,
      setToken: (token) => set(() => ({ token })),
      setMe: (me) => set(() => ({ me })),
      setGoogleData: (googleData) => set(() => ({ googleData })),
      setIsRemember: (status) => set(() => ({ isRemember: status })),
      getMe: async () => {
        try {
          const response = await apiGetMe()
          if (response.data.success) return set(() => ({ me: response.data.user }))
          return set(() => ({ me: null }))
        } catch (error) {
          console.log(error)
          return set(() => ({ me: null }))
        }
      },
      logout: () => set(() => ({ token: null, me: null })),
    }),
    {
      name: "trohub/me",
      storage: createJSONStorage(() => localStorage),
      // Return object of states, want save
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter((el) => el[0] === "token" || el[0] === "me")),
    }
  )
)
