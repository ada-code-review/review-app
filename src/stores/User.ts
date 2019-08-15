import create from 'zustand'
import { User } from 'firebase';

interface Credentials {
    accessToken: String
}

export interface UserState {
    accessToken?: String,
    user?: User,
    signIn: (user: User, credentials: Credentials) => void,
}

const [useUserStore, userStoreApi] = create<UserState>((set, _get) => ({
  accessToken: undefined,
  user: undefined,
  signIn: (user, credentials) => set(state => ({...state, user, accessToken: credentials.accessToken})),
}));

const isSignedIn = (state: UserState) => !!state.accessToken

export {
    useUserStore,
    userStoreApi,
    isSignedIn,
};