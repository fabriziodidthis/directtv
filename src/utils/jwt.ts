import jwt from "jsonwebtoken";

const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

type TkeyName = typeof accessTokenPrivateKey | typeof refreshTokenPrivateKey;

export function signJWT(
  object: Object,
  keyName: TkeyName,
  options?: jwt.SignOptions | undefined
) {
  const signinKey = Buffer.from(`${keyName}`,"base64").toString("ascii");

  return jwt.sign(object, signinKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}


export function verifyJWT<T>(token: string, keyName: TkeyName,): T | null {
  const publicKey = Buffer.from(`${keyName}`,"base64").toString("ascii");

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
}
