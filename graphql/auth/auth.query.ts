import { gql } from "@apollo/client";

const AuthLogin = gql`
    mutation login($data: AuthLoginUserInput!) {
      AuthLoginUser(data: $data) {
        username
        token
        id
      }
    }
  `;

export { AuthLogin };
