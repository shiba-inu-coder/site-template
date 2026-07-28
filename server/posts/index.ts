import { PostRepository } from "#sg/adapters/repository/mongodb/post.repository";
import { PostUsecase } from "./post.usecase";
import { PostController } from "./post.controller";

const postRepo = new PostRepository();
const postUsecase = new PostUsecase(postRepo);
const postController = new PostController(postUsecase);

export class PostComposition {
  static GetBySlug = postController.getBySlug;
}
