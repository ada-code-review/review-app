import React from 'react';
import styled from '@emotion/styled';
import { colors, fonts } from './designTokens';
import { Header1, Header3, BodyText, Main, BodyTextLink } from './sharedStyleComponents';
import GithubLogo from './github-logo.svg';
import { Spacer } from './Spacer';

const Root = styled(`div`)({
    textAlign: `center`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `space-between`,
    flexGrow: 1,
});

const StyledMain = styled(Main)({
    display: `flex`,
    alignItems: `center`,
    flexGrow: 1,
});

const MaxPageWidthSection = styled(`div`)({
    maxWidth: 700,
    marginLeft: `auto`,
    marginRight: `auto`,
});

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
    ':active': {
        backgroundColor: colors.tealDark,
    }
});

const ButtonLogo = styled(`img`)({
    marginRight: `.5em`,
});

const Footer = styled(`footer`)({
    width: `100%`,
    backgroundColor: colors.gray10,
    paddingTop: 55,
    paddingBottom: 100,
});

const FooterHeader = styled(Header3)({
    color: colors.teal100,
});

// TODO: make these links go somewhere
export const SignInPage = ({ signIn }: {signIn: () => void }) => (
  <Root>
    <StyledMain>
        <MaxPageWidthSection>
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
        </MaxPageWidthSection>
    </StyledMain>
    <Footer>
        <MaxPageWidthSection>
            <FooterHeader>Interested in volunteering?</FooterHeader>
            <BodyText>
                If you’re not currently apart of our volunteer program but would like to join,
                or if you know someone else who would be a great match, <BodyTextLink>reach out to learn more</BodyTextLink>.
            </BodyText>
        </MaxPageWidthSection>
    </Footer>
  </Root>
);
