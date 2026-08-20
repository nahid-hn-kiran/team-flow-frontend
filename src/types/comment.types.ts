export interface CommentAuthor {
  id: string;
  name: string;
  email: string;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;

  author: {
    name: string;
  };

  user: CommentAuthor;
}
