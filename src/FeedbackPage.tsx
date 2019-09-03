import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Main, Header1, BodyText, BodyTextLink, BodyOL } from './sharedStyleComponents';
import { useFetchFromGithub, useFetchText, fetchFromGithub } from './fetchFromGithub';
import { Grade, GradeData, AllGradeData, useFetchFromFirebase } from './fetchFromFirebase';
import { colors, fonts } from './designTokens';
import { Spacer, InlineSpacer } from './Spacer';
import { GradeMenu, LabeledGradeMenuDisclosure } from './GradeMenu';

interface FeedbackPageParams {
    id: string,
    org: string,
    repo: string,
}

interface FeedbackPageProps extends RouteComponentProps<FeedbackPageParams> {

}

interface SubmitEndpointResponse {
    html_url: string,
}

interface PrData {
    id: number,
    label: string,
    href: string,
    authorUsername: string,
    comments: number,
    submitFeedbackPath: string,
    grade: Grade | null,
    setGradeData: (newGradeData: GradeData) => void,
    feedbackMarkdown: string,
}
interface PrBackendData {
    id: number,
    title: string,
    number: number, // PR number for that repo
    html_url: string,
    user: {
        login: string, // author's github username
    },
    review_comments: number,
    comments_url: string, //for submission to backend
    issue_url: string,
}

interface PrIssueBackendData {
    id: number,
}

function useFetchFeedbackData(project: string,) {
    return useFetchText(`https://raw.githubusercontent.com/${project}/master/feedback.md`);
}

function useFetchPrData(org: string, repo: string, prId: string) {
    const path = `repos/${org}/${repo}/pulls/${prId}`
    const {data: prData, error: prError, isLoading: isLoadingGithub} = useFetchFromGithub<PrBackendData>(path);
    const issuePath = prData ? new URL(prData.issue_url).pathname.slice(1) : null;
    const { data: issueData, error: issueError, isLoading: isLoadingIssue } = useFetchFromGithub<PrIssueBackendData>(issuePath);
    const { data: feedbackMarkdown, isLoading: isLoadingMarkdown} = useFetchFeedbackData(`${org}/${repo}`)
    const { grades, isLoadingFirebase, setGradeData } = useFetchFromFirebase();
    return {
        prData: prData && issueData && grades && typeof feedbackMarkdown === `string` ? convertToPrData(prData, issueData, grades, setGradeData, feedbackMarkdown) : null,
        isLoading: isLoadingGithub || isLoadingIssue || isLoadingFirebase || isLoadingMarkdown,
        prError,
    }
}

function convertToPrData(
    prBackendData: PrBackendData,
    issueData: PrIssueBackendData,
    allGradeData: AllGradeData,
    setGradeData: (prId: number, newData: GradeData) => void,
    feedbackMarkdown: string,
): PrData {
    prBackendData.title = prBackendData.title.trim()
    if (prBackendData.title.length > 20) {
        prBackendData.title = `${prBackendData.title.substring(0,20).trim()}...`
    }
    const gradeData = allGradeData[issueData.id];

    return {
        id: issueData.id,
        label: `${prBackendData.number} - ${prBackendData.title}`,
        href: prBackendData.html_url,
        authorUsername: prBackendData.user.login,
        comments: prBackendData.review_comments,
        submitFeedbackPath: new URL(prBackendData.comments_url).pathname.slice(1),
        grade: gradeData ? gradeData.grade : null,
        setGradeData: (gradeData: GradeData) => setGradeData(issueData.id, gradeData),
        feedbackMarkdown,
    };
}

const Subtitle = styled(`h2`)({
    fontSize: 16,
    fontWeight: 600,
    color: colors.nearBlack,
    textTransform: `uppercase`,
    padding: 0,
    margin: 0,
});

const TitleLayout = styled(`div`)({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `baseline`,
});

const Title = styled(Header1)({
    marginTop: 0,
});

const PrLink = styled(BodyTextLink)({
    textAlign: `right`,
});

const StyledOrderedList = styled(BodyOL)({
   marginTop: 30,
   marginBottom: 30,
});

const FeedbackForm = styled(`textarea`)({
    borderColor: colors.teal20,
    borderWidth: 1,
    borderStyle: `solid`,
    borderRadius: 8,
    backgroundColor: colors.gray10,
    resize: `vertical`,
    width: `100%`,
    height: 400,
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: fonts.ptMono,
    padding: 20,
    boxSizing: `border-box`,
    '::-webkit-scrollbar': {
        width: 20,
        paddingRight: 5,
    },
    '::-webkit-scrollbar-track': {
        backgroundColor: `transparent`,
    },
    '::-webkit-scrollbar-thumb': {
        backgroundColor: colors.teal20,
        borderRadius: 10,
        border: `8px solid rgba(255,255,255,0)`,
        backgroundClip: `padding-box`,
    },
});

const FormBottomBar = styled(`div`)({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
});

const FormBottomBarLeft = styled(`div`)({

});

const FormBottomBarRight = styled(`div`)({
    display: `flex`,
    alignItems: `center`,
});

const CommentIndicatorRoot = styled(`span`)({
    color: colors.teal100,
});

const ReloadButton = styled(`button`)({
    color: colors.pumpkin100,
    backgroundColor: `transparent`,
    outline: `none`,
    cursor: `pointer`,
    fontFamily: fonts.openSans,
    border: `none`,
    fontSize: `inherit`,
    padding: 0,
});

const CommentIndicator: React.FC<{ hasComment: boolean, refreshData: () => void }> = ({ hasComment, refreshData }) => (
    <CommentIndicatorRoot>
        <FontAwesomeIcon icon={hasComment ? faCheckCircle : faCircle}/>
        <InlineSpacer width='.5em'/>
        Inline comment posted on PR
        {!hasComment &&
            <React.Fragment>
                <InlineSpacer width='.75em'/>|<InlineSpacer width='.75em'/>
                <ReloadButton onClick={refreshData}>Check GitHub</ReloadButton>
            </React.Fragment>
        }
    </CommentIndicatorRoot>
);

const GradeSelector: React.FC<{ grade: Grade | null, onChange: (newGrade: Grade) => void}> = ({ grade, onChange }) => (
    <GradeMenu onSelect={onChange} placement='auto'>
        <LabeledGradeMenuDisclosure grade={grade} />
    </GradeMenu>
);

const SubmitButton = styled(`button`)({
    backgroundColor: colors.teal100,
    color: colors.white,
    fontSize: 16,
    fontWeight: 600,
    borderColor: colors.teal100,
    borderRadius: 8,
    borderWidth: 1,
    paddingTop: 9,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    cursor: `pointer`,
    whiteSpace: `nowrap`,
    ':hover': {
        backgroundColor: colors.tealDark,
        borderColor: colors.tealDark,
    },
    ':disabled': {
        cursor: `not-allowed`,
        color: colors.teal20,
        backgroundColor: colors.gray10,
        borderColor: colors.teal20,
    },
});

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ match }) => {
    const org = match.params.org;
    const repo = match.params.repo;
    const project = `${org}/${repo}`
    const prId = match.params.id;
    const { prData, isLoading } = useFetchPrData(org, repo, prId);
    const [feedbackFormText, setFeedbackFormText] = React.useState(prData ? prData.feedbackMarkdown : ``);
    const [grade, setGrade] = React.useState(prData ? prData.grade : null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        setFeedbackFormText(prData ? prData.feedbackMarkdown : ``);
    }, [prId, prData ? prData.feedbackMarkdown : ``]);

    React.useEffect(() => {
        setGrade(prData ? prData.grade : null);
    }, [prId, prData ? prData.grade : null]);

    const handleFeedbackFormInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedbackFormText(e.target.value);
    };

    // TODO: this should pull down the data from github again
    const refreshData = () => undefined;

    const submitFormData = () => {
        if (!prData || !grade) {
            return;
        }
        setIsSubmitting(true);
        fetchFromGithub(prData.submitFeedbackPath, {
            method: `POST`,
            body: JSON.stringify({
                body: feedbackFormText,
            }),
        })
            .then((response) => {
                const { html_url } = response as SubmitEndpointResponse;
                prData.setGradeData({
                    commentUrl: html_url,
                    grade,
                });
                window.location.href = html_url;
            });
    };

    function getContents() {
        if (isLoading) {
            return <BodyText>Loading...</BodyText>;
        }
        if (!prData) {
            return <BodyText>Uh oh! It looks like this PR doesn't exist.</BodyText>;
        }
        const prInfo = prData!;
        return (
            <React.Fragment>
                <Subtitle>{project}</Subtitle>
                <TitleLayout>
                    <Title>{prInfo.label}</Title>
                    <PrLink href={prInfo.href} target='_blank'>{prInfo.href}</PrLink>
                </TitleLayout>
                <BodyText>
                    Providing complete feedback on a student’s work involves three distinct steps:
                </BodyText>
                <StyledOrderedList>
                    <li>Give inline feedback by <BodyTextLink href={prInfo.href} target='_blank'>commenting on the pull request on GitHub</BodyTextLink>.</li>
                    <li>Edit the markdown field below, providing your feedback on the features listed.</li>
                    <li>Assign an overall grade (green, yellow, red) for this PR.</li>
                </StyledOrderedList>
                <BodyText>
                    Once all three are complete, you can click the Submit Feedback button at the bottom of this page.
                </BodyText>
                <FeedbackForm value={feedbackFormText} onChange={handleFeedbackFormInput}/>
                <Spacer height={21}/>
                <FormBottomBar>
                    <FormBottomBarLeft>
                        <CommentIndicator
                            hasComment={prInfo.comments > 0}
                            refreshData={refreshData}
                        />
                    </FormBottomBarLeft>
                    <FormBottomBarRight>
                        <GradeSelector grade={grade} onChange={setGrade}/>
                        <Spacer width={20}/>
                        <SubmitButton
                            disabled={prInfo.comments == 0 || isSubmitting || !grade}
                            onClick={submitFormData}
                        >
                            {isSubmitting ? `Submitting...` : `Submit Feedback` }
                        </SubmitButton>
                    </FormBottomBarRight>
                </FormBottomBar>
            </React.Fragment>
        )
    }
    return (
        <Main>
            {getContents()}
        </Main>
    );
};
