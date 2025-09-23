// attack-script.js

// --- Configuração do Ataque ---
// URL do endpoint de login que será alvo do ataque
const TARGET_URL = 'http://localhost:3000/auth/login';
// E-mail correto do usuário que será usado na tentativa de login
const USER_EMAIL = 'user@example.com';
// Senha incorreta que será usada em todas as tentativas
const WRONG_PASSWORD = 'wrongpassword';
// Número de tentativas de login que serão realizadas
const ATTEMPTS = 10;
// --------------------------

// Exibe no console o início da simulação de ataque
console.log(`--- Iniciando Simulação de Ataque de Força Bruta ---`);
console.log(`Alvo: ${TARGET_URL}`);
console.log(`Tentando logar como: ${USER_EMAIL}`);
console.log(`--------------------------------------------------\n`);

// Função principal que realiza o ataque
const attack = async () => {
  // Loop para realizar o número de tentativas configurado
  for (let i = 1; i <= ATTEMPTS; i++) {
    try {
      // Exibe no console qual tentativa está sendo realizada
      console.log(`[Tentativa ${i}] Enviando requisição...`);
      
      // Envia uma requisição POST para o endpoint de login
      const response = await fetch(TARGET_URL, {
        method: 'POST', // Método HTTP usado na requisição
        headers: {
          'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify({
          email: USER_EMAIL, // E-mail do usuário
          password: WRONG_PASSWORD, // Senha incorreta
        }),
      });

      // Verifica manualmente o status da resposta, já que fetch não lança erro para status HTTP
      if (response.ok) {
        // Caso o status seja 2xx, o login foi bem-sucedido (inesperado neste script)
        console.log(
          `--> Resultado: ${response.status} OK (Login bem-sucedido?)`,
        );
      } else {
        // Caso o status seja 401, a tentativa falhou como esperado
        if (response.status === 401) {
          console.log(
            `--> Resultado: ${response.status} Unauthorized (Senha incorreta)`,
          );
        }
        // Caso o status seja 429, o bloqueio foi ativado
        else if (response.status === 429) {
          console.log(
            `--> Resultado: ${response.status} Too Many Requests (BLOQUEADO! ✅)`,
          );
        } else {
          // Outros status HTTP são exibidos com o código e a descrição
          console.log(
            `--> Resultado: Status ${response.status} (${response.statusText})`,
          );
        }
      }
    } catch (error) {
      // Captura erros de rede, como servidor offline ou problemas de conexão
      console.error(
        '--> Erro: Não foi possível conectar à API. Ela está em execução?',
      );
      break; // Interrompe o loop em caso de erro de rede
    }
    // Pausa de 200ms entre as tentativas para não sobrecarregar o console
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  // Exibe no console que a simulação foi concluída
  console.log('\n--- Simulação Concluída ---');
};

// Chama a função principal para iniciar o ataque
attack();