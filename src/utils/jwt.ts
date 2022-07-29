import jwt from 'jsonwebtoken'

export function signJWT(object: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: jwt.SignOptions | undefined){
const signinKey = `${process.env.ACCESS_TOKEN_PRIVATE_KEY}`

return jwt.sign(object, signinKey,{
  ...(options && options),
  algorithm: "RS256"
})
}

const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY
const refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY

export function verifyJWT(token: string, keyName: typeof accessTokenPrivateKey | typeof refreshTokenPrivateKey ){

}