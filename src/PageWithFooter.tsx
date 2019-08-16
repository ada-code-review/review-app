import React from 'react';
import styled from '@emotion/styled';
import { colors, fonts } from './designTokens';
import { Header3, BodyText, Main, BodyTextLink } from './sharedStyleComponents';

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

const Footer = styled(`footer`)({
    width: `100%`,
    backgroundColor: colors.gray10,
    paddingTop: 55,
    paddingBottom: 100,
});

const FooterHeader = styled(Header3)({
    color: colors.teal100,
});

export const PageWithFooter: React.FC = ({ children }) => (
    <Root>
        <StyledMain>
            <MaxPageWidthSection>
                {children}
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
