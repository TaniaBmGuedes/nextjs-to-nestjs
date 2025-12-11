const denyValues = ["0", "false", "no", "off"];

export function isLoginAllowed(): boolean {
  const allowLoginEnv = (process.env.ALLOW_LOGIN ?? "").trim().toLowerCase();

  if (allowLoginEnv === "") return true;

  return !denyValues.includes(allowLoginEnv);
}
