import { requireLoginSessionOrRedirect } from "@/lib/login/manage-login";
import MenuAdmin from "../MenuAdmin";

type PostAdminLayoutProps = {
  children: React.ReactNode;
};

export default async function PostAdminLayout({
  children,
}: Readonly<PostAdminLayoutProps>) {
  await requireLoginSessionOrRedirect();
  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
