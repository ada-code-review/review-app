import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import BrandLogo from './ada-logo-white.svg';
import { useUserStore } from './stores/UserStore';

const NavContainer = styled(`nav`)({
  backgroundColor: `#5A848D`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
  height: 90,
  color: `white`,
  paddingLeft: 50,
  paddingRight: 50,
});

const UserTile = ({ userName, signOut }: { userName: string | null, signOut: () => void }) => {
  const firstName = userName ? userName.split(` `)[0] : ``;
  return <div>Hi {firstName} <button onClick={signOut}>Sign out</button></div>
}

export const Nav = ({ signOut }: { signOut: () => void }) => {
  const user = useUserStore((state) => state.user);
  return (
    <NavContainer>
      <Link to='/'>
        <img src={BrandLogo} height={50} width={250}/>
      </Link>
      {user && <UserTile userName={user.displayName} signOut={signOut}/>}
    </NavContainer>
  );
};
