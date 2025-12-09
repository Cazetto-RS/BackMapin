import pool from '../database/data.js'

// Helper para evitar duplicação no controller
export const getAllLocations = async (enterpriseId) => {
  try {
    const sql = `
      SELECT * 
      FROM locations 
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
      FROM locations 
      WHERE id = $1 AND enterprise_id = $2;
    `;
    const result = await pool.query(sql, [id, enterpriseId]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getByFilter = async (corredor, prateleira, setor, enterpriseId) => {
  try {

    const sql = `
        SELECT *
        FROM locations
        WHERE enterprise_id = $1
        AND ($2::text IS NULL OR corredor = $2)
        AND ($3::text IS NULL OR prateleira = $3)
        AND ($4::text IS NULL OR setor = $4)
    `;

    const values = [
        enterpriseId,
        corredor || null,
        prateleira || null,
        setor || null
    ];

    const result = await pool.query(sql, [corredor, prateleira, setor, enterpriseId]);
    return result.rows, values;
  } catch (error) {
    throw error;
  }
};

export const createLocations = async ({ corredor, prateleira, setor }, enterpriseId) => {
  try {
    const sql = `
      INSERT INTO locations (corredor, prateleira, setor, enterprise_Id)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;

    const result = await pool.query(sql, [corredor, prateleira, setor, enterpriseId]);
    const novoId = result.rows[0].id;

    return await getById(novoId, enterpriseId);

  } catch (error) {
    throw error;
  }
};

export const deleteLocations = async (id, enterpriseId) => {
  try {
    const exists = await getById(id, enterpriseId);
    if (!exists) return false;

    const sql = `DELETE FROM locations WHERE id = $1 AND enterprise_id = $2`;
    await pool.query(sql, [id, enterpriseId]);

    return true;
  } catch (error) {
    throw error;
  }
};

export const updateLocations = async (id, dados, enterpriseId) => {
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
      UPDATE locations
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