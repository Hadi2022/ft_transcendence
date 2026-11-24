import type { UserProfile } from "./user.ts"

export type NewPostData = {
    userId: string
	multimediaUrl: string
    caption: string | null
}

export type Post = {
  id : string;
  userId : string;
  multimediaUrl : string;
  caption : string|null;
  createdAt : Date;
  updatedAt : Date;
  user:UserProfile;
}

export type PostDelete = Omit<Post,
    'caption'   |
    'createdAt' |
    'updatedAt' |
    'user'
>

export type UpdatePostData = {
    caption: string | null
}

export type ListPostsResult = {
    data: Post[];
    pagination:{
        total: number;
    }

}
