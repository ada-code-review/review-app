import React from 'react';
import { useUserStore, UserState } from './stores/UserStore';

export const ListPage = () => {
    const userStore: UserState = useUserStore();
    const role = userStore.role;
    return <div>This is the list page for the "{role}" role</div>
};
