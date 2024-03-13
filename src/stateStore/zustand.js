import {create} from 'zustand';
import UserApi from '../services/user';

const useUserStore = create((set) => ({
  user: null,
  init: async () => {
    try {
      // Fetch the user information from the API
      const response = await UserApi.getUser();
      const user = response.data;

      // Set the user information in the store
      set({ user });
    } catch (error) {
      console.error('Failed to fetch user information:', error);
    }
  },
  setUser: (user) => set((state) => ({ user })),
  editUser: (name) =>
    set((state) => ({ user: { ...state.user, name } })),
  deleteUser: () => set((state) => ({ user: null })),
}));

export default useUserStore;
