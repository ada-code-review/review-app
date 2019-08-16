import React from 'react';
import { Header1, BodyText, BodyTextLink } from './sharedStyleComponents';
import { PageWithFooter } from './PageWithFooter';

// TODO: make this link do something
export const UnauthorizedPage = () => (
    <PageWithFooter>
          <Header1>Whoops...</Header1>
          <BodyText>
            It looks like you aren’t on our current roster of volunteers.
            If that’s incorrect or you have other questions, please reach
            out and <BodyTextLink>contact an administrator</BodyTextLink>. 
          </BodyText>
    </PageWithFooter>
  );