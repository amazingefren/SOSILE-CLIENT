/* import { gql } from "@apollo/client";
import { PostCounts, PostFields, PostIncludeOpts } from "../models/post.model";

export function USER_POST(fields: PostFields, opts: PostIncludeOpts) {
  let query = ``; */

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

  /* console.log(`this is a test (${JSON.stringify(opts).replaceAll("\"", "")})`);

  return gql`
  query test{
    userPosts
    {
      content
      ${query}
    }
  }
    `;
} */
