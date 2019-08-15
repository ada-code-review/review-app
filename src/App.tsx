import withFirebaseAuth, { WrappedComponentProps } from 'react-with-firebase-auth'
import styled from '@emotion/styled';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import React from 'react';
import BrandLogo from './ada-logo-white.svg';


const firebaseApp = firebase.initializeApp(firebaseConfig);

const Root = styled(`div`)({

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
});

const Nav = ({ userName, signOut }: { userName: string | null, signOut: () => void }) => {
  return (
    <NavContainer>
      <a href='https://adadevelopersacademy.org'>
        <img src={BrandLogo} height={50} width={250}/>
      </a>
      <div></div>{userName && <div>Hi, {userName.split(` `)[0]} <button onClick={signOut}>Sign out</button></div>}
    </NavContainer>
  );
};

const SignInPage = ({ signIn }: {signIn: () => void }) => (
  <div>
    <p>Please sign in.</p>
    <button onClick={signIn}>Sign in with Github</button>
  </div>
);

const MainPage = ({ user, credential }: {
  user?: firebase.User,
  credential: Credential | null,
}) => (
  <div>This is the main page</div>
)

const App: React.FC<AppProps> = ({ user, signOut, signInWithGithub }) => {
  const [credential, setCredential] = React.useState<Credential | null>(null);
  function signIn() {
    return signInWithGithub()
      .then(({user, credential}) => {
        setCredential(credential);
      });
  }

  function signOutUser() {
    signOut();
    setCredential(null);
  }

  return (
    <Root>
      <Router>
        <Nav userName={user ? user.displayName : null} signOut={signOutUser}/>
        {user ? (
          <Switch>
            <Route render={() => <MainPage user={user} credential={credential} />}/>
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
