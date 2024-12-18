import { gql } from '@apollo/client';

const SUBMIT_ANSWERS_MUTATION = gql`
    mutation SubmitAnswers($id: String!, $answers: [ApplicationAnswerInput!]!) {
        submitAnswers(id: $id, answers: $answers) {
            id
            answers {
                id
                answer
                questionId
            }
        }
    }
`;

export default SUBMIT_ANSWERS_MUTATION;
