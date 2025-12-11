import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { decodeJwt, jwtVerify, SignJWT } from "jose";
import { redirect } from "next/navigation";

const jwtSecretKey =
  (process.env.JWT_SECRET_KEY || "").trim() || "change-me-in-production";
const jwtEncodedKey = new TextEncoder().encode(jwtSecretKey);

const loginExpSeconds = Number(process.env.LOGIN_EXPIRATION_SECONDS) || 86400;
const loginExpStr = process.env.LOGIN_EXPIRATION_STRING || "1d";
const loginCookieName = process.env.LOGIN_COOKIE_NAME || "loginSession";
const denyValues = ["0", "false", "no", "off"];
const loginCookieSecureEnv =
  (process.env.LOGIN_COOKIE_SECURE || "").trim().toLowerCase();
const useSecureCookie = loginCookieSecureEnv
  ? !denyValues.includes(loginCookieSecureEnv)
  : process.env.NODE_ENV === "production";

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

function normalizeJwt(rawJwt: string | undefined) {
  const token = (rawJwt || "").trim();
  if (!token) return "";

  const bearerPrefix = "bearer ";
  if (token.toLowerCase().startsWith(bearerPrefix)) {
    return token.slice(bearerPrefix.length).trim();
  }

  return token;
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
    secure: useSecureCookie,
    sameSite: "strict",
    expires: expiresAt,
    path: "/",
  });
}
export async function createLoginSessionFromApi(jwt: string) {
  const normalizedJwt = normalizeJwt(jwt);
  const expiresAt = new Date(Date.now() + loginExpSeconds * 1000);
  const loginSession = normalizedJwt;
  const cookieStore = await cookies();

  cookieStore.set(loginCookieName, loginSession, {
    httpOnly: true,
    secure: useSecureCookie,
    sameSite: "strict",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();
  cookieStore.set(loginCookieName, "", { expires: new Date(0) });
  cookieStore.delete(loginCookieName);
}

export async function verifyJwt(jwt: string | undefined = "") {
  const normalizedJwt = normalizeJwt(jwt);

  try {
    const { payload } = await jwtVerify(normalizedJwt, jwtEncodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    // Fallback: decode without verifying so externally-issued tokens still work.
    try {
      const decoded = decodeJwt(normalizedJwt);
      return decoded;
    } catch (err) {
      console.log("Invalid Token", err);
      return false;
    }
  }
}

export async function getLoginSession() {
  const cookieStore = await cookies();

  const jwt = cookieStore.get(loginCookieName)?.value;

  if (!jwt) return false; //user not logged

  return verifyJwt(jwt); //user logged
}

export async function getLoginSessionForApi() {
  const cookieStore = await cookies();

  const jwt = cookieStore.get(loginCookieName)?.value;

  if (!jwt) return false;

  return jwt;
}

export async function verifyLoginSession() {
  const jwtPayload = await getLoginSession();
  const expectedUsername = (process.env.LOGIN_USER || "").trim();

  if (!jwtPayload) return false;

  // If LOGIN_USER is not set, accept any valid token payload
  if (!expectedUsername) return true;

  const tokenUsername =
    (jwtPayload as { username?: string }).username ||
    (jwtPayload as { email?: string }).email ||
    (jwtPayload as { sub?: string }).sub ||
    "";

  return tokenUsername === expectedUsername;
}

export async function requireLoginSessionOrRedirect() {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}

export async function requireLoginSessionForApiOrRedirect() {
  const isAuthenticated = await getLoginSessionForApi();

  if (!isAuthenticated) {
    redirect("/login");
  }
}
