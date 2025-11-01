import { type Comment } from '../comments/comment.model';

export interface BlogDetail {
  id: number;
  title: string;
  content: string;
  category: number;
  author: number;
  updated_at: string;
  // uri: string;
  // votes: number;
  comments: Comment[];
}
