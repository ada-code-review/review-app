import { userStoreApi } from './stores/UserStore';
import { useState, useEffect } from "react";
import { GITHUB_BASE_URL } from './constants';

export interface RequestError {
    statusCode: number,
    statusText: string,
    body: {
        message: string,
        documentation_url: string,
    } | null,
}

function fetchFromGithub<T>(url: string, options?: RequestInit, accessToken?: String) {
    options = options || {};
    options.headers = {
        ...options.headers,
        authorization: `Bearer ${accessToken || userStoreApi.getState().accessToken}`
    };
    url = url.indexOf('https') === 0 ? url : GITHUB_BASE_URL + url;

    // TODO: if the endpoint returns a non-200, this will return the error response
    // instead of throwing
    return fetch(url, options)
        .then((response) => {
            return response.json()
                .then((responseBody) => {
                    if (response.ok) {
                        return responseBody as T;
                    }
                    // Successfully parsed the response body into JSON, but the
                    // network request did not return a 2xx
                    throw ({
                        statusCode: response.status,
                        statusText: response.statusText,
                        body: responseBody,
                    });
                })
                .catch((error) => {
                    // make sure we don't catch the error thrown above!
                    if (error && error.statusCode) {
                        throw error;
                    }
                    // Failed to parse the response body, report error without a body
                    throw ({
                        statusCode: response.status,
                        statusText: response.statusText,
                        body: null,
                    });
                });
        });
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
    const [data, setDataState] = useState<T>();
    const [error, setErrorState] = useState<Error | RequestError>();
    const [isLoading, setIsLoadingState] = useState(true);
    useEffect(
        () => {
            setIsLoadingState(true);
            fetchFromGithub<T>(url, options)
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

function useFetchText(url: string, options?: RequestInit) {
    const [data, setDataState] = useState< string | undefined >(undefined);
    const [error, setErrorState] = useState< string | undefined > (undefined);
    const [isLoading, setIsLoadingState] = useState(true);

    useEffect(
        () => {
            setIsLoadingState(true);
            fetch(url, options)
            .then(response => response.text())
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
    useFetchText,
}