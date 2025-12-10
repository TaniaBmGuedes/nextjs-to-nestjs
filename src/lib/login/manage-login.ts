import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { redirect } from "next/navigation";

const jwtSecretKey =
  (process.env.JWT_SECRET_KEY || "").trim() || "change-me-in-production";
const jwtEncodedKey = new TextEncoder().encode(jwtSecretKey);

const loginExpSeconds = Number(process.env.LOGIN_EXPIRATION_SECONDS) || 86400;
const loginExpStr = process.env.LOGIN_EXPIRATION_STRING || "1d";
const loginCookieName = process.env.LOGIN_COOKIE_NAME || "loginSession";

type JwtPayload = {
  username: string;
  expiresAt: Date;
};

export async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, 10);
  const base64 = Buffer.from(hash).toString("base64");
  return base64;
}

export async function verifyPassword(password: string, storedHash: string) {
  const hash = decodeHash(storedHash);

  if (!hash) return false;

  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log("error in verify password", error);
    return false;
  }
}

function decodeHash(value: string) {
  if (!value) return "";

  if (value.startsWith("$2")) return value;

  const decoded = Buffer.from(value, "base64").toString("utf-8");

  if (decoded.startsWith("$2")) return decoded;

  return "";
}

export async function signJwt(jwtPayload: JwtPayload) {
  return new SignJWT(jwtPayload)
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setIssuedAt()
    .setExpirationTime(loginExpStr)
    .sign(jwtEncodedKey);
}

export async function createLoginSession(username: string) {
  const expiresAt = new Date(Date.now() + loginExpSeconds * 1000);
  const loginSession = await signJwt({ username, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(loginCookieName, loginSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
  });
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();
  cookieStore.set(loginCookieName, "", { expires: new Date(0) });
  cookieStore.delete(loginCookieName);
}

export async function verifyJwt(jwt: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(jwt, jwtEncodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    console.log("Invalid Token");
    return false;
  }
}

export async function getLoginSession() {
  const cookieStore = await cookies();

  const jwt = cookieStore.get(loginCookieName)?.value;

  if (!jwt) return false; //user not logged

  return verifyJwt(jwt); //user logged
}

export async function verifyLoginSession() {
  const jwtPayload = await getLoginSession();
  const expectedUsername = (process.env.LOGIN_USER || "belele").trim();

  if (!jwtPayload) return false;

  return jwtPayload?.username === expectedUsername;
}

export async function requireLoginSessionOrRedirect() {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}
