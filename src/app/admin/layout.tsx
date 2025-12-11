import { requireLoginSessionForApiOrRedirect } from "@/lib/login/manage-login";
import MenuAdmin from "./MenuAdmin";

type AdminPostLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPostLayout({
  children,
}: Readonly<AdminPostLayoutProps>) {
  await requireLoginSessionForApiOrRedirect();

  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
