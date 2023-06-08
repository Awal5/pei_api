import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // membuat token di headers Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  // verifikasi token dengan ACCESS_TOKEN_SECRET di .env
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    req.username = decoded.username;
    next();
  });
};
