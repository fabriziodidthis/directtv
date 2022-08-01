import { DocumentType } from "@typegoose/typegoose";
import SessionModel from "../model/session.model";
import { User } from "../model/user.model";
import { signJWT } from "../utils/jwt";

export async function createSession({ userID }: { userID: string }) {
  return SessionModel.create({ user: userID });
}

const refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY
const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY

export async function signRefreshToken({ userID }: { userID: string }) {
  const session = await createSession({
    userID,
  });

  const refreshToken = signJWT(
    {
      session: session._id,
    },
    refreshTokenPrivateKey, {
      expiresIn: '30m'
    }
  );

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = user.toJSON();

  const accessToken = signJWT(payload, accessTokenPrivateKey,{
    expiresIn:'30m'
  });

  return accessToken;
}
