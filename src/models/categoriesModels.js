import pool from '../database/data.js'

export const getAllCategories = async () => {
  try {
    const sql = `
      SELECT * 
      FROM categories 
      ORDER BY id;
    `;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const sql = `
      SELECT *
      FROM categories 
      WHERE id = $1;
    `;
    const result = await pool.query(sql, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getByName = async (nome) => {
  try {
    const sql = `
      SELECT *
      FROM categories 
      WHERE nome = $1;
    `;
    const result = await pool.query(sql, [nome]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const createCategories = async ({ nome }) => {
  try {
    const sql = `
      INSERT INTO categories (nome)
      VALUES ($1)
      RETURNING id;
    `;

    const result = await pool.query(sql, [
      nome
    ]);

    const novoId = result.rows[0].id;

    return await getById(novoId);

  } catch (error) {
    throw error;
  }
};

export const deleteCategories = async (id) => {
  try {
    const exists = await getById(id);
    if (!exists) return false;

    const sql = `DELETE FROM categories WHERE id = $1;`;
    await pool.query(sql, [id]);

    return true;
  } catch (error) {
    throw error;
  }
};

export const updateCategories = async (id, dados) => {
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

    const sql = `
      UPDATE categories
      SET ${campos.join(', ')}
      WHERE id = $${contador}
      RETURNING id, nome;
    `;

    const result = await pool.query(sql, valores);

    if (result.rows.length === 0) return null;

    return result.rows[0];

  } catch (error) {
    throw error;
  }
};