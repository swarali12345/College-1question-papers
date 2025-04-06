import React from 'react';
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import SubjectList from '../components/subjects/SubjectList';
import GroupedSubjectList from '../components/subjects/GroupedSubjectList';

const Subjects = () => {
  const { year, semester } = useParams();

  // If we have specific year/semester parameters, show the filtered list
  // Otherwise, show the grouped list
  return (
    <Container maxWidth="lg">
      {year && semester ? <SubjectList /> : <GroupedSubjectList />}
    </Container>
  );
};

export default Subjects; 