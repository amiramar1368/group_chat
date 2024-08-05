import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_KEY } = process.env;

export default (socket, next) => {
  const token = socket.request.headers.cookie.split("token=")[1];
  jwt.verify(token, ACCESS_TOKEN_KEY, (err, user) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.user = user;
    next();
  });
};
