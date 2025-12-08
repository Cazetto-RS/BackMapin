import pool from '../database/data.js'

// Helper para evitar duplicação no controller
export const getAllCategories = async (enterpriseId) => {
  try {
    const sql = `
      SELECT * 
      FROM categories 
      WHERE enterprise_id = $1
      ORDER BY id;
    `;
    const result = await pool.query(sql, [enterpriseId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id, enterpriseId) => {
  try {
    const sql = `
      SELECT *
      FROM categories 
      WHERE id = $1 AND enterprise_id = $2;
    `;
    const result = await pool.query(sql, [id, enterpriseId]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getByName = async (nome, enterpriseId) => {
  try {
    const sql = `
      SELECT *
      FROM categories 
      WHERE nome = $1 AND enterprise_id = $2;
    `;
    const result = await pool.query(sql, [nome, enterpriseId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const createCategories = async ({ nome }, enterpriseId) => {
  try {
    const sql = `
      INSERT INTO categories (nome, enterprise_id)
      VALUES ($1, $2)
      RETURNING id;
    `;

    const result = await pool.query(sql, [nome, enterpriseId]);
    const novoId = result.rows[0].id;

    return await getById(novoId, enterpriseId);

  } catch (error) {
    throw error;
  }
};

export const deleteCategories = async (id, enterpriseId) => {
  try {
    const exists = await getById(id, enterpriseId);
    if (!exists) return false;

    const sql = `DELETE FROM categories WHERE id = $1 AND enterprise_id = $2`;
    await pool.query(sql, [id, enterpriseId]);

    return true;
  } catch (error) {
    throw error;
  }
};

export const updateCategories = async (id, dados, enterpriseId) => {
  try {
    const { nome } = dados;

    const campos = [];
    const valores = [];
    let contador = 1;

    if (nome) {
      campos.push(`nome = $${contador++}`);
      valores.push(nome);
    }

    valores.push(id);
    valores.push(enterpriseId);

    const sql = `
      UPDATE categories
      SET ${campos.join(', ')}
      WHERE id = $${contador++} AND enterprise_id = $${contador}
      RETURNING id, nome;
    `;

    const result = await pool.query(sql, valores);

    if (result.rows.length === 0) return null;

    return result.rows[0];

  } catch (error) {
    throw error;
  }
};