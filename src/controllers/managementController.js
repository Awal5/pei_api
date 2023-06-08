import Management from "../models/managementModel.js";
import fs from "fs";

export const getManagement = async (req, res) => {
  try {
    const management = await Management.findAll();
    if (!management)
      return res.status(404).json({ message: "Managements is Empty" });

    res.status(200).json(management);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something Wrong When Fetching Data" });
  }
};

export const getManagementById = async (req, res) => {
  const { id } = req.params;
  try {
    const management = await Management.findOne({ where: { id: id } });

    if (!management)
      return res.status(404).json({ message: "Management Not Found" });

    res.status(200).json(management);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Wrong When Fetching Data" });
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
    if (!image)
      return res.status(422).json({ message: "Image Must Be Upload" });

    await Management.create({
      name: name,
      image: image,
      position: position,
      description: description,
      facebook: `https://facebook.com/${facebook}`,
      twitter: `https://twitter.com/${twitter}`,
      linkedin: `https://linkedin.com/${linkedin}`,
    });
    res.status(201).json({ message: "Management Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something Wrong When Create Management" });
  }
};

export const updateManagement = async (req, res) => {
  const managementId = req.params.id;
  const name = req.body.name;
  const image = req.file.path;
  const position = req.body.position;
  const description = req.body.description;
  const facebook = "https://facebook.com/" + req.body.facebook;
  const twitter = "https://twitter.com/" + req.body.twitter;
  const linkedin = "https://linkedin.com/" + req.body.linkedin;
  try {
    const management = await Management.findByPk(managementId);
    if (!management)
      return res.status(404).json({ message: "Management Not Found" });

    if (image && image !== management.image) {
      fs.unlinkSync(management.image);
    }
    await management.update({
      name,
      image,
      position,
      description,
      facebook,
      twitter,
      linkedin,
    });

    res.status(200).json({ message: "Management Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Wrong When Update Management" });
  }
};

export const deleteManagement = async (req, res) => {
  const managementId = req.params.id;
  try {
    const management = await Management.findByPk(managementId);
    if (!management)
      return res.status(404).json({ message: "Management Not Found" });

    await management.destroy();

    fs.unlinkSync(management.image);

    res.status(200).json({ message: "Management Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Wrong When Delete Management" });
  }
};