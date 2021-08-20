import { User } from "./user.model";

export interface Post {
  id: number;
  author?: User;
  content: string;
  date: Date;
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
