// Inicializa um array vazio para armazenar sessões
let sessoes = [];

export function addSessao(login_id, token) {
  sessoes.push({
    login_id,
    token,
    criadoEm: Date.now()
  });
}

export function buscarSessao(login_id, token) {
  return sessoes.find(s => (s.login_id === login_id && s.token === token));
}

// Função para limpar sessões expiradas
function limparSessoes() {
  const agora = Date.now();
  const umaHora = 60 * 60 * 1000; // 1 hora em ms

  sessoes = sessoes.filter(session => (agora - session.criadoEm) < umaHora);

  console.log(`[CLEANUP] Sessões ativas: ${sessoes.length}`);
}

// Configura execução automática a cada 1h
setInterval(limparSessoes, 60 * 60 * 1000); // 1h