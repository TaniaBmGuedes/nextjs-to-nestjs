import ErrorMesssage from "@/components/ErrorMessage";
import clsx from "clsx";

export default function NotFoundPage() {
  return (
    <ErrorMesssage
      pageTitle="Page not found"
      contentTitle="404"
      content="Erro 404 - This page does not exists in this website"
    />
  );
}
