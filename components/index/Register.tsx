import { useMutation } from "@apollo/client";
import router from "next/router";
import { FormEvent, useState } from "react";
import { isAuthInVar } from "../../apollo.cache";
import { AuthRegister } from "../../graphql/auth/auth.query";
import RegisterStyle from "./Register.module.scss";

const RegisterForm = () => {
  const [handleRegister, { loading, error }] = useMutation(AuthRegister, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log(data);
      setPayload({ displayName: "", email: "", password: "", username: "" });
      window.localStorage.setItem("refresh_token", data.AuthRegisterUser.token);
      isAuthInVar(true);
      router.replace("/home");
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const [payload, setPayload] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPayload((old) => ({ ...old, password: "" }));
    await handleRegister({
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

  return (
    <div id={RegisterStyle.container}>
      <form id="register-form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        {error && <span>{error.message}</span>}
        <br />
        <input
          name="email"
          placeholder="email"
          type="email"
          value={payload.email || ""}
          onChange={handleInput}
          required
        />
        <input
          name="username"
          placeholder="username"
          type="username"
          value={payload.username || ""}
          onChange={handleInput}
          required
        />
        <input
          name="displayName"
          placeholder="Display Name"
          type="text"
          value={payload.displayName || ""}
          onChange={handleInput}
          required
        />
        <input
          name="password"
          placeholder="password"
          type="password"
          value={payload.password || ""}
          onChange={handleInput}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default RegisterForm;
