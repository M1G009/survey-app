import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';

interface Question {
  id: number;
  question: string;
}

interface Response {
  question_id: number;
  choice: string;
}

const Results: React.FC = () => {
  const [results, setResults] = useState<{ question: string; choice: string }[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('responses')
        .select('*');
      if (responsesError) {
        console.error('Error fetching responses:', responsesError);
        return;
      }
      setResponses(responsesData || []);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*');
      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return;
      }
      setQuestions(questionsData || []);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Combine questions and responses
    const combinedResults = responses.map(response => {
      const question = questions.find(q => q.id === response.question_id);
      return {
        question: question?.question || 'Unknown Question',
        choice: response.choice
      };
    });
    setResults(combinedResults);
  }, [questions, responses]);

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Question</Th>
          <Th>Choice</Th>
        </Tr>
      </Thead>
      <Tbody>
        {results.map((result, index) => (
          <Tr key={index}>
            <Td>{result.question}</Td>
            <Td>{result.choice}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Results;
