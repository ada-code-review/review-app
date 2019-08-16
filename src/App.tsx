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
import { fetchFromGithub } from './fetchFromGithub';
import { GITHUB_ROLE_ORGANIZATION } from './constants';

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

interface TeamInfo {
  name: string,
  organization: {
    login: string,
  },
}

function getRole(teams: TeamInfo[]): UserRole {
  // TODO: figure out why user/teams isn't returning all the teams the user is a part of
  return `instructors`;
  // const identifierTeam = teams.find((team) => team.organization.login === GITHUB_ROLE_ORGANIZATION);
  // if (!identifierTeam) {
  //   return `unauthorized`
  // }
  // if (identifierTeam.name === `instructors`) {
  //   return `instructors`;
  // }
  // if (identifierTeam.name === `volunteers`) {
  //   return `volunteers`;
  // }
  // return `unauthorized`;
}

const App: React.FC<AppProps> = ({ signOut, signInWithGithub }) => {
  const userStore: UserState = useUserStore();

  function signIn() {
    return signInWithGithub()
      .then(({user, credential}) => {
        Promise.all([
          fetchFromGithub<UserData>(`user`, undefined, credential.accessToken),
          fetchFromGithub<TeamInfo[]>(`user/teams`, undefined, credential.accessToken),
        ]).then(([userData, teamsData]) => {
          const username = userData.login;
          const role = getRole(teamsData);
          userStore.signIn({
            username,
            user,
            credentials: credential,
            role,
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
        <Route path='/feedback/:org/:repo/:id' component={FeedbackPage}/>
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
