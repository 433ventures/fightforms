import { gql } from '@apollo/client';

const APPLICATION_QUERY = gql`
    query Application($id: ID!) {
       application(id: $id) {
            id
            name
            answers {
                id
                answer
                questionId
            }
       }
        questions {
            id
            inputName
            question
        }
    }
`;

export default APPLICATION_QUERY;
