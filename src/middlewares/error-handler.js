export default (req, res, next) => {
  const sendError = (statusCode = 500, message = "Internal Server Error") => {
    return res.status(statusCode).json({
      success: false,
      body: null,
      message,
    });
  };
  res.sendError = sendError;
  next();
};
