import create from 'zustand'
import { User } from 'firebase';

export type UserRole = 'instructors' | 'volunteers' | 'unauthorized';

export interface Credentials {
    accessToken: String
}

export interface UserState {
    isLoading: boolean,
    accessToken: String | null,
    username: string | null,
    user: User | null,
    loadComplete: () => void,
    startLoad: () => void,
    signIn: (args: { user: User, accessToken: String, role: UserRole, username: string }) => void,
    signOut: () => void,
    role: UserRole | null,
}

const initialState = {
    isLoading: true,
    accessToken: null,
    username: null,
    user: null,
    role: null,
} as const;

const [useUserStore, userStoreApi] = create<UserState>((set, _get) => ({
  ...initialState,
  startLoad: () => set(state => ({ ...state, isLoading: true })),
  loadComplete: () => set(state => ({ ...state, isLoading: false })),
  signIn: ({ user, accessToken, role, username }) => set(state => ({
      ...state,
      user,
      username,
      accessToken: accessToken,
      role,
      isLoading: false,
    })),
  signOut: () => set(state => ({...state, ...initialState, isLoading: false })),
}));

const getIsSignedIn = (state: UserState) => !!state.accessToken

export {
    useUserStore,
    userStoreApi,
    getIsSignedIn,
};