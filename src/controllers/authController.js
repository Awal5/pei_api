import Admin from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAdmin = async (req, res) => {
  try {
    // memanggil tabel admin dengan attibute yang telah ditentukan
    const admin = await Admin.findAll({
      attributes: ["id", "username"],
    });
    res.json(admin);
  } catch (error) {
    console.log(error);
  }
};

export const register = async (req, res) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Admin.create({
      username: username,
      password: hashPassword,
    });
    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // mencari mencocokan username
    const admin = await Admin.findOne({ where: { username } });
    if (!admin)
      return res.status(404).json({ msg: "Username Tidak Ditemukan" });
    // mencocokan password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });
    const { id: adminId } = admin;
    // membuat access token
    const accessToken = jwt.sign(
      { adminId, username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );
    // membuat refresh token
    const refreshToken = jwt.sign(
      { adminId, username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // update refresh token ke tabel admin
    await Admin.update(
      { refresh_token: refreshToken },
      { where: { id: adminId } }
    );

    // membuat cookie dari refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log("Set refreshToken cookie:", res.cookie);

    // menghasilkan access token
    res.json({ accessToken, message: "Login Berhasil" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
    console.log(err);
  }
};

export const logout = async (req, res) => {
  // mencocokan refresh token yang ada di database dengan di cokkie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const admin = await Admin.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  //jika tidak ada admin, kembalikan status 204
  if (!admin[0]) return res.sendStatus(204);
  const adminId = admin[0].id;
  // update refresh token di database menjadi null
  await Admin.update(
    { refresh_token: null },
    {
      where: {
        id: adminId,
      },
    }
  );
  // menghapus cookie
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
