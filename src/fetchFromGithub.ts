import { userStoreApi } from './stores/UserStore';
import { useState, useEffect } from "react";
import { GITHUB_BASE_URL } from './constants';

function fetchFromGithub(url: string, options?: RequestInit) {
    options = options || {};
    options.headers = {
        ...options.headers,
        authorization: `Bearer ${userStoreApi.getState().accessToken}`
    };

    return fetch(GITHUB_BASE_URL + url, options).then((response => response.json()));
};

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

function useFetchFromGithub<T>(url: string, options?: RequestInit) {
    const [data, setDataState] = useState< T | undefined >(undefined);
    const [error, setErrorState] = useState< string | undefined > (undefined);
    const [isLoading, setIsLoadingState] = useState(true);
    useEffect(
        () => {
            setIsLoadingState(true);
            fetchFromGithub(url, options)
            .then(data => {
                setDataState(data);
                setErrorState(undefined);
            })
            .catch(error => {
                setDataState(undefined);
                setErrorState(error);
            })
            .finally(() => {
                setIsLoadingState(false);
            })
        },
        [url, options]
    );
    return { data, error, isLoading };
}

export {
    fetchFromGithub,
    formatSearchQuery,
    useFetchFromGithub,
}