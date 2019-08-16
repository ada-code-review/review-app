import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import BrandLogo from './ada-logo-white.svg';
import { useUserStore } from './stores/UserStore';
import { colors } from './designTokens';
import { InlineSpacer } from './Spacer';

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

const SignOutButton = styled(`button`)({
  cursor: `pointer`,
  border: `none`,
  backgroundColor: `transparent`,
  color: colors.white,
  fontSize: 16,
  padding: 0,
});

const UserTile = ({ userName, signOut }: { userName: string | null, signOut: () => void }) => {
  const firstName = userName ? userName.split(` `)[0] : ``;
  return (
    <div>
      Hi {firstName}
      <InlineSpacer width='.5em'/>|<InlineSpacer width='.5em'/>
      <SignOutButton onClick={signOut}>Log out</SignOutButton>
    </div>
  );
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
