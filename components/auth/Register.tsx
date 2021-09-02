import { useMutation } from "@apollo/client";
import router from "next/router";
import { FormEvent, useState } from "react";
import { isAuthInVar } from "../../apollo.cache";
import { AuthRegister } from "../../graphql/auth/auth.query";
import RegisterStyle from "./Shared.module.scss";

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
    <div className={RegisterStyle.container}>
      <form
        id="register-form"
        onSubmit={handleSubmit}
        className={RegisterStyle.form}
      >
        {error && <span>{error.message}</span>}
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={payload.email || ""}
          onChange={handleInput}
          className={RegisterStyle.formField}
          required
        />
        <input
          name="username"
          placeholder="Username"
          type="username"
          value={payload.username || ""}
          onChange={handleInput}
          className={RegisterStyle.formField}
          required
        />
        <input
          name="displayName"
          placeholder="Display Name"
          type="text"
          value={payload.displayName || ""}
          onChange={handleInput}
          className={RegisterStyle.formField}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={payload.password || ""}
          onChange={handleInput}
          className={RegisterStyle.formField}
          required
        />
        <button
          type="submit"
          className={RegisterStyle.formSubmit}
          disabled={
            !payload.password ||
            !payload.displayName ||
            !payload.username ||
            !payload.email
          }
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
