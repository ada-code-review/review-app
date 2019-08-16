import * as firebase from 'firebase/app';
import React from 'react';

import { useUserStore, UserState, Credentials, UserRole, getIsSignedIn } from './UserStore';
import { fetchFromGithub, RequestError } from '../fetchFromGithub';
import { VOLUNTEER_TEAM_ID, INSTRUCTOR_TEAM_ID } from '../constants';

interface UserData {
  login: string,
}

interface MembershipInfo {
  url: string,
  role: 'maintainer' | 'member',
  state: 'active' | 'pending',
}

function catch404(e: Error | RequestError) {
  if (e && (e as RequestError).statusCode === 404) {
    return null;
  }
  throw e;
}

function getUserRole(username: string, accessToken?: String) {
  return Promise.all([
    fetchFromGithub<MembershipInfo>(`teams/${VOLUNTEER_TEAM_ID}/memberships/${username}`, undefined, accessToken)
      .catch(catch404),
    fetchFromGithub<MembershipInfo>(`teams/${INSTRUCTOR_TEAM_ID}/memberships/${username}`, undefined, accessToken)
    .catch(catch404),
  ]).then(([volunteerMembershipInfo, instructorMembershipInfo]) => {
    let role: UserRole = `unauthorized`;
    if (volunteerMembershipInfo) {
      role = `volunteers`;
    }
    if (instructorMembershipInfo) {
      role = `instructors`;
    }
    return role;
  });
}

export function useManageUser({ user, firebaseSignOut, firebaseGithubSignIn }: {
  user?: firebase.User | null,
  firebaseSignOut: () => void,
  firebaseGithubSignIn: () => Promise<{ user: firebase.User, credential: Credentials }>,
}) {
  const userStore: UserState = useUserStore();

  React.useEffect(() => {
    const accessToken = localStorage.getItem(`accessToken`);
    if (!getIsSignedIn(userStore) && user && accessToken) {
      signInWithUserData(user, accessToken);
    }
    else if (userStore.isLoading && (user !== undefined)) {
      userStore.loadComplete();
    }
  }, [user]);

  function signInWithUserData(user: firebase.User, accessToken: String) {
    userStore.startLoad();
        fetchFromGithub<UserData>(`user`, undefined, accessToken)
          .then((userData) => {
            const username = userData.login;
            getUserRole(username, accessToken)
              .then((role) => {
                localStorage.setItem(`accessToken`, accessToken.toString());
                userStore.signIn({
                  username,
                  user,
                  accessToken: accessToken,
                  role,
                });
              });
          });
  }

  function signOutUser() {
    localStorage.removeItem(`accessToken`);
    userStore.signOut();
    firebaseSignOut();
  }

  function signInViaGithub() {
    return firebaseGithubSignIn()
      .then(({user, credential}) => signInWithUserData(user, credential.accessToken));
  }
  return {
    isSignedIn: getIsSignedIn(userStore),
    isLoading: userStore.isLoading,
    role: userStore.role,
    signOut: signOutUser,
    signIn: signInViaGithub,
  }
}
