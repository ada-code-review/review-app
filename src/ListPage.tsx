import React from 'react';
import styled from '@emotion/styled';

import { Link } from 'react-router-dom';
import { useUserStore, UserState } from './stores/UserStore';
import { Header1, BodyText, BodyTextLink, Main } from './sharedStyleComponents';
import { formatSearchQuery, useFetchFromGithub } from './fetchFromGithub';
import { useFetchFromFirebase, GradeData, Grade, AllGradeData } from './fetchFromFirebase';
import { GITHUB_ORGS } from './constants';
import { fonts, colors } from './designTokens';

interface ListFetchData {
    total_count: number,
    incomplete_results: boolean,
    items: PrItemBackend[],
}

interface PrItemBackend {
    id: number, // unique PR ID across all of github
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

function filterByAssignee(username: string, prListItems: PrItemBackend[]): PrItemBackend[] {
    // return prListItems.filter((item) => !!item.assignee && item.assignee.login === username);
    return prListItems;
}

function convertToPrListItem(prListItems: PrItemBackend[], grades: AllGradeData, setGrade: (prId: number, grade: GradeData) => void): PrListItem[] {
    return prListItems.map((backendItem) => {
        const repoUrl = new URL(backendItem.repository_url);
        const gradeData = grades[backendItem.id] || null;
        const updateGrade = (newGrade: Grade) => {
            setGrade(backendItem.id, {
                grade: newGrade,
                commentUrl: null,
            });
        }
        return {
            label: `${backendItem.number}-${backendItem.title}`,
            href: backendItem.html_url,
            repo: repoUrl.pathname.replace(`/repos/`, ``),
            studentUsername: backendItem.user.login,
            assigneeUsername: backendItem.assignee && backendItem.assignee.login,
            submittedDate: new Date(backendItem.created_at),
            grade: gradeData ? gradeData.grade : null,
            updateGrade,
            feedbackCommentHref: gradeData ? gradeData.commentUrl : null,
            submitFeedbackUrl: `/feedback/${backendItem.id}`,
        };
    });
}

interface PrListItem {
    label: string,
    href: string,
    repo: string,
    studentUsername: string,
    assigneeUsername: string | null,
    submittedDate: Date,
    grade: Grade | null,
    feedbackCommentHref: string | null,
    submitFeedbackUrl: string,
    updateGrade: (newGrade: Grade) => void,
}

function useFetchListData() {
    const query = formatSearchQuery({is: 'open', org: GITHUB_ORGS, });
    const {data, error, isLoading} = useFetchFromGithub<ListFetchData>(`search/issues?q=${query}&per_page=100&sort=updated&order=desc`);

    const { grades, isLoadingFirebase, setGradeData } = useFetchFromFirebase(`/grades/`);

    return {
        prListData: data && data.items || null,
        grades,
        isLoading: isLoading || isLoadingFirebase,
        error,
        setGradeData,
    }
}

const InstructorListPage = () => {
    const { prListData, grades, isLoading, error, setGradeData } = useFetchListData();

    return (
        <Main>
            <Header1>Student Pull Requests</Header1>
            {!isLoading && prListData ?
                <PrListTable prListData={convertToPrListItem(prListData, grades, setGradeData)} />:
                <BodyText>Loading...</BodyText>
            }
        </Main>
    );
};

const VolunteerListPage = () => {
    const { prListData, grades, isLoading, error, setGradeData } = useFetchListData();

    return (
        <Main>
            <Header1>Assigned Pull Requests</Header1>
            <BodyText>
                This view should include some high level information about providing good feedback to the students.
                Things to keep in mind. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. <BodyTextLink>Read more</BodyTextLink>
            </BodyText>
            {!isLoading && prListData ?
                <PrListTable prListData={convertToPrListItem(prListData, grades, setGradeData)} />:
                <BodyText>Loading...</BodyText>
            }
        </Main>
    );
};

interface PrListTableProps {
    prListData: PrListItem[],
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
    paddingLeft: 5,
    paddingRight: 5,
});

const ListTableCell = styled(`td`)({
    paddingTop: 14,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
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
                <ListTableHeader>Set grade</ListTableHeader>
            </tr>
        </ListTableHead>
        <ListTableBody>
            {prListData.map((prListItem) => <PrListRow prListItem={prListItem} key={prListItem.href}/>)}
        </ListTableBody>
    </ListTableRoot>
);

interface PrListRowProps {
    prListItem: PrListItem,
}

const PrListRow: React.FC<PrListRowProps> = ({ prListItem }) => {
    const setGradeToGreen = () => prListItem.updateGrade('green');
    return (
        <TableListRow>
            <ListTableCell><TableLink href={prListItem.href}>{prListItem.label}</TableLink></ListTableCell>
            <ListTableCell>{prListItem.repo}</ListTableCell>
            <ListTableCell>{prListItem.studentUsername}</ListTableCell>
            <ListTableCell>{prListItem.submittedDate.toLocaleDateString()}</ListTableCell>
            <ListTableCell>
                {prListItem.feedbackCommentHref ?
                    <TableLink href={prListItem.feedbackCommentHref}>View feedback</TableLink> :
                    <TableInternalLink to={prListItem.submitFeedbackUrl}>Submit feedback</TableInternalLink>
                }
            </ListTableCell>
            <ListTableCell>{prListItem.grade}</ListTableCell>
            <ListTableCell><button onClick={setGradeToGreen}>Make grade green</button></ListTableCell>
        </TableListRow>
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
