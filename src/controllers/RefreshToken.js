import Admin from "../models/authModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    // cek refresh token dari database dengan di cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const admin = await Admin.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!admin[0]) return res.sendStatus(403);
    // verifikasi refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const adminId = admin[0].id;
        const username = admin[0].username;
        const accessToken = jwt.sign(
          { adminId, username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1800s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err);
  }
};
