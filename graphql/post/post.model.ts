import { User } from "../user/user.model";

export interface Comment {
  id: number;
  content: string;
  date: string;
  likes?: User[];
  author?: User;
  post?: Post;
  liked?: Boolean;
  _count?: CommentCount;
}
class CommentCount {
  likes?: number;
  comments?: Comment[] = [];
}
export interface Post {
  id: number;
  author?: User;
  content: string;
  date: string;
  updated: string;
  history?: PostHistory[];
  likes?: User[];
  comments?: Comment[];
  replies?: Post[];
  parents?: Post[];
  isReply?: boolean;
  _count?: PostCounts;
}
export class PostFields {
  id = true;
  author?: boolean = false;
  content?: boolean = false;
  date?: boolean = false;
  updated?: boolean = false;
  history?: boolean = false;
  likes?: boolean = false;
  replies?: boolean = false;
  parents?: boolean = false;
  isReply?: boolean = false;
  _count = true;
}

export class PostIncludeOpts {
  author?: boolean = false;
  history?: boolean = false;
  likes?: boolean = false;
  replies?: boolean = false;
  parents?: boolean = false;
}

export class PostCounts {
  likes?: boolean = false;
  comments?: boolean = false;
}
export interface PostHistory {
  id: number;
  content: string;
  date: string;
  parent?: Post;
}
export interface CreatePostInput {
  content: string;
}
export interface FeedPost {
  id: number;
  author?: User;
  content: string;
  date: string;
  updated: string;
  history?: PostHistory[];
  liked?: Boolean;
  _count?: PostCounts;
}
/* export interface PostComment {

} */

/* type Required<T> = {
    [P in keyof T]-?: T[P];
}; */

export type PostComment = Exclude<Comment, "Post">;
