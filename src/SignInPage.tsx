import React from 'react';

export const SignInPage = ({ signIn }: {signIn: () => void }) => (
  <div>
    <p>Please sign in.</p>
    <button onClick={signIn}>Sign in with Github</button>
  </div>
);
