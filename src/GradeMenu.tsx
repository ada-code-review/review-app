import React from 'react';
import styled from '@emotion/styled';
import { Menu, MenuDisclosure, MenuItem, useMenuState, MenuInitialState } from "reakit";
import { Grade } from './fetchFromFirebase';
import { colors } from './designTokens';

interface GradeProp {
    grade: Grade,
}

interface GradeMenuProps extends GradeProp {
    placement?: MenuInitialState['placement'];
    onSelect: (grade: Grade) => void;
}

const GradeMenuDisclosure = styled(MenuDisclosure)<GradeProp>`
color: ${colors.white};
background: ${(props: GradeProp) => colors.grades[props.grade]};
border-radius: 50%;
border: none;
padding: 0;
width: 20px;
height: 20px;
vertical-align: middle;
`;

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
&:focus {
    color: ${colors.white};
    background: ${(props: GradeProp) => colors.grades[props.grade]};
}
`;

const GradeMenu: React.FC<GradeMenuProps> = (({grade, placement, onSelect}) => {
    const menu = useMenuState({placement});
    const callback = (grade: Grade) => {
        onSelect(grade);
        menu.hide();
    }

    return (
        <div style={{position: `relative`}}>
            <GradeMenuDisclosure grade={grade} {...menu} />

            <GradeMenuContainer {...menu} aria-label="Grades">
                <GradeMenuItem onClick={()=>{callback('green')}} grade='green' {...menu}>Green - Meets or exceeds standard</GradeMenuItem>
                <GradeMenuItem onClick={()=>{callback('yellow')}} grade='yellow' {...menu}>Yellow - Approaches standard</GradeMenuItem>
                <GradeMenuItem onClick={()=>{callback('red')}} grade='red' {...menu}>Red - Not at standard</GradeMenuItem>
            </GradeMenuContainer>
        </div>
    );
});

export {
  GradeMenu
};