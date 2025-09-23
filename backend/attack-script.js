// attack-script.js

// --- Configuração do Ataque ---
const TARGET_URL = 'http://localhost:3000/auth/login';
const USER_EMAIL = 'user@example.com'; // E-mail correto do usuário
const WRONG_PASSWORD = 'wrongpassword';
const ATTEMPTS = 10; // Número de tentativas de login
// --------------------------

console.log(`--- Iniciando Simulação de Ataque de Força Bruta ---`);
console.log(`Alvo: ${TARGET_URL}`);
console.log(`Tentando logar como: ${USER_EMAIL}`);
console.log(`--------------------------------------------------\n`);

const attack = async () => {
  for (let i = 1; i <= ATTEMPTS; i++) {
    try {
      console.log(`[Tentativa ${i}] Enviando requisição...`);
      const response = await fetch(TARGET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: USER_EMAIL,
          password: WRONG_PASSWORD,
        }),
      });

      // fetch não lança erro para status HTTP, então verificamos a resposta manualmente
      if (response.ok) {
        // Se a resposta for 2xx, o login foi bem-sucedido (inesperado neste script)
        console.log(
          `--> Resultado: ${response.status} OK (Login bem-sucedido?)`,
        );
      } else {
        // Se a resposta for 401, a tentativa falhou como esperado
        if (response.status === 401) {
          console.log(
            `--> Resultado: ${response.status} Unauthorized (Senha incorreta)`,
          );
        }
        // Se a resposta for 429, o bloqueio foi ativado!
        else if (response.status === 429) {
          console.log(
            `--> Resultado: ${response.status} Too Many Requests (BLOQUEADO! ✅)`,
          );
        } else {
          console.log(
            `--> Resultado: Status ${response.status} (${response.statusText})`,
          );
        }
      }
    } catch (error) {
      // O catch com fetch geralmente pega erros de rede (ex: servidor offline)
      console.error(
        '--> Erro: Não foi possível conectar à API. Ela está em execução?',
      );
      break;
    }
    // Uma pequena pausa para não sobrecarregar o console
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  console.log('\n--- Simulação Concluída ---');
};

attack();