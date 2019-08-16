import styled from '@emotion/styled';
import { colors, fonts } from './designTokens';

export const Main = styled(`main`)({
    paddingLeft: 125,
    paddingRight: 125,
    paddingTop: 60,
    paddingBottom: 60,
});

export const Header1 = styled(`h1`)({
    color: colors.nearBlack,
    fontSize: 44,
    lineHeight: 1,
    fontFamily: fonts.georgia,
    fontWeight: `normal`,
});

export const Header3 = styled(`h1`)({
    color: colors.nearBlack,
    fontSize: 30,
    lineHeight: 1,
    fontFamily: fonts.georgia,
    fontWeight: `normal`,
})

export const BodyText = styled(`p`)({
    color: colors.nearBlack,
    fontSize: 16,
    lineHeight: 1.62,
    fontFamily: fonts.openSans,
});

export const BodyTextLink = styled(`a`)({
    color: colors.pumpkin100,
    fontWeight: 600,
    fontFamily: fonts.openSans,
    fontSize: 16,
    lineHeight: 1.62,
    cursor: `pointer`,
    textDecoration: `none`,
});