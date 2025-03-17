import User from './user.interface'

interface UserStore {
  currentUser: User | null
  isUserValid: () => boolean
  setUser: (user: User) => Promise<void>
}
export default UserStore
