import pool from "../database/data.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (enterpriseId) => {
  try {
    const sql = `
      SELECT *
      FROM users 
      WHERE enterprise_id = $1
      ORDER BY id;
    `;
    const result = await pool.query(sql, [enterpriseId]);
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

export const getByCpf = async (cpf) => {
  try {
    const sql = `
      SELECT *
      FROM users 
      WHERE cpf = $1
      LIMIT 1;
    `;
    const result = await pool.query(sql, [cpf]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const createUsers = async ({
  nome,
  cpf,
  senha,
  nivel = "funcionario",
  enterprise_id,
}) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const sql = `
    INSERT INTO users (nome, cpf, senha, nivel, enterprise_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, nome, cpf, nivel, enterprise_id;
    `;

    const result = await pool.query(sql, [nome, cpf, senhaHash, nivel, enterprise_id]);

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

// export const updateUsers = async (id, dados) => {
//   try {
//     const { nome, cpf, senha, nivel } = dados;

//     const campos = [];
//     const valores = [];
//     let contador = 1;

//     if (nome) {
//       campos.push(`nome = $${contador++}`);
//       valores.push(nome);
//     }
//     if (cpf) {
//       campos.push(`cpf = $${contador++}`);
//       valores.push(cpf);
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
//       UPDATE users
//       SET ${campos.join(", ")}
//       WHERE id = $${contador}
//       RETURNING id, nome, cpf, nivel, criado_em;
//     `;

//     const result = await pool.query(sql, valores);

//     if (result.rows.length === 0) return null;

//     return result.rows[0];
//   } catch (error) {
//     throw error;
//   }
// };

export const login = async (cpf, senha) => {
  const user = await getByCpf(cpf);
  console.log("USUÁRIO ENCONTRADO:", user);

  if (!user) return null;

  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) return null;

  delete user.senha;
  return user;
};
