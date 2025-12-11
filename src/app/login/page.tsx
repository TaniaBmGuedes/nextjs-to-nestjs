import { LoginForm } from "@/components/admin/LoginForm";
import ErrorMesssage from "@/components/ErrorMessage";
import { isLoginAllowed } from "@/lib/login/allow-login";
import { Metadata, redirect } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  // Reuse the admin login page behavior for the public /login route
  if (!isLoginAllowed()) {
    return (
      <ErrorMesssage
        contentTitle="403"
        content="Free login system using ALLOW_LOGIN"
      />
    );
  }

  return <LoginForm />;
}
