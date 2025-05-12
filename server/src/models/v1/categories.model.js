import pool from "../../config/db.connection.js";
import othersUtils from "../../utils/others.js";

const createCategory = async (req) => {
  try {
    const { name, description, img } = req.body;

    if (!name || !description || !img)
      return { status: false, error: "Data missing" };

    const user = othersUtils.getUser(req);
    let q = "SELECT role FROM Users WHERE uid = ? AND role = 1";

    let [result] = await pool.query(q, [user.uid]);
    if (result.length === 0)
      return {
        status: false,
        statusCode: 401,
        error: "You don't have permission",
      };

    q = `INSERT INTO Categories (name, description, img) VALUES (?, ? , ?)`;
    [result] = await pool.query(q, [name, description, img]);

    if (result.warningStatus != 0)
      return {
        status: false,
        statusCode: 400,
        error: "Unable to create new category.",
      };

    return { status: true, statusCode: 201, message: "Created!" };
  } catch (error) {
    return { status: false, statusCode: 500, error };
  }
};

const getCategories = async (id) => {
  try {
    const q = id
      ? `SELECT * FROM Categories WHERE id = "${id}"`
      : "SELECT * FROM Categories";

    const result = await pool.query(q);

    return { status: true, statusCode: 200, categories: result[0] };
  } catch (error) {
    return { status: false, statusCode: 500, error: error.message };
  }
};

const deleteCategory = async (req) => {
  try {
    const user = othersUtils.getUser(req);
    const id = req.body.id;
    let q = "SELECT role FROM Users WHERE uid = ? AND role = 1";
    if (!id)
      return {
        status: false,
        statusCode: 400,
        error: "Enter the category ID.",
      };

    let result = await pool.query(q, [user.uid]);
    if (result[0].length === 0)
      return {
        status: false,
        statusCode: 401,
        error: "You don't have permission",
      };

    q = "DELETE FROM Categories WHERE id = ?";
    result = await pool.query(q, id);
    if (result[0].affectedRows <= 0)
      return {
        status: false,
        statusCode: 400,
        error: "Unable to delete this category!",
      };

    return {
      status: true,
      statusCode: 200,
      error: "The category has been deleted.",
    };
  } catch (error) {
    return {
      status: true,
      statusCode: 500,
      error: error.message,
    };
  }
};

const updateCategory = async (req) => {
  try {
    const user = othersUtils.getUser(req);
    const { id, name, description, img } = req.body;
    let updates = [];
    if (name) updates.push(`name = "${name}"`);
    if (description) updates.push(`description = "${description}"`);
    if (img) updates.push(`img = "${img}"`);

    let q = "SELECT role FROM Users WHERE uid = ? AND role = 1";
    if (!id)
      return {
        status: false,
        statusCode: 400,
        error: "Enter the category ID.",
      };

    let [result] = await pool.query(q, [user.uid]);
    if (result.length === 0)
      return {
        status: false,
        statusCode: 401,
        error: "You don't have permission",
      };

    q = `UPDATE Categories SET ${updates.join(",")} WHERE id = ? ;`;
    [result] = await pool.query(q, [id]);

    if (result.changedRows <= 0)
      return {
        status: true,
        statusCode: 200,
        message: "No changes made.",
      };

    return {
      status: true,
      statusCode: 200,
      message: "Category updated successfully!",
    };
  } catch (error) {
    return {
      status: true,
      statusCode: 500,
      error: error.message,
    };
  }
};
export default {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
