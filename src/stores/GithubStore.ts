import create from 'zustand'
import {fetchFromGithub, formatSearchQuery} from './fetchFromGithub'

const GITHUB_ORGS = ['Ada-C4', 'Ada-C5'];

interface ListResource {
    isLoading: boolean,
    data: Array<any>,
    error?: string,
}

export interface GithubState {
    openPRs: ListResource,
    fetchOpenPRs: () => void,
}

const initialState = {
    openPRs: {isLoading: false, data: [], error: undefined},
};

const [useGithubStore, githubStoreApi] = create<GithubState>((set, get) => ({
  ...initialState,
  fetchOpenPRs: async () => {
    if (get().openPRs.isLoading) {
        return;
    }

    set(state => ({openPRs: {...state.openPRs, isLoading: true}}));
    try {
        const query = formatSearchQuery({is: 'open', org: GITHUB_ORGS});
        const response = await fetchFromGithub(`search/issues?q=${query}`)
        set(state => ({openPRs: {...initialState.openPRs, data: response.items}}));
    } catch (error) {
        set(state => ({openPRs: {...initialState.openPRs, error}}));
    }
  }
}));

export {
    useGithubStore,
    githubStoreApi,
};
