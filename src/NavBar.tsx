import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import BrandLogo from './ada-logo-white.svg';
import { useUserStore } from './stores/UserStore';
import { colors } from './designTokens';

const NavContainer = styled(`nav`)({
  backgroundColor: colors.teal100,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
  height: 90,
  color: colors.white,
  paddingLeft: 50,
  paddingRight: 50,
});

// TODO: style the sign out button
const UserTile = ({ userName, signOut }: { userName: string | null, signOut: () => void }) => {
  const firstName = userName ? userName.split(` `)[0] : ``;
  return <div>Hi {firstName} <button onClick={signOut}>Sign out</button></div>
}

export const Nav = ({ signOut }: { signOut: () => void }) => {
  const user = useUserStore((state) => state.user);
  return (
    <NavContainer>
      <Link to='/'>
        <img src={BrandLogo} height={50} width={250} alt='Ada logo'/>
      </Link>
      {user && <UserTile userName={user.displayName} signOut={signOut}/>}
    </NavContainer>
  );
};
