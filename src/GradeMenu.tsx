import React from 'react';
import styled from '@emotion/styled';
import { Menu, MenuDisclosure, MenuItem, useMenuState, MenuInitialState } from "reakit";
import { Grade } from './fetchFromFirebase';
import { colors } from './designTokens';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const GRADE_DESCRIPTIONS = {
    green: 'Green - Meets or exceeds standard',
    yellow: 'Yellow - Approaches standard',
    red: 'Red - Not at standard',
    pending: 'Grade this Pull Request',
};

export interface GradeProp {
    grade: Grade,
}

export interface NullableGradeProp {
    grade?: Grade | null,
}

interface GradeMenuProps extends NullableGradeProp {
    placement?: MenuInitialState['placement'];
    onSelect: (grade: Grade) => void;
    compact?: boolean;
}

const GradeMenuDisclosure = styled(MenuDisclosure)<NullableGradeProp>`
    color: ${colors.white};
    background: ${(props: NullableGradeProp) => colors.grades[props.grade || 'pending']};
    border-radius: 50%;
    border: none;
    padding: 0;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    cursor: pointer;
    outline: none;
`;

const GradeButton = styled(MenuDisclosure)<NullableGradeProp>(props => ({
    backgroundColor: colors.white,
    color: colors.grades[props.grade || 'pending'],
    fontSize: 16,
    fontWeight: 600,
    borderColor: `currentColor`,
    borderRadius: 8,
    borderWidth: 1,
    padding: 0,
    cursor: `pointer`,
    overflow: `hidden`,
    display: `flex`,
    '& > *': {
        paddingTop: 9,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    ':hover': {
        borderColor: colors.tealDark,
    },
    ':disabled': {
        cursor: `not-allowed`,
        color: colors.teal20,
        backgroundColor: colors.gray10,
        borderColor: `currentColor`,
    },
}));

const GradeButtonIndicator = styled(`span`)<NullableGradeProp>(props => ({
    backgroundColor: colors.grades[props.grade || 'pending'],
    color: colors.white,
}));

const GradeMenuContainer = styled(Menu)`
    border: 1px solid ${colors.teal20};
    border-radius: 8px;
    box-shadow: 0px 6px 12px ${colors.shadow};
    z-index: 100;
    padding: 2px;
    background: ${colors.white};
    margin: 0 2em;
    display: flex;
    flex-direction: column;

    & > :not(:first-child) {
        border-top: 1px solid ${colors.teal20};
    }
`

const GradeMenuItem = styled(MenuItem)<GradeProp>`
    color: ${(props: GradeProp) => colors.grades[props.grade]};
    background: ${colors.white};
    border: none;
    padding: 8px 16px;
    display: block;
    min-width: 10em;
    font-size: 1em;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    &:focus {
        color: ${colors.white};
        background: ${(props: GradeProp) => colors.grades[props.grade]};
    }
`;

const GradeMenu: React.FC<GradeMenuProps> = (({grade, placement, onSelect, compact}) => {
    const menu = useMenuState({placement});
    const callback = (grade: Grade) => {
        onSelect(grade);
        menu.hide();
    }

    let disclosure;
    if (!compact) {
        disclosure = (
            <GradeButton grade={grade} {...menu}>
                <span>
                    {GRADE_DESCRIPTIONS[grade || 'pending']}
                </span>
                <GradeButtonIndicator grade={grade}>
                    <FontAwesomeIcon icon={faCaretDown} />
                </GradeButtonIndicator>
            </GradeButton>
        )
    } else {
        disclosure = <GradeMenuDisclosure grade={grade} {...menu} />
    }

    return (
        <div style={{position: `relative`}}>
            {disclosure}
            <GradeMenuContainer {...menu} aria-label="Grades">
                <GradeMenuItem onClick={()=>{callback('green')}} grade='green' {...menu}>{GRADE_DESCRIPTIONS.green}</GradeMenuItem>
                <GradeMenuItem onClick={()=>{callback('yellow')}} grade='yellow' {...menu}>{GRADE_DESCRIPTIONS.yellow}</GradeMenuItem>
                <GradeMenuItem onClick={()=>{callback('red')}} grade='red' {...menu}>{GRADE_DESCRIPTIONS.red}</GradeMenuItem>
            </GradeMenuContainer>
        </div>
    );
});

export {
  GradeMenu
};