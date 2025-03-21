import { create } from 'zustand'
import UserStore from '../interfaces/user-store.interface'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEY } from '../constants/storage'
import User from '../interfaces/user.interface'

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isUserValid: () => get().currentUser !== null,
      setUser: async (user: User) => set({ currentUser: user }),
      removeUser: () => set({ currentUser: null })
    }),
    {
      name: STORAGE_KEY.USER,
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export { useUserStore }
