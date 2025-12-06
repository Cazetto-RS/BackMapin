import crypto from "crypto";
import pool from "../database/data.js";

// Buscar sessão por login_id
const consultarPorLoginId = async (login_id) => {
  try {
    const sql = `
      SELECT *
      FROM sessoes
      WHERE login_id = $1
      LIMIT 1;
    `;

    const result = await pool.query(sql, [login_id]);
    return result.rows[0] || null;

  } catch (error) {
    throw new Error("Erro ao buscar sessão: " + error.message);
  }
};

// Buscar sessão validando token
export const buscarSessao = async (login_id, token) => {
  try {
    const sessao = await consultarPorLoginId(login_id);

    if (!sessao || sessao.token !== token) return null;

    // Verifica expiração
    if (new Date(sessao.validade) < new Date()) return null;

    return sessao;

  } catch (error) {
    throw error;
  }
};

// Criar ou atualizar sessão
export const criar = async (login_id, validadeHoras) => {
  try {
    const token = crypto.randomBytes(64).toString("hex");

    const existente = await consultarPorLoginId(login_id);

    if (existente) {
      // UPDATE
      const sql = `
        UPDATE sessoes
        SET token = $1,
            validade = NOW() + ($2 || ' hours')::interval
        WHERE login_id = $3
        RETURNING *;
      `;

      const result = await pool.query(sql, [token, validadeHoras, login_id]);
      return result.rows[0];
    }

    // INSERT
    const sql = `
      INSERT INTO sessoes (login_id, token, validade)
      VALUES ($1, $2, NOW() + ($3 || ' hours')::interval)
      RETURNING *;
    `;

    const result = await pool.query(sql, [login_id, token, validadeHoras]);
    return result.rows[0];

  } catch (error) {
    throw error;
  }
};

// Estender validade
export const extender = async (login_id, horas) => {
  try {
    const sql = `
      UPDATE sessoes
      SET validade = validade + ($1 || ' hours')::interval
      WHERE login_id = $2;
    `;

    const result = await pool.query(sql, [horas, login_id]);
    return result.rowCount > 0;

  } catch (error) {
    throw error;
  }
};
