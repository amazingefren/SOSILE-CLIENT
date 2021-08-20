import { gql } from "@apollo/client";
import { PostCounts, PostFields } from "../models/post.model";

export function USER_POST(fields: PostFields, counts?: PostCounts) {
  let query = ``;

  // @TODO PostIncludeOpts

  /* if (counts?.likes || counts?.replies) {
    query = `
      query USER_POST{
        userPosts(
          likes: ${counts.likes?.valueOf() || "false"}
          replies: ${counts.replies?.valueOf() || "false"}
        ){
          ${Object.keys(fields)}
          _count {
            ${Object.keys(counts)}
          }
        }
      }
    `;
  } else {
    query = `
      query USER_POST { userPosts { ${Object.keys(fields)} }}
    `;
  } */
  return gql`
    ${query}
  `;
}
