import { gql } from "@apollo/client";
import {
  User,
  UserAuthIncludeOpts,
  UserRequestOpts,
} from "../models/user.model";

const ME = (
  /* {
    followers = false,
    following = false,
    likes = false,
    posts = false,
    profile = false,
    replies = false,
  }: UserAuthIncludeOpts, */
  { id = true, username = false, email = false }: UserRequestOpts
) => {
  const getUsername = username ? "username" : "";
  const getEmail = email ? "email" : "";
  const getId = id ? "id" : "";
  const payload = `
    query whoAmI {
      whoAmI
      {
        ${getId}
        ${getUsername}
        ${getEmail}
      }
    }
  `;
  return gql`${payload}`;
};

export { ME };
