import Career from "../models/careerModel.js";
import fs from "fs";

export const getCareer = async (req, res) => {
  try {
    const career = await Career.findAll();
    if (career.length === 0)
      return res.status(404).json({ message: "Career Unavailable" });
    res.status(200).json(career);
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Fetching Data" });
  }
};

export const getCareerById = async (req, res) => {
  const { slug } = req.params;
  try {
    const career = await Career.findOne({ where: { slug: slug } });

    if (!career) {
      return res.status(404).json({ message: "Career Not Found" });
    }
    res.status(200).json(career);
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Fetching Data" });
  }
};

export const addCareer = async (req, res) => {
  const title = req.body.title;
  const image = req.file.path;
  const description = req.body.description;

  try {
    if (!title || !description)
      return res.status(400).json({ message: "All Field Must be Fill" });
    if (!image)
      return res.status(422).json({ message: "Image Must be Upload" });
    const career = await Career.create({
      title: title,
      image: image,
      description: description,
    });
    res.status(201).json({ message: "Career Added", data: career });
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Added Career" });
  }
};

export const updateCareer = async (req, res) => {
  const { slug } = req.params;
  const title = req.body.title;
  const image = req.file ? req.file.path : null;

  const description = req.body.description;
  try {
    const career = await Career.findOne({ where: { slug: slug } });
    if (!career)
      return res.status(404).json({ message: "Career Not Available" });

    if (image && image !== career.image) {
      fs.unlinkSync(career.image);
    }

    const newCareer = await career.update({
      title,
      image,
      description,
    });
    res.status(200).json({ message: "Career Updated", data: newCareer });
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Update Career" });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const { slug } = req.params;
    const career = await Career.findOne({ where: { slug: slug } });

    if (!career) return res.status(404).json({ message: "Career Unavailable" });

    await career.destroy();

    fs.unlinkSync(career.image);

    res.status(200).json({ message: "Career Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Delete Career" });
  }
};
