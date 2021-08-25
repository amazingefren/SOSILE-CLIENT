import { User } from "../user/user.model";

export interface Post {
  id: number;
  author?: User;
  content: string;
  date: string;
  updated: Date;
  history?: PostHistory[];
  likes?: User[];
  replies?: Post[];
  parents?: Post[];
  isReply?: boolean;
  _count: PostCounts;
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
  replies?: boolean = false;
}
export interface PostHistory {
  id: number;
  content: string;
  date: Date;
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
  updated: Date;
  history?: PostHistory[];
  liked?: Boolean;
  _count?: PostCounts;
}
