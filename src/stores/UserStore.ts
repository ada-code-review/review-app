import create from 'zustand'
import { User } from 'firebase';

export type UserRole = 'instructors' | 'volunteers' | 'unauthorized';

export interface Credentials {
    accessToken: String
}

export interface UserState {
    accessToken: String | null,
    username: string | null,
    user: User | null,
    signIn: (args: { user: User, credentials: Credentials, role: UserRole, username: string }) => void,
    signOut: () => void,
    role: UserRole | null,
}

const initialState = {
    accessToken: null,
    username: null,
    user: null,
    role: null,
} as const;

const [useUserStore, userStoreApi] = create<UserState>((set, _get) => ({
  ...initialState,
  signIn: ({ user, credentials, role, username }) => set(state => ({
      ...state,
      user,
      username,
      accessToken: credentials.accessToken,
      role,
    })),
  signOut: () => set(state => ({...state, ...initialState})),
}));

const isSignedIn = (state: UserState) => !!state.accessToken

export {
    useUserStore,
    userStoreApi,
    isSignedIn,
};