import LoginStyle from "./Shared.module.scss";
import { useMutation } from "@apollo/client";
import { AuthLogin } from "../../graphql/auth/auth.query";
import { FormEvent, useEffect, useState } from "react";
import { isAuthInVar } from "../../apollo.cache";
import router from "next/dist/client/router";

const LoginForm = () => {
  const [handleLogin, { loading, error }] = useMutation(AuthLogin, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      window.localStorage.removeItem("auth-login-username");
      setPayload({ username: "", password: "" });
      window.localStorage.setItem("refresh_token", data.AuthLoginUser.token);
      isAuthInVar(true);
      router.replace("/home");
    },
    onError: (e) => {
      // console.log(e.message);
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
    let data = window.localStorage.getItem("auth-login-username") || "demo";
    let password = data == "demo" ? data : "";
    setPayload({
      username: data,
      password,
    });
  }, []);

  // Set username to localstorage
  useEffect(() => {
    window.localStorage.setItem("auth-login-username", payload.username);
  }, [payload.username]);

  return (
    <div className={LoginStyle.container}>
      <form id="login-form" onSubmit={handleSubmit} className={LoginStyle.form}>
        {error && <span>{error.message}</span>}
        {/*<label htmlFor="username">username</label>*/}
        <input
          name="username"
          placeholder="Username"
          type="username"
          value={payload.username || ""}
          onChange={handleInput}
          className={LoginStyle.formField}
          required
        />
        {/*<label htmlFor="password">password</label>*/}
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={payload.password || ""}
          onChange={handleInput}
          className={LoginStyle.formField}
          required
        />
        <button
          type="submit"
          className={LoginStyle.formSubmit}
          disabled={!payload.password || !payload.username}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
