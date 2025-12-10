import { formatDateTime } from "@/utils/formate-dateTime";
import { formatDistanceToNow } from "date-fns";

type PostDateProps = {
  date: string;
};
export default function PostDate({ date }: PostDateProps) {
  return (
    <time
      dateTime={date}
      title={formatDistanceToNow(date)}
      className="text-slate-600 text-sm/tight"
    >
      {formatDateTime(date)}
    </time>
  );
}
