import { gql } from '@apollo/client';

const FIELD_SUBSCRIPTION = gql`
    subscription FieldUpdated($id: ID!) {
        fieldUpdated(applicationId: $id) {
            id
            answers {
                id
                label
                answer
            }
        }
    }
`;

export default FIELD_SUBSCRIPTION;
