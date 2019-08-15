import React, { useEffect } from 'react';
import { useUserStore, UserState } from './stores/UserStore';
import { Header1, BodyText, BodyTextLink } from './sharedStyleComponents';
import { useGithubStore, GithubState } from './stores/GithubStore';

interface PrListDataBackend {
    id: string, // unique PR ID across all of github
    number: number, // PR number for that repo
    title: string, // user defined title of PR
    html_url: string, // URL to actual pull request
    repository_url: string, // https://api.github.com/repos/<org>/<project>
    created_at: string, // 2018 xx xx Z 
    user: {
        login: string, // author's github username
    },
    assignee: {
        login: string, // volunteer's github username (will only show the most recent one)
    } | null

}

interface PrListData {
    label: string,
    href: string,
    repo: string,
    studentUsername: string,
    assigneeUsername: string,
    submittedDate: Date,
    grade: 'green' | 'yellow' | 'red' | null,
    feedbackCommentHref: string | null,
}

const InstructorListPage = () => {
  return (
    <div>
        <Header1>Student Pull Requests</Header1>
    </div>
  )
};

const VolunteerListPage = () => {
    const githubStore: GithubState = useGithubStore();
    useEffect(() => { githubStore.fetchOpenPRs() }, []);

    return (
        <div>
            <Header1>Assigned Pull Requests</Header1>
            <BodyText>
                This view should include some high level information about providing good feedback to the students.
                Things to keep in mind. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. <BodyTextLink>Read more</BodyTextLink>
            </BodyText>
            Open PRs: {githubStore.openPRs.isLoading ? '...loading...' : githubStore.openPRs.data.length}
        </div>
    );
};

export const ListPage = () => {
    const userStore: UserState = useUserStore();
    const role = userStore.role;

    if (role === `instructors`) {
        return <InstructorListPage/>;
    }
    else {
        return <VolunteerListPage/>;
    }
};
