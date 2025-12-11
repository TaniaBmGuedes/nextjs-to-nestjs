import { getPublicUserFromApi } from "@/lib/user/get-user";
import { UpdateUserForm } from "../UpdateUserForm";
import ErrorMessage from "@/components/ErrorMessage";

export async function UpdateUser() {
  const user = await getPublicUserFromApi();

  if (!user) {
    return (
      <ErrorMessage contentTitle="🫣" content="You need to log in again." />
    );
  }

  return <UpdateUserForm user={user} />;
}
