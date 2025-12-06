CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL,
    nivel VARCHAR(20) NOT NULL CHECK (nivel IN ('admin', 'funcionario')),
    enterprise_id INT REFERENCES enterprise(id),
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    enterprise_id INT REFERENCES enterprise(id),
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    corredor VARCHAR(50),
    prateleira VARCHAR(50),
    setor VARCHAR(100),
    descricao TEXT,
    enterprise_id INT REFERENCES enterprise(id)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    categoria_id INT REFERENCES categories(id),
    location_id INT REFERENCES locations(id),
    quantidade INT DEFAULT 0,
    valor DECIMAL(10,2) NOT NULL,
    marca VARCHAR(100),
    codigo_barras VARCHAR(100) UNIQUE,
    foto_url TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE enterprise (
    id SERIAL PRIMARY KEY,
	razao_social VARCHAR(100) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL,
	localizacao VARCHAR(200) NOT NULL,
    code VARCHAR (5),
    criado_em TIMESTAMP DEFAULT NOW()
);

create table sessoes (
 login_id INT NOT NULL,
 token VARCHAR (255),
 validade TIMESTAMPTZ NOT NULL
);

ALTER TABLE users 
ALTER COLUMN nivel SET DEFAULT 'funcionario';

CREATE OR REPLACE FUNCTION generate_enterprise_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    result TEXT := '';
BEGIN
    FOR i IN 1..5 LOOP
        result := result || substr(chars, (random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE enterprise
ALTER COLUMN code SET DEFAULT generate_enterprise_code();