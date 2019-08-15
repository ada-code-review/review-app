import withFirebaseAuth from 'react-with-firebase-auth'
import styled from '@emotion/styled';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import React from 'react';
import logo from './logo.svg';

const firebaseApp = firebase.initializeApp(firebaseConfig);

const Root = styled(`div`)({
  textAlign: `center`,
});

const Header = styled(`header`)({
  backgroundColor: `#282c34`,
  minHeight: `100vh`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
  justifyContent: `center`,
  fontSize: `calc(10px + 2vmin)`,
  color: `white`,
});

const Logo = styled(`img`)({
  height: `40vmin`,
  pointerEvents: `none`,
});

interface AppProps {
  user?: firebase.User,
  signOut: () => void,
  signInWithGithub: () => void,
}

const App: React.FC<AppProps> = ({ user, signOut, signInWithGithub }) => (
  <Root>
    <Header>
      <Logo src={logo} alt="logo" />
      {
        user 
          ? <p>Hello, {user.displayName}</p>
          : <p>Please sign in.</p>
      }
      {
        user
          ? <button onClick={signOut}>Sign out</button>
          : <button onClick={signInWithGithub}>Sign in with Github</button>
      }
    </Header>
  </Root>
);

const firebaseAppAuth = firebaseApp.auth();
const providers = {
  githubProvider: new firebase.auth.GithubAuthProvider(),
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
