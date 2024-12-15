import { gql } from '@apollo/client';

const CREATE_APPLICATION_MUTATION = gql`
    mutation CreateApplication($email: String!, $name: String!, $phone: String!, $useAI: Boolean!) {
        createApplication(
            data: { email: $email, name: $name, phone: $phone }
            useAI: $useAI
        ) {
            id
        }
    }
`;

export default CREATE_APPLICATION_MUTATION;
