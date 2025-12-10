import { JsonPostRepository } from "@/repositories/post/json-post-repository";
import { drizzleDb } from ".";
import { postsTable } from "./schema";

(async () => {
  const jsonRepo = await new JsonPostRepository();

  const posts = await jsonRepo.findAll();

  try {
    await drizzleDb.delete(postsTable); //clean database
    await drizzleDb.insert(postsTable).values(posts);
  } catch (e) {
    console.log("An error occurred while insert data in database...", e);
  }
})();
