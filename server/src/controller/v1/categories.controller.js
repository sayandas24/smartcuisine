import categoriesModel from "../../models/v1/categories.model.js";

const createCategory = async (req, res) => {
  const response = await categoriesModel.createCategory(req);
  res.status(response.statusCode).json(response);
};

const getCategories = async (req, res) => {
  let id = req.body?.id ?? null;
  const response = await categoriesModel.getCategories(id);
  res.status(response.statusCode).json(response);
};
const deleteCategory = async (req, res) => {
  const response = await categoriesModel.deleteCategory(req);
  res.status(response.statusCode).json(response);
};
const updateCategory = async (req, res) => {
  const response = await categoriesModel.updateCategory(req);
  res.status(response.statusCode).json(response);
};

export default {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
