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

import { useUserStore, UserState, getIsSignedIn, Credentials } from './stores/UserStore';
import { Main, BodyText } from './sharedStyleComponents';
import { useManageUser } from './stores/useManageUser';

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

const App: React.FC<AppProps> = ({
  user,
  signOut: firebaseSignOut,
  signInWithGithub: firebaseGithubSignIn,
}) => {
  const { signOut, signIn } = useManageUser({ user, firebaseSignOut, firebaseGithubSignIn });
  const userStore: UserState = useUserStore();

  function getContents() {
    if (userStore.isLoading) {
      return <Main><BodyText>Loading...</BodyText></Main>
    }
    if (!getIsSignedIn(userStore)) {
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
        <Nav signOut={signOut}/>
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
