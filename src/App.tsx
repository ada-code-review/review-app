import withFirebaseAuth, { WrappedComponentProps } from 'react-with-firebase-auth'
import styled from '@emotion/styled';
import { BrowserRouter as Router, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import React from 'react';
import { Nav } from './NavBar';
import { SignInPage } from './SignInPage';
import { FeedbackPage } from './FeedbackPage';
import { ListPage } from './ListPage';

import { useUserStore, UserState } from './stores/UserStore';

const firebaseApp = firebase.initializeApp(firebaseConfig);

const Root = styled(`div`)({
  fontFamily: `Open Sans, sans-serif`,
});

const Main = styled(`main`)({
  paddingLeft: 125,
  paddingRight: 125,
  paddingTop: 60,
  paddingBottom: 60,
});

interface AppProps extends WrappedComponentProps {
  signInWithGithub: () => Promise<{ user: firebase.User, credential: Credential }>,
}

const RedirectToHomePage = () => (
  <Redirect to='/'/>
)

const App: React.FC<AppProps> = ({ signOut, signInWithGithub }) => {
  const userStore: UserState = useUserStore();

  function signIn() {
    return signInWithGithub()
      .then(({user, credential}) => {
        userStore.signIn(user, credential);
      });
  }

  function signOutUser() {
    userStore.signOut();
  }

  return (
    <Router>
      <Root>
        <Nav signOut={signOutUser}/>
        <Main>
          {userStore.user ? (
            <Switch>
              <Route path='/' exact component={ListPage}/>
              <Route path='/feedback/:id' component={FeedbackPage}/>
              <Route component={RedirectToHomePage}/>
            </Switch>
          ): (
            <SignInPage signIn={signIn}/>
          )}
        </Main>
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
