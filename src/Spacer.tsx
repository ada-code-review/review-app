import styled from '@emotion/styled';

export const Spacer = styled(`div`)<{ height?: number | string, width?: number | string }>(({ height, width }) => ({
    height: height || 0,
    width: width || 0,
}));
