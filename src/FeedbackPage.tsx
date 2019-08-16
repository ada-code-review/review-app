import { RouteComponentProps } from 'react-router-dom';
import React from 'react';
import { Main } from './sharedStyleComponents';

interface FeedbackPageParams {
  id: string,
}

interface FeedbackPageProps extends RouteComponentProps<FeedbackPageParams> {

}

// TODO: fill out this page
export const FeedbackPage: React.FC<FeedbackPageProps> = ({ match }) => (
  <Main>This is the feedback page for PR: {match.params.id}</Main>
);
