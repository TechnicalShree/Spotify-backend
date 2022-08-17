import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(400)
      .send({ message: "Access denied, no token provided." });
  }

  jwt.verify(token, process.env.JWSPRIVATEKEY, (error, validToken) => {
    if (error) {
      return res.status(400).send({ message: "Invalid token." });
    } else {
      req.user = validToken;
      next();
    }
  });
};
