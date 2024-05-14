import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_KEY } = process.env;

export function getUserByToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_KEY, (err, user) => {
    if (err) {
      return false;
    }
    return user;
  });
//   return user;
}
