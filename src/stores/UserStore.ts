import create from 'zustand'
import { User } from 'firebase';

export interface Credentials {
    accessToken: String
}

export interface UserState {
    accessToken?: String,
    user?: User,
    signIn: (user: User, credentials: Credentials) => void,
    signOut: () => void,
}

const initialState = {
    accessToken: undefined,
    user: undefined,
} as const;

const [useUserStore, userStoreApi] = create<UserState>((set, _get) => ({
  ...initialState,
  signIn: (user, credentials) => set(state => ({...state, user, accessToken: credentials.accessToken})),
  signOut: () => set(state => ({...state, ...initialState})),
}));

const isSignedIn = (state: UserState) => !!state.accessToken

export {
    useUserStore,
    userStoreApi,
    isSignedIn,
};