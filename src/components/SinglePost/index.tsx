import { findPostBySlugCachedPublic } from "@/lib/post/queries/public";
import Image from "next/image";
import { PostHeading } from "../PostHeading";
import PostDate from "../PostDate";
import { SafeMarkdown } from "../SafeMarkDown";

type SinglePostProps = {
  slug: string;
};
export default async function SinglePost({ slug }: SinglePostProps) {
  const post = await findPostBySlugCachedPublic(slug);

  return (
    <article className="mb-16">
      <header className="group flex flex-col gap-4 mb-4">
        <Image
          src={post.coverImageUrl}
          width={1200}
          height={720}
          alt={post.alt}
          className="rounded-xl"
          title={post.title}
        />
        <PostHeading url={`/post/${post.slug}`}>{post.title}</PostHeading>

        <p>
          {post.author} | <PostDate date={post.createdAt} />
        </p>
      </header>
      <p className="text-xl mb-4 text-slate-600">{post.excerpt}</p>
      <SafeMarkdown content={post.content} />
    </article>
  );
}
