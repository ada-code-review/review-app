import { userStoreApi } from './UserStore';

const GITHUB_BASE_URL = 'https://api.github.com/';

function formatSearchQuery(params: {[key:string]: string|string[] }) {
    return Object.keys(params).map(key => {
        const value = params[key];
        if (Array.isArray(value)) {
            return value.map(v => `${key}:${v}`).join('+');
        } else {
            return `${key}:${value}`;
        }
    }).join('+');
}

function fetchFromGithub(url: string, options?: RequestInit) {
    console.log("FETCHING", userStoreApi.getState())
    options = options || {};
    options.headers = {
        ...options.headers,
        authorization: `Bearer ${userStoreApi.getState().accessToken}`
    };

    return fetch(GITHUB_BASE_URL+url, options).then((response => response.json()));
};

export {
    fetchFromGithub,
    formatSearchQuery
}