import { PostModel } from "@/models/post/post-model";

export interface PostRepository {
  findAllPublic(): Promise<PostModel[]>;
  findById(id: string): Promise<PostModel>;
  findBySlugPublic(id: string): Promise<PostModel>;
  findAll(): Promise<PostModel[]>;

  //MUTATION
  createPost(post: PostModel): Promise<PostModel>;
  deletePost(id: string): Promise<PostModel>;
  updatePost(
    id: string,
    newPostData: Omit<PostModel, "id" | "slug" | "createdAt" | "updatedAt">
  ): Promise<PostModel>;
}
