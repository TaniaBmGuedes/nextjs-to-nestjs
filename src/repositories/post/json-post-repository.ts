import { PostModel } from "@/models/post/post-model";
import { PostRepository } from "./post-repository";
import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";

const ROOT_DIR = process.cwd();
const JSON_POST_FILE_PATH = resolve(
  ROOT_DIR,
  "src",
  "db",
  "seed",
  "posts.json"
);

const simulateWaiInMs = Number(process.env.SIMULATE_WAIT_IN_MS);

export class JsonPostRepository implements PostRepository {
  private async simulateWait() {
    if (simulateWaiInMs <= 0) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, simulateWaiInMs));
  }
  private async readFromDisk(): Promise<PostModel[]> {
    const jsonContent = await readFile(JSON_POST_FILE_PATH, "utf-8");
    const parsedJson = JSON.parse(jsonContent);
    const { posts } = parsedJson;
    return posts;
  }
  async findAllPublic(): Promise<PostModel[]> {
    await this.simulateWait();
    const posts = await this.readFromDisk();
    console.log("\n", this.findAllPublic, "\n");
    return posts.filter((posts) => posts.published);
  }
  async findById(id: string): Promise<PostModel> {
    await this.simulateWait();
    const posts = await this.findAllPublic();
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new Error("There is no post with this id");
    }
    return post;
  }
  async findBySlugPublic(slug: string): Promise<PostModel> {
    await this.simulateWait();
    const posts = await this.findAllPublic();
    const post = posts.find((post) => post.slug === slug);
    if (!post) {
      throw new Error("There is no post with this slug");
    }
    return post;
  }

  async findAll(): Promise<PostModel[]> {
    await this.simulateWait();
    const posts = await this.readFromDisk();
    console.log("\n", this.findAll, "\n");
    return posts;
  }

  async createPost(post: PostModel): Promise<PostModel> {
    const posts = await this.findAll();

    if (!post.id || !post.slug) {
      throw new Error("Post without ID or Slug");
    }

    const idOrSlugExist = posts.find(
      (savedPost) => savedPost.id === post.id || savedPost.slug === post.slug
    );

    if (idOrSlugExist) {
      throw new Error("ID or Slug must be unique");
    }

    posts.push(post);
    await this.writeToDisk(posts);

    return post;
  }

  async deletePost(id: string): Promise<PostModel> {
    const posts = await this.findAll();
    const postIndex = posts.findIndex((p) => p.id === id);

    if (postIndex < 0) {
      throw new Error("Post does not exist");
    }

    const post = posts[postIndex];
    posts.splice(postIndex, 1);
    await this.writeToDisk(posts);

    return post;
  }

  async updatePost(
    id: string,
    newPostData: Omit<PostModel, "id" | "slug" | "createdAt" | "updatedAt">
  ): Promise<PostModel> {
    const posts = await this.findAll();
    const postIndex = posts.findIndex((p) => p.id === id);
    const savedPost = posts[postIndex];

    if (postIndex < 0) {
      throw new Error("Post does not exist");
    }

    const newPost = {
      ...savedPost,
      ...newPostData,
      updatedAt: new Date().toISOString(),
    };
    posts[postIndex] = newPost;
    await this.writeToDisk(posts);
    return newPost;
  }
  private async writeToDisk(posts: PostModel[]): Promise<void> {
    const jsonToString = JSON.stringify({ posts }, null, 2);
    await writeFile(JSON_POST_FILE_PATH, jsonToString, "utf-8");
  }
}
