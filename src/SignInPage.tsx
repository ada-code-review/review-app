import React from 'react';
import styled from '@emotion/styled';
import { colors, fonts } from './designTokens';
import { Header1, Header3, BodyText, Main, BodyTextLink } from './sharedStyleComponents';
import GithubLogo from './github-logo.svg';
import { Spacer } from './Spacer';
import { PageWithFooter } from './PageWithFooter';

const SignInButton = styled(`button`)({
    border: `none`,
    borderRadius: 8,
    backgroundColor: colors.teal100,
    color: colors.white,
    fontSize: 18,
    fontWeight: 600,
    fontFamily: fonts.openSans,
    lineHeight: 1.17,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 12,
    paddingBottom: 13,
    cursor: `pointer`,
    display: `inline-flex`,
    alignItems: `center`,
    ':hover': {
        backgroundColor: colors.tealDark,
    }
});

const ButtonLogo = styled(`img`)({
    marginRight: `.5em`,
});

// TODO: make these links go somewhere
export const SignInPage = ({ signIn }: {signIn: () => void }) => (
  <PageWithFooter>
        <Header1>Welcome Volunteers!</Header1>
        <BodyText>
            Volunteers are an important part of our program. Thank you for taking the time
            to participate and to assist our students and faculty.
        </BodyText>
        <Spacer height={15}/>
        <SignInButton onClick={signIn}>
            <ButtonLogo src={GithubLogo}/> Log in with GitHub
        </SignInButton>
        <Spacer height={30}/>
        <BodyText>Trouble logging in? <BodyTextLink>Contact an administrator</BodyTextLink>.</BodyText>
  </PageWithFooter>
);
