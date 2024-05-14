import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_KEY } = process.env;

export default async (req, res, next) => {
  try {
    const {token} = req.cookies;
    if (!token) {
      return res.sendError(401, "No Token Provided");
    }

    jwt.verify(token, ACCESS_TOKEN_KEY, async (err, user) => {
      if (err) {
        return res.sendError(401, "Invalid Token Please signin Again");
      } else {
        req.user = user;
        next();
      }
    });
  } catch (err) {
    return res.sendError();
  }
};
