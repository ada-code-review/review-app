import React from 'react';
import styled from '@emotion/styled';

import { Link } from 'react-router-dom';
import { useUserStore, UserState } from './stores/UserStore';
import { Header1, BodyText, BodyTextLink } from './sharedStyleComponents';
import { formatSearchQuery, useFetchFromGithub } from './fetchFromGithub';
import { GITHUB_ORGS } from './constants';
import { fonts, colors } from './designTokens';

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
    assigneeUsername: string | null,
    submittedDate: Date,
    grade: 'green' | 'yellow' | 'red' | null,
    feedbackCommentHref: string | null,
    submitFeedbackUrl: string,
}

const mockPrListData: PrListData[] = [
    {
        label: `#1 - Pr test`,
        href: `https://github.com/ada-code-review/calculator/pull/1`,
        repo: `Ada-C12/calculator`,
        studentUsername: `laneia`,
        assigneeUsername: `reviewername`,
        submittedDate: new Date(),
        grade: `green`,
        feedbackCommentHref: `https://github.com/ada-code-review/calculator/pull/1#pullrequestreview-275576848`,
        submitFeedbackUrl: `/feedback/12345`,
    },
    {
        label: `#15 - My awesome PR`,
        href: `https://github.com/ada-code-review/calculator/pull/2`,
        repo: `Ada-C12/calculator`,
        studentUsername: `laneia`,
        assigneeUsername: null,
        submittedDate: new Date(),
        grade: null,
        feedbackCommentHref: null,
        submitFeedbackUrl: `/feedback/23456`,
    },
    {
        label: `#3 - Some other PR name`,
        href: `https://github.com/ada-code-review/calculator/pull/3`,
        repo: `Ada-C12/calculator`,
        studentUsername: `laneia`,
        assigneeUsername: `reviewername`,
        submittedDate: new Date(),
        grade: null,
        feedbackCommentHref: null,
        submitFeedbackUrl: `/feedback/34567`,
    },
];

const InstructorListPage = () => (
    <div>
        <Header1>Student Pull Requests</Header1>
    </div>
);

const VolunteerListPage = () => {
    const query = formatSearchQuery({is: 'open', org: GITHUB_ORGS});
    const {data, error, isLoading} = useFetchFromGithub(`search/issues?q=${query}`);

    return (
        <div>
            <Header1>Assigned Pull Requests</Header1>
            <BodyText>
                This view should include some high level information about providing good feedback to the students.
                Things to keep in mind. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. <BodyTextLink>Read more</BodyTextLink>
            </BodyText>
            Open PRs: {isLoading ? '...loading...' : data && data.items.length + " of " + data.total_count}
            <PrListTable prListData={mockPrListData}/>
        </div>
    );
};

interface PrListTableProps {
    prListData: PrListData[],
}

const ListTableRoot = styled(`table`)({
    fontFamily: fonts.openSans,
    borderCollapse: `collapse`,
    width: `100%`,
});

const ListTableHead = styled(`thead`)({
    borderBottom: `3px solid ${colors.teal100}`,
});

const ListTableHeader = styled(`th`)({
    textAlign: `left`,
    fontSize: 14,
    color: colors.teal100,
    fontWeight: `bold`,
    paddingTop: 14,
    paddingBottom: 10,
});

const ListTableCell = styled(`td`)({
    paddingTop: 14,
    paddingBottom: 10,
});

const ListTableBody = styled(`tbody`)({
    textAlign: `left`,
    fontSize: 14,
    color: colors.nearBlack,
});

const TableListRow = styled(`tr`)({
    borderBottom: `1px solid ${colors.teal50}`,
});

const TableLink = styled(`a`)({
    color: colors.pumpkin100,
    textDecoration: `none`,
});

const TableInternalLink = TableLink.withComponent(Link);

const PrListTable: React.FC<PrListTableProps> = ({ prListData }) => (
    <ListTableRoot>
        <ListTableHead>
            <tr>
                <ListTableHeader>Pull Request</ListTableHeader>
                <ListTableHeader>Project Repo</ListTableHeader>
                <ListTableHeader>Student</ListTableHeader>
                <ListTableHeader>Submitted</ListTableHeader>
                <ListTableHeader>Feedback Status</ListTableHeader>
                <ListTableHeader>Grade</ListTableHeader>
            </tr>
        </ListTableHead>
        <ListTableBody>
            {prListData.map((data) => <PrListRow prListData={data} key={data.href}/>)}
        </ListTableBody>
    </ListTableRoot>
);

interface PrListRowProps {
    prListData: PrListData,
}

const PrListRow: React.FC<PrListRowProps> = ({ prListData }) => (
    <TableListRow>
        <ListTableCell><TableLink href={prListData.href}>{prListData.label}</TableLink></ListTableCell>
        <ListTableCell>{prListData.repo}</ListTableCell>
        <ListTableCell>{prListData.studentUsername}</ListTableCell>
        <ListTableCell>{prListData.submittedDate.toLocaleDateString()}</ListTableCell>
        <ListTableCell>
            {prListData.feedbackCommentHref ?
                <TableLink href={prListData.feedbackCommentHref}>View feedback</TableLink> :
                <TableInternalLink to={prListData.submitFeedbackUrl}>Submit feedback</TableInternalLink>
            }
        </ListTableCell>
        <ListTableCell>{prListData.grade}</ListTableCell>
    </TableListRow>
);

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
