import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import SurveyForm from './components/SurveyForm';
import Results from './components/Results';

const App: React.FC = () => {
  return (
    <Router>
      <Container maxW="container.md" p={4}>
        <Routes>
          <Route path="/" element={<SurveyForm />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
