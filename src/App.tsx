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
import { fonts } from './designTokens';

import { useUserStore, UserState, Credentials, UserRole } from './stores/UserStore';

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

function retrieveUserRole(credential: Credentials) {
  // mocked for now
  return new Promise<UserRole>((resolve) => {
    setTimeout(() => {
      resolve(`volunteers`);
    }, 1000);
  });
}

const App: React.FC<AppProps> = ({ signOut, signInWithGithub }) => {
  const userStore: UserState = useUserStore();

  function signIn() {
    return signInWithGithub()
      .then(({user, credential}) => {
        retrieveUserRole(credential).then((role) => {
          userStore.signIn({
            user,
            credentials: credential,
            role,
          });
        });
      });
  }

  function signOutUser() {
    userStore.signOut();
  }

  return (
    <Router>
      <Root>
        <Nav signOut={signOutUser}/>
          {userStore.user ? (
            <Switch>
              <Route path='/' exact component={ListPage}/>
              <Route path='/feedback/:id' component={FeedbackPage}/>
              <Route component={RedirectToHomePage}/>
            </Switch>
          ): (
            <SignInPage signIn={signIn}/>
          )}
      </Root>
    </Router>
  );
}

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  githubProvider: new firebase.auth.GithubAuthProvider(),
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App as any);
