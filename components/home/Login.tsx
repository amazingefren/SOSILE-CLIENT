import LoginStyle from "../../styles/index/login.module.scss";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AuthCheck, AuthLogin } from "../../graphql/auth/auth.query";
import { FormEvent, useEffect, useState } from "react";

const Login = () => {
  const [
    handleLogin,
    {
      // data,
      loading,
      error,
    },
  ] = useMutation(AuthLogin, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      window.localStorage.removeItem("auth-login-username");
      setPayload({ username: "", password: "" });
      window.localStorage.setItem("refresh_token", data.AuthLoginUser.token);
      // Redirect ? Store User ?
    },
    onError: (e) => {
      console.log(e.message);
    },
  });

  useQuery(AuthCheck, {
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      console.log(data);
    },
  });

  const [payload, setPayload] = useState({ username: "", password: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPayload((old) => ({ ...old, password: "" }));
    await handleLogin({
      variables: { data: payload },
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) {
      e.persist();
      let value = "";
      if (e.target.name == "username") {
        value = e.target.value.replace(/[^a-z1-9\-\_]/gi, "");
      } else {
        value = e.target.value;
      }
      setPayload((old) => ({
        ...old,
        [e.target.name]: value,
      }));
    } else {
      setPayload((old) => ({ ...old }));
    }
  };

  // Get username from localstorage
  useEffect(() => {
    let data = window.localStorage.getItem("auth-login-username") || "";
    setPayload({
      username: data,
      password: "",
    });
  }, []);

  // Set username to localstorage
  useEffect(() => {
    window.localStorage.setItem("auth-login-username", payload.username);
  }, [payload.username]);

  return (
    <div id={LoginStyle.container}>
      <form id="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <span>{error.message}</span>}
        <br />
        <label htmlFor="username">username</label>
        <input
          name="username"
          placeholder="username"
          type="username"
          value={payload.username || ""}
          onChange={handleInput}
          required
        />
        <br />
        <label htmlFor="password">password</label>
        <input
          name="password"
          placeholder="password"
          type="password"
          value={payload.password || ""}
          onChange={handleInput}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
