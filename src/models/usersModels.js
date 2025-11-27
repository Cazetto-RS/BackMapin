import pool from '../database/data.js'
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => {
  try {
    const sql = `
      SELECT *
      FROM users 
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
      FROM users 
      WHERE id = $1;
    `;
    const result = await pool.query(sql, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getByEmail = async (email) => {
  try {
    const sql = `
      SELECT *
      FROM users 
      WHERE email = $1
      LIMIT 1;
    `;
    const result = await pool.query(sql, [email]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const createUsers = async ({ nome, email, senha, nivel = 'user' }) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const sql = `
      INSERT INTO users (nome, email, senha, nivel)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;

    const result = await pool.query(sql, [
      nome,
      email,
      senhaHash,
      nivel,
    ]);

    const novoId = result.rows[0].id;

    return await getById(novoId);

  } catch (error) {
    throw error;
  }
};

export const deleteUsers = async (id) => {
  try {
    const exists = await getById(id);
    if (!exists) return false;

    const sql = `DELETE FROM users WHERE id = $1;`;
    await pool.query(sql, [id]);

    return true;
  } catch (error) {
    throw error;
  }
};

export const updateUsers = async (id, dados) => {
  try {
    const { nome, telefone, email, senha, nivel } = dados;

    const campos = [];
    const valores = [];
    let contador = 1;

    if (nome) {
      campos.push(`nome = $${contador++}`);
      valores.push(nome);
    }
    if (email) {
      campos.push(`email = $${contador++}`);
      valores.push(email);
    }
    if (nivel) {
      campos.push(`nivel = $${contador++}`);
      valores.push(nivel);
    }
    if (senha) {
      const hash = await bcrypt.hash(senha, 10);
      campos.push(`senha = $${contador++}`);
      valores.push(hash);
    }

    if (campos.length === 0) {
      throw new Error("Nenhum campo válido enviado para atualização.");
    }

    valores.push(id);

    const sql = `
      UPDATE users
      SET ${campos.join(', ')}
      WHERE id = $${contador}
      RETURNING id, nome, email, nivel, criado_em;
    `;

    const result = await pool.query(sql, valores);

    if (result.rows.length === 0) return null;

    return result.rows[0];

  } catch (error) {
    throw error;
  }
};