import { RouteComponentProps } from 'react-router-dom';
import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faCheckCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Main, Header1, BodyText, BodyTextLink, BodyOL } from './sharedStyleComponents';
import { useFetchText } from './fetchFromGithub';
import { Grade } from './fetchFromFirebase';
import { colors, fonts } from './designTokens';
import { Spacer, InlineSpacer } from './Spacer';
import { NullableGradeProp, GradeMenu } from './GradeMenu';
import { MenuDisclosure } from "reakit";

interface FeedbackPageParams {
    id: string,
}

interface FeedbackPageProps extends RouteComponentProps<FeedbackPageParams> {

}

interface PrData {
    label: string,
    repo: string,
    href: string,
    authorUsername: string,
    commentNumber: number,
    grade: Grade | null,
}

function useFetchFeedbackData(project: string) {
    return useFetchText(`https://raw.githubusercontent.com/${project}/master/feedback.md`);
}

const mockPrData: PrData = {
    label: `#45 - This is my PR title`,
    repo: `Ada-11/Trek`,
    href: `https://github.com/Ada-C11/trek/pull/45`,
    authorUsername: `somegithubusername`,
    commentNumber: 1,
    grade: null,
}

function useMockPrData(prId: string,) {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [prData, setPrData] = React.useState<PrData | null>(null);
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setPrData(mockPrData);
            setIsLoading(false);
        }, 1000);
    }, [prId]);

    return { prData, isLoading };
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

// TODO: fill out this component
const GradeSelector: React.FC<{ grade: Grade | null, onChange: (newGrade: Grade) => void}> = ({ grade, onChange }) => (
    <GradeMenu grade={grade} onSelect={(grade) => console.log(grade)} placement='auto'>
        Grade this Pull Request
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
    const prId = match.params.id;
    // TODO: replace with REAL param of org and repo
    const project = `ada-code-review/calculator`;
    const {data: feedbackMarkdown} = useFetchFeedbackData(project);
    // TODO: use real data here
    const { prData, isLoading } = useMockPrData(prId);
    const [feedbackFormText, setFeedbackFormText] = React.useState(feedbackMarkdown);

    React.useEffect(() => {
        setFeedbackFormText(feedbackMarkdown);
    }, [prId, prData]);

    const handleFeedbackFormInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedbackFormText(e.target.value);
    };

    // TODO: make these do something
    const refreshData = () => undefined;
    const handleGradeChange = (newGrade: Grade) => undefined;
    const submitFormData = () => undefined;

    function getContents() {
        if (isLoading) {
            return <BodyText>Loading...</BodyText>;
        }
        if (!prData) {
            return <BodyText>Nothing to show here</BodyText>;
        }
        return (
            <React.Fragment>
                <Subtitle>{prData.repo}</Subtitle>
                <TitleLayout>
                    <Title>{prData.label}</Title>
                    <PrLink>{prData.href}</PrLink>
                </TitleLayout>
                <BodyText>
                    Providing complete feedback on a student’s work involves three distinct steps:
                </BodyText>
                <StyledOrderedList>
                    <li>Give inline feedback by <BodyTextLink href={prData.href} target='_blank'>commenting on the pull request on GitHub</BodyTextLink>.</li>
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
                            hasComment={prData.commentNumber > 0}
                            refreshData={refreshData}
                        />
                    </FormBottomBarLeft>
                    <FormBottomBarRight>
                        <GradeSelector grade={prData.grade} onChange={handleGradeChange}/>
                        <Spacer width={20}/>
                        <SubmitButton
                            disabled={!prData.commentNumber}
                            onClick={submitFormData}
                        >
                            Submit Feedback
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
