export interface User {
  id: number;
  username: string;
  email: string;
  // profile?: UserProfile;
  // posts?: Post[];
  // likes?: Post[];
  // replies?: Post[];
  following?: User[];
  followers?: User[];
}
export class UserRequestOpts{
  id?: boolean = false;
  username?: boolean = false;
  email?: boolean = false;
  // profile?: UserProfile;
  // posts?: Post[];
  // likes?: Post[];
  // replies?: Post[];
  /* following: boolean = false;
  followers: boolean = false; */

}
export class UserAuthIncludeOpts {
  followers?: boolean = false;
  following?: boolean = false;
  likes?: boolean = false;
  posts?: boolean = false;
  profile?: boolean = false;
  replies?: boolean = false;
}

