import Management from "../models/managementModel.js";
import fs, { link } from "fs";

export const getManagement = async (req, res) => {
  try {
    const management = await Management.findAll();
    if (management.length === 0)
      return res.status(404).json({ message: "Direksi Belum Ditambahkan" });

    res.status(200).json(management);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getManagementById = async (req, res) => {
  const { slug } = req.params;
  try {
    const management = await Management.findOne({ where: { slug: slug } });

    if (!management)
      return res.status(404).json({ message: "Direksi Tidak Ditemukan" });

    res.status(200).json(management);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createManagement = async (req, res) => {
  const name = req.body.name;
  const image = req.file.path;
  const position = req.body.position;
  const description = req.body.description;
  const facebook = req.body.facebook;
  const twitter = req.body.twitter;
  const linkedin = req.body.linkedin;

  try {
    if (!name || !position || !description)
      return res.status(400).json({ message: "Field Harus Diisi" });
    if (!image)
      return res.status(422).json({ message: "Gambar Harus Diupload" });

    const management = await Management.create({
      name: name,
      image: image,
      position: position,
      description: description,
      facebook: facebook ? facebook : "",
      twitter: twitter ? twitter : "",
      linkedin: linkedin ? linkedin : "",
    });
    res
      .status(201)
      .json({ message: "Manajemen Ditambahkan", data: management });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateManagement = async (req, res) => {
  const { slug } = req.params;
  const name = req.body.name;
  const image = req.file ? req.file.path : null;
  const position = req.body.position;
  const description = req.body.description;
  const facebook = req.body.facebook;
  const twitter = req.body.twitter;
  const linkedin = req.body.linkedin;

  try {
    const management = await Management.findOne({ where: { slug: slug } });
    if (!management)
      return res.status(404).json({ message: "Direksi Tidak Ditemukan" });

    if (image && image !== management.image) {
      fs.unlinkSync(management.image);
    }
    const newManagement = await management.update({
      name: name || management.name,
      image: image || management.image,
      position: position || management.position,
      description: description || management.description,
      facebook: facebook || management.facebook,
      twitter: twitter || management.twitter,
      linkedin: linkedin || management.linkedin,
    });

    res.status(200).json({ message: "Direksi Diupdate", data: newManagement });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteManagement = async (req, res) => {
  const { slug } = req.params;
  try {
    const management = await Management.findOne({ where: { slug: slug } });
    if (!management)
      return res.status(404).json({ message: "Direksi Tidak Ditemukan" });

    await management.destroy();

    fs.unlinkSync(management.image);

    res.status(200).json({ message: "Direksi Dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
