import React, { forwardRef, RefForwardingComponent } from 'react';
import styled from '@emotion/styled';
import { Menu, MenuDisclosure, MenuItem, useMenuState, MenuInitialState, MenuDisclosureProps } from "reakit";
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

type GradeDisclosureProps = NullableGradeProp & Partial<MenuDisclosureProps>;

export const GradeMenuDisclosure = styled(`button`)<NullableGradeProp>`
    color: ${colors.white};
    background: ${(props) => colors.grades[props.grade || 'pending']};
    border-radius: 50%;
    border: none;
    padding: 0;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    cursor: pointer;
    outline: none;
`;

const GradeButton = styled(`button`)<NullableGradeProp>(props => ({
    backgroundColor: colors.white,
    color: colors.grades[props.grade || 'pending'],
    fontSize: 16,
    fontWeight: 600,
    borderColor: `currentColor`,
    borderRadius: 8,
    borderWidth: 1,
    padding: 0,
    cursor: `pointer`,
    outline: `none`,
    overflow: `hidden`,
    display: `flex`,
    whiteSpace: `nowrap`,
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

const GradeButtonCaret = styled(`span`)<NullableGradeProp>(props => ({
    backgroundColor: colors.grades[props.grade || 'pending'],
    color: colors.white,
}));

export const LabeledGradeMenuDisclosure = forwardRef<HTMLButtonElement, GradeDisclosureProps>(
    ({grade, ...menu}, ref) => (
    <GradeButton grade={grade} ref={ref} {...menu}>
        <span>
            {GRADE_DESCRIPTIONS[grade || 'pending']}
        </span>
        <GradeButtonCaret grade={grade}>
            <FontAwesomeIcon icon={faCaretDown} />
        </GradeButtonCaret>
    </GradeButton>
));

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
    color: ${(props) => colors.grades[props.grade]};
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
        background: ${(props) => colors.grades[props.grade]};
    }
`;

interface GradeMenuProps {
    placement?: MenuInitialState['placement'];
    onSelect: (grade: Grade) => void;
    children: React.ReactElement;
}

const GradeMenu: React.FC<GradeMenuProps> = (({placement, onSelect, children}) => {
    const menu = useMenuState({placement});
    const callback = (grade: Grade) => {
        onSelect(grade);
        menu.hide();
    }

    return (
        <div style={{position: `relative`}}>
            <MenuDisclosure {...menu}>
                {disclosureProps =>
                    React.cloneElement(React.Children.only(children), disclosureProps)
                }
            </MenuDisclosure>
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