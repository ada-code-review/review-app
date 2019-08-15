import withFirebaseAuth, { WrappedComponentProps } from 'react-with-firebase-auth'
import styled from '@emotion/styled';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import React from 'react';
import BrandLogo from './ada-logo-white.svg';

import { useUserStore, UserState } from './stores/UserStore';


const firebaseApp = firebase.initializeApp(firebaseConfig);

const Root = styled(`div`)({
  fontFamily: `Open Sans, sans-serif`,
});

interface Credential {
  accessToken: string,
}

interface AppProps extends WrappedComponentProps {
  signInWithGithub: () => Promise<{ user: firebase.User, credential: Credential }>,
}

const NavContainer = styled(`div`)({
  backgroundColor: `#5A848D`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
  height: 90,
  color: `white`,
  paddingLeft: 50,
  paddingRight: 50,
});

const Nav = ({ signOut }: { signOut: () => void }) => {
  const user = useUserStore((state) => state.user)
  const firstName = user && user.displayName!.split(` `)[0];
  return (
    <NavContainer>
      <a href='https://adadevelopersacademy.org'>
        <img src={BrandLogo} height={50} width={250}/>
      </a>
      <div></div>{user && <div>Hi, {firstName} <button onClick={signOut}>Sign out</button></div>}
    </NavContainer>
  );
};

const SignInPage = ({ signIn }: {signIn: () => void }) => (
  <div>
    <p>Please sign in.</p>
    <button onClick={signIn}>Sign in with Github</button>
  </div>
);

const MainPage = () => (
  <div>
    This is the main page
  </div>
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
    <Root>
      <Router>
        <Nav signOut={signOutUser}/>
        {userStore.user ? (
          <Switch>
            <Route render={() => <MainPage />}/>
          </Switch>
        ): (
          <SignInPage signIn={signIn}/>
        )}
      </Router>
    </Root>
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
