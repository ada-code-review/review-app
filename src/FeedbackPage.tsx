import { RouteComponentProps } from 'react-router-dom';
import React from 'react';

interface FeedbackPageParams {
  id: string,
}

interface FeedbackPageProps extends RouteComponentProps<FeedbackPageParams> {

}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ match }) => (
  <div>This is the feedback page for PR: {match.params.id}</div>
);
