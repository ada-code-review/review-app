import withFirebaseAuth, { WrappedComponentProps } from 'react-with-firebase-auth'
import styled from '@emotion/styled';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import * as firebase from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import React from 'react';
import { Nav } from './NavBar';
import { SignInPage } from './SignInPage';
import { FeedbackPage } from './FeedbackPage';
import { ListPage } from './ListPage';
import { UnauthorizedPage } from './UnauthorizedPage';
import { fonts } from './designTokens';

import { useUserStore, UserState, Credentials, UserRole, isSignedIn } from './stores/UserStore';
import { fetchFromGithub, RequestError } from './fetchFromGithub';
import { VOLUNTEER_TEAM_ID, INSTRUCTOR_TEAM_ID } from './constants';

const firebaseApp = firebase.initializeApp(firebaseConfig);

const Root = styled(`div`)({
  fontFamily: fonts.openSans,
  display: `flex`,
  flexDirection: `column`,
  minHeight: `100vh`,
});

interface AppProps extends WrappedComponentProps {
  signInWithGithub: () => Promise<{ user: firebase.User, credential: Credentials }>,
}

const RedirectToHomePage = () => (
  <Redirect to='/'/>
);

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

const App: React.FC<AppProps> = ({ signOut, signInWithGithub }) => {
  const userStore: UserState = useUserStore();

  function signIn() {
    return signInWithGithub()
      .then(({user, credential}) => {
        fetchFromGithub<UserData>(`user`, undefined, credential.accessToken)
          .then((userData) => {
            const username = userData.login;
            getUserRole(username, credential.accessToken)
              .then((role) => {
                userStore.signIn({
                  username,
                  user,
                  credentials: credential,
                  role,
                });
              });
          });
      });
  }

  function signOutUser() {
    userStore.signOut();
    signOut();
  }

  function getContents() {
    if (!isSignedIn(userStore)) {
      return <SignInPage signIn={signIn}/>
    }
    if (userStore.role === `unauthorized`) {
      return <UnauthorizedPage />;
    }
    return (
      <Switch>
        <Route path='/' exact component={ListPage}/>
        <Route path='/feedback/:id' component={FeedbackPage}/>
        <Route component={RedirectToHomePage}/>
      </Switch>
    );
  }

  return (
    <Router>
      <Root>
        <Nav signOut={signOutUser}/>
        {getContents()}
      </Root>
    </Router>
  );
}

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  githubProvider: new firebase.auth.GithubAuthProvider(),
};

providers.githubProvider.addScope(`user`);
providers.githubProvider.addScope(`repo`);
providers.githubProvider.addScope(`read:org`);

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App as any);
