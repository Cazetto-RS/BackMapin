import pool from '../database/data.js'
import bcrypt from 'bcryptjs';
import { gerarCodigo } from '../utils/codeGenerator.js';

export const getAllEnterprise = async () => {
  try {
    const sql = `
      SELECT *
      FROM enterprise 
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
      FROM enterprise 
      WHERE id = $1;
    `;
    const result = await pool.query(sql, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getByCnpj = async (cnpj) => {
  try {
    const sql = `
      SELECT *
      FROM enterprise 
      WHERE cnpj = $1
      LIMIT 1;
    `;
    const result = await pool.query(sql, [cnpj]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const createEnterprise = async ({ razao_social, nome, cnpj, senha, localizacao }) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const sql = `
      INSERT INTO enterprise (razao_social, nome, cnpj, senha, localizacao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;

    const result = await pool.query(sql, [
      razao_social,
      nome,
      cnpj,
      senhaHash,
      localizacao
    ]);

    const novoId = result.rows[0].id;

    return await getById(novoId);

  } catch (error) {
    throw error;
  }
};

export const deleteEnterprise = async (id) => {
  try {
    const exists = await getById(id);
    if (!exists) return false;

    const sql = `DELETE FROM enterprise WHERE id = $1;`;
    await pool.query(sql, [id]);

    return true;
  } catch (error) {
    throw error;
  }
};

export const login = async (cnpj, senha) => {
    const enterprise = await getByCnpj(cnpj);

    if (!enterprise) return null;

    const senhaValida = await bcrypt.compare(senha, enterprise.senha);
    if (!senhaValida) return null;

    delete enterprise.senha;
    return enterprise;
};


// export const updateEnterprise = async (id, dados) => {
//   try {
//     const { razao_social, nome, cnpj, senha, localizacao } = dados;

//     const campos = [];
//     const valores = [];
//     let contador = 1;

//     if (nome) {
//       campos.push(`nome = $${contador++}`);
//       valores.push(nome);
//     }
//     if (email) {
//       campos.push(`email = $${contador++}`);
//       valores.push(email);
//     }
//     if (nivel) {
//       campos.push(`nivel = $${contador++}`);
//       valores.push(nivel);
//     }
//     if (senha) {
//       const hash = await bcrypt.hash(senha, 10);
//       campos.push(`senha = $${contador++}`);
//       valores.push(hash);
//     }

//     if (campos.length === 0) {
//       throw new Error("Nenhum campo válido enviado para atualização.");
//     }

//     valores.push(id);

//     const sql = `
//       UPDATE enterprise
//       SET ${campos.join(', ')}
//       WHERE id = $${contador}
//       RETURNING id, nome, email, nivel, criado_em;
//     `;

//     const result = await pool.query(sql, valores);

//     if (result.rows.length === 0) return null;

//     return result.rows[0];

//   } catch (error) {
//     throw error;
//   }
// };