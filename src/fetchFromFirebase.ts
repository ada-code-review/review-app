import firebase from 'firebase';
import { useState, useEffect } from 'react';

export type Grade = 'green' | 'yellow' | 'red';

export interface GradeData {
    grade: Grade,
    commentUrl: string | null, // TODO: this should not be null
}

export interface AllGradeData {
    [prId: number]: GradeData,
}

function useFetchFromFirebase(path: string) {
    const [grades, setGradesState] = useState< AllGradeData>({});
    const [isLoading, setIsLoadingState] = useState(true);

    useEffect(
        () => {
            setIsLoadingState(true);
            // TODO: memory leak here?
            firebase
                .database()
                .ref(path)
                .on(`value`, snapshot => {
                    const firebaseGrades: GradeData[] = snapshot.val() || {};
                    setGradesState(firebaseGrades);
                    setIsLoadingState(false);
                },
            );
        },
        []
    );

    const setGradeData = (prId: number, gradeData: GradeData) => {
        const newGradeData = {
            ...grades,
            [prId]: gradeData,
        };
        
        firebase
            .database()
            .ref(path)
            .set(newGradeData);

    }

    return { grades, isLoadingFirebase: isLoading, setGradeData };
}

export {
    useFetchFromFirebase,
}
