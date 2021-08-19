import LoginStyle from "../../styles/home/Login.module.scss";
import { gql, useQuery } from "@apollo/client";

const AUTHTEST = gql`
  query login {
    AuthLoginUser(data: { username: "demo", password: "demo" }) {
      username
    }
  }
`;

const Login = () => {
  const { client, loading, data } = useQuery(AUTHTEST, {
    fetchPolicy: "network-only",
    onCompleted:(()=>{
      console.log(data)
    })
  });


  return (
    <div id={LoginStyle.container}>
      <form>
        <h1>Login</h1>
        <label htmlFor="username">username</label>
        <input id="username" type="text" autoComplete="name" required />
        <br />
        <label htmlFor="password">password</label>
        <input id="password" type="password" autoComplete="password" required />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
