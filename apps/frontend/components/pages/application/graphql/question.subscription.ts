import { gql } from '@apollo/client';

const QUESTION_SUBSCRIPTION = gql`
    subscription QuestionUpdated($id: ID!) {
        questionChanged(applicationId: $id)
    }
`;

export default QUESTION_SUBSCRIPTION;
