import { formatDateTime, formatRelativeDate } from "@/utils/formate-dateTime";
import { PostHeading } from "../PostHeading";
import PostDate from "../PostDate";

type PostSummaryProps = {
  postHeading: "h1" | "h2";
  postLink: string;
  createdAt: string;
  excerpt: string;
  title: string;
};
export function PostSummary({
  postHeading,
  postLink,
  excerpt,
  createdAt,
  title,
}: PostSummaryProps) {
  return (
    <div className="flex flex-col gap-4 sm:justify-center">
      <PostDate date={createdAt} />

      <PostHeading as={postHeading} url={postLink}>
        {title}
      </PostHeading>

      <p>{excerpt}</p>
    </div>
  );
}
