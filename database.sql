CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL,
    nivel VARCHAR(20) NOT NULL CHECK (nivel IN ('admin', 'funcionario')),
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    corredor VARCHAR(50),
    prateleira VARCHAR(50),
    setor VARCHAR(100),
    descricao TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    categoria_id INT REFERENCES categories(id),
    location_id INT REFERENCES locations(id),
    quantidade INT DEFAULT 0,
    codigo_barras VARCHAR(100) UNIQUE,
    foto_url TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users 
ALTER COLUMN nivel SET DEFAULT 'funcionario';