import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';

import { Link } from 'react-router-dom';
import { useUserStore, UserState } from './stores/UserStore';
import { Header1, BodyText, BodyTextLink, Main } from './sharedStyleComponents';
import { formatSearchQuery, useFetchFromGithub } from './fetchFromGithub';
import { useFetchFromFirebase, GradeData, Grade, AllGradeData } from './fetchFromFirebase';
import { GITHUB_ORGS } from './constants';
import { fonts, colors } from './designTokens';
import { GradeMenu } from './GradeMenu';

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
    return prListItems.filter((item) => !!item.assignee && item.assignee.login === username);
}

function convertToPrListItem(prListItems: PrItemBackend[], grades: AllGradeData, setGrade: (prId: number, grade: GradeData) => void): PrListItem[] {
    return prListItems.map((backendItem) => {
        const repoUrl = new URL(backendItem.repository_url);
        const gradeData = grades[backendItem.id] || null;
        backendItem.title = backendItem.title.trim()
        if (backendItem.title.length > 20) {
            backendItem.title = `${backendItem.title.substring(0,20).trim()}...`
        }
        const updateGrade = (newGrade: Grade) => {
            setGrade(backendItem.id, {
                grade: newGrade,
                commentUrl: null,
            });
        }
        const repo = repoUrl.pathname.replace(`/repos/`, ``);
        return {
            label: `${backendItem.number}-${backendItem.title}`,
            href: backendItem.html_url,
            repo: repo,
            studentUsername: backendItem.user.login,
            assigneeUsername: backendItem.assignee && backendItem.assignee.login,
            submittedDate: new Date(backendItem.created_at),
            grade: gradeData ? gradeData.grade : null,
            updateGrade,
            feedbackCommentHref: gradeData ? gradeData.commentUrl : null,
            submitFeedbackUrl: `/feedback/${repo}/${backendItem.number}`,
        };
    });
}

function sortByReviewed(prListItems: PrListItem[]): PrListItem[] {
    const sortedList = [ ...prListItems ];
    sortedList.sort((a, b) => {
        if (!!a.grade === !!b.grade) {
            return 0;
        }
        return a.grade ? 1 : -1;
    });

    return sortedList;
}

function sortByOldest(prListItems: PrListItem[]): PrListItem[] {
    const sortedList = [ ...prListItems ];
    sortedList.sort((a, b) => a.submittedDate.getTime() - b.submittedDate.getTime());

    return sortedList;
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

    function getContents() {
        if (isLoading) {
            return <BodyText>Loading...</BodyText>;
        }
        if (prListData && prListData.length) {
            return <PrListTable prListData={sortByReviewed(sortByOldest(convertToPrListItem(prListData, grades, setGradeData)))} showAssignee={true} />;
        }
        return <BodyText>Nothing to show here</BodyText>;
    }

    return (
        <Main>
            <Header1>Student Pull Requests</Header1>
            {getContents()}
        </Main>
    );
};

const VolunteerListPage = () => {
    const username = useUserStore(state => state.username);
    const { prListData, grades, isLoading, error, setGradeData } = useFetchListData();

    function getContents() {
        if (isLoading) {
            return <BodyText>Loading...</BodyText>;
        }
        const filteredListData = filterByAssignee(username!, prListData || []);
        if (filteredListData.length) {
            return <PrListTable prListData={sortByReviewed(sortByOldest(convertToPrListItem(filteredListData, grades, setGradeData)))} showAssignee={false} />;
        }
        return <BodyText>You don't have any PRs assigned to you yet!</BodyText>;
    }

    return (
        <Main>
            <Header1>Assigned Pull Requests</Header1>
            <BodyText>
                This view should include some high level information about providing good feedback to the students.
                Things to keep in mind. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. <BodyTextLink>Read more</BodyTextLink>
            </BodyText>
            {getContents()}
        </Main>
    );
};

interface PrListTableProps {
    prListData: PrListItem[],
    showAssignee: boolean,
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

const PrListTable: React.FC<PrListTableProps> = ({ prListData, showAssignee }) => (
    <ListTableRoot>
        <ListTableHead>
            <tr>
                <ListTableHeader>Pull Request</ListTableHeader>
                <ListTableHeader>Project Repo</ListTableHeader>
                <ListTableHeader>Student</ListTableHeader>
                <ListTableHeader>Submitted</ListTableHeader>
                <ListTableHeader>Assignee</ListTableHeader>
                <ListTableHeader>Feedback Status</ListTableHeader>
                <ListTableHeader>Grade</ListTableHeader>
            </tr>
        </ListTableHead>
        <ListTableBody>
            {prListData.map((prListItem) => <PrListRow prListItem={prListItem} key={prListItem.href} showAssignee={showAssignee}/>)}
        </ListTableBody>
    </ListTableRoot>
);

interface PrListRowProps {
    prListItem: PrListItem,
    showAssignee: boolean,
}

const PrListRow: React.FC<PrListRowProps> = ({ prListItem, showAssignee }) => {
    const setGrade = (grade: Grade) => prListItem.updateGrade(grade);
    return (
        <TableListRow>
            <ListTableCell><TableLink href={prListItem.href} target='_blank'>{prListItem.label}</TableLink></ListTableCell>
            <ListTableCell>{prListItem.repo}</ListTableCell>
            <ListTableCell>{prListItem.studentUsername}</ListTableCell>
            <ListTableCell>{prListItem.submittedDate.toLocaleDateString()}</ListTableCell>
            {showAssignee && <ListTableCell>{prListItem.assigneeUsername}</ListTableCell>}
            <ListTableCell>
                {prListItem.feedbackCommentHref ?
                    <TableLink href={prListItem.feedbackCommentHref} target='_blank'>View feedback</TableLink> :
                    <TableInternalLink to={prListItem.submitFeedbackUrl}>Submit feedback</TableInternalLink>
                }
            </ListTableCell>
            <ListTableCell className={css({textAlign: `right`})}>
              {prListItem.grade &&
                <GradeMenu grade={prListItem.grade} placement='bottom-end' onSelect={setGrade} />
              }
            </ListTableCell>
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
