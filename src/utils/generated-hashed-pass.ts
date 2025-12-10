import { hashPassword } from "@/lib/login/manage-login";

(async () => {
  const myPass = "belele";
  const hashPassBase64 = await hashPassword(myPass);

  console.log({ hashPassBase64 });
})();
