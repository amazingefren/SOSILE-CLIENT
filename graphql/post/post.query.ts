import { gql } from "@apollo/client";
import { PostFields } from '../models/post.model'

export function USER_POST(fields: PostFields){
  const keys = Object.keys(fields);
  const query = gql`
    query USER_POST {
      userPosts {
        ${keys}
      }
    }
  `
  return query
}

