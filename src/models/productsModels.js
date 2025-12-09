import pool from '../database/data.js'

// Helper para evitar duplicação no controller
export const getAllProducts = async (enterpriseId) => {
  try {
    const sql = `
      SELECT * 
      FROM products 
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
      FROM products 
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
      FROM products 
      WHERE nome = $1 AND enterprise_id = $2;
    `;
    const result = await pool.query(sql, [nome, enterpriseId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const createProducts = async ({ nome, categoria_id, location_id, quantidade, descricao, codigo_barras, foto_url, valor, marca }, enterpriseId) => {
  try {
    const sql = `
      INSERT INTO products (nome, categoria_id, location_id, quantidade, descricao, codigo_barras, foto_url, valor, marca, enterprise_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `;

    const result = await pool.query(sql, [nome, categoria_id, location_id, quantidade, descricao, codigo_barras, foto_url, valor, marca, enterpriseId]);
    const novoId = result.rows[0].id;

    return await getById(novoId, enterpriseId);

  } catch (error) {
    throw error;
  }
};

export const deleteProducts = async (id, enterpriseId) => {
  try {
    const exists = await getById(id, enterpriseId);
    if (!exists) return false;

    const sql = `DELETE FROM products WHERE id = $1 AND enterprise_id = $2`;
    await pool.query(sql, [id, enterpriseId]);

    return true;
  } catch (error) {
    throw error;
  }
};

export const updateProducts = async (id, dados, enterpriseId) => {
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
      UPDATE products
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