export interface Comment {
  name: string;
  time: string;
  content: string;
  logo: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CommentAnswer extends Comment {}
export interface CommentQuestion extends Comment {
  answer?: CommentAnswer;
}
