import pool from "../../config/db.connection.js";

let q, result;

const getItems = async (req) => {
  const { category_id } = req.query || {};
  try {
    q = category_id
      ? `SELECT * FROM Inventory WHERE category_id  = ${category_id}`
      : "SELECT * FROM Inventory";
    [result] = await pool.query(q);
    return {
      status: true,
      statusCode: 200,
      inventory: result,
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: error.message,
    };
  }
};
const addItem = async (req) => {
  try {
    const {
      category_id,
      name,
      description,
      img,
      is_veg,
      cost_price,
      discount,
      sku,
      quantity,
      status,
      preparation_time,
    } = req.body;

    if (!category_id)
      return {
        status: false,
        statusCode: 400,
        message: "Data missing",
      };
    q = `
    INSERT INTO Inventory (
      category_id, name, description, img, is_veg, 
      cost_price, discount, sku, quantity, status, preparation_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    [result] = await pool.query(q, [
      category_id,
      name.toLowerCase(),
      description,
      img,
      is_veg,
      cost_price,
      discount,
      sku,
      quantity,
      status,
      preparation_time,
    ]);
    if (result.affectedRows < 1) {
      return { status: false, statusCode: 400, error: result };
    }
    return {
      status: true,
      statusCode: 201,
      message: "The iteam has been added!",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: error.message,
    };
  }
};

const deleteItem = async (req) => {
  try {
    let { id } = req.body;

    if (!id)
      return {
        status: false,
        statusCode: 400,
        message: "Data missing",
      };
    q = "DELETE FROM Inventory WHERE id = ?";
    [result] = await pool.query(q, id);
    if (result.affectedRows < 1)
      return {
        status: false,
        statusCode: 400,
        message: "No rows affected",
      };

    return {
      status: true,
      statusCode: 200,
      message: "The item has been deleted!",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: error.message,
    };
  }
};

const updateItem = async (req) => {
  try {
    const { id, ...params } = req.body;
    if (!id)
      return {
        status: false,
        statusCode: 400,
        message: "Data missing",
      };

    for (let key in params)
      if (!params[key] || key === "id") delete params[key]; // removing the empty params
    const values = Object.values(params);
    values.push(id);

    let setClause = Object.keys(params)
      .map((key) => `${key} = ?`)
      .join(",");

    setClause = setClause + `, updated_at = CURRENT_TIMESTAMP`;

    q = `UPDATE Inventory SET ${setClause} WHERE id = ?`;

    [result] = await pool.query(q, values);
    if (result.affectedRows === 0) {
      return {
        status: true,
        statusCode: 200,
        message: "No item found or no changes made.",
      };
    }

    return {
      status: true,
      statusCode: 200,
      message: "Item updated successfully.",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: error.message,
    };
  }
};

export default { addItem, deleteItem, updateItem, getItems };
