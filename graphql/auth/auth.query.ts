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

const AuthRegister = gql`
  mutation register($data: AuthRegisterUserInput!) {
    AuthRegisterUser(data: $data) {
      username
      token
      id
    }
  }
`;

const AuthCheck = gql`
  query AuthCheck {
    AuthCheck
  }
`;
export { AuthLogin, AuthCheck, AuthRegister };
