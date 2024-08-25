import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';


interface Question {
  id: number;
  question: string;
  choices: string[];
}

const SurveyForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const navigate = useNavigate();

  const handleViewResults = () => {
    navigate('/results'); 
  };


  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*');
      if (error) console.error(error);
      else setQuestions(data || []);
    };

    fetchQuestions();
  }, []);

  const handleResponseChange = (questionId: number, choice: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleSubmit = async () => {
    await supabase.from('responses').insert(
      Object.entries(responses).map(([questionId, choice]) => ({
        question_id: questionId,
        choice,
      }))
    );
  };

  return (
    <Box>
      <h1 style={{textAlign:'center',margin:'8px',fontSize:'25px'}} >
        Survey App
      </h1>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        {questions.map((q) => (
          <FormControl key={q.id} mb={4}>
            <FormLabel>{q.question}</FormLabel>
            <RadioGroup
              value={responses[q.id] || ''}
              onChange={(choice) => handleResponseChange(q.id, choice)}
            >
              <Stack direction="column">
                {q.choices.map((choice) => (
                  <Radio key={choice} value={choice}>{choice}</Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
        ))}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button type="submit" colorScheme="teal">Submit</Button>
          <Button colorScheme="blue" onClick={handleViewResults}>View Results</Button>
        </Box>
      </form>
    </Box>
  );
};

export default SurveyForm;
