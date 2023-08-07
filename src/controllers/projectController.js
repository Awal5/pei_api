import Project from "../models/projectModel.js";
import fs from "fs";

export const getProject = async (req, res) => {
  try {
    const project = await Project.findAll();
    if (project.length === 0)
      return res.status(404).json({ message: "Project Currently Unavailable" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Fetching Data" });
  }
};

export const getProjectById = async (req, res) => {
  const { slug } = req.params;
  try {
    const project = await Project.findOne({ where: { slug: slug } });

    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Fetching Data" });
  }
};

export const createProject = async (req, res) => {
  const name = req.body.name;
  const image = req.file.path;
  const description = req.body.description;

  try {
    if (!name) return res.status(400).json({ message: "Name Must be Fill" });
    if (!image)
      return res.status(422).json({ message: "Image Must be Upload" });
    const project = await Project.create({
      name: name,
      image: image,
      description: description,
    });
    res.status(201).json({ message: "Project Created", data: project });
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Create Project" });
  }
};

export const updateProject = async (req, res) => {
  const { slug } = req.params;
  const name = req.body.name;
  const image = req.file ? req.file.path : null;
  const description = req.body.description;
  try {
    const project = await Project.findOne({ where: { slug: slug } });
    if (!project)
      return res.status(404).json({ message: "Project Not Available" });

    if (image && image !== project.image) {
      fs.unlinkSync(project.image);
    }

    const newProject = await project.update({
      name,
      image,
      description,
    });
    res.status(200).json({ message: "Project Updated", data: newProject });
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Update Project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ where: { slug: slug } });

    if (!project)
      return res.status(404).json({ message: "Project not Available" });

    await project.destroy();

    fs.unlinkSync(project.image);

    res.status(200).json({ message: "Project Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something Wrong When Delete Project" });
  }
};
