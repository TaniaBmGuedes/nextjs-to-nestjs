import ErrorMesssage from "../ErrorMessage";
import { PostCoverImage } from "../PostCoverImage";
import { PostSummary } from "../PostSummary";
import { findAllPublicPostsCachedPublic } from "@/lib/post/queries/public";

export default async function PostFeatured() {
  const posts = await findAllPublicPostsCachedPublic();

  if (posts.length <= 0) {
    return (
      <ErrorMesssage
        contentTitle="Ops 😅"
        content="We haven't create a post yet."
      />
    );
  }

  const post = posts[0];

  const postLink = `/post/${post.slug}`;

  return (
    <>
      <section className="grid grid-cols-1 gap-8 mb-16 sm:grid-cols-2 group">
        <PostCoverImage
          linkProps={{
            href: postLink,
          }}
          imageProps={{
            width: 1200,
            height: 720,
            src: post.coverImageUrl,
            alt: post.title,
            priority: true,
          }}
        />

        <PostSummary
          postLink={postLink}
          postHeading="h2"
          createdAt={post.createdAt}
          excerpt={post.excerpt}
          title={post.title}
        />
      </section>
    </>
  );
}
