import { Post } from "./post.model";

export interface User {
  id: number;
  username: string;
  email: string;
  profile?: UserProfile;
  posts?: Post[];
  likes?: Post[];
  replies?: Post[];
  following?: User[];
  followers?: User[];
}
export interface UserProfile {
  id: number;
  biography: string;
  userId: number;
}
export class UserRequestOpts {
  id?: boolean = false;
  username?: boolean = false;
  email?: boolean = false;
}
export class UserAuthIncludeOpts {
  followers?: boolean = false;
  following?: boolean = false;
  likes?: boolean = false;
  posts?: boolean = false;
  profile?: boolean = false;
  replies?: boolean = false;
}