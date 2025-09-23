import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate do react-router-dom para navegação entre páginas
import { Button, Container, Paper, Title, Text } from '@mantine/core'; // Importa componentes da biblioteca Mantine para estilização

// Define o componente funcional DashboardPage
export function DashboardPage() {
  const navigate = useNavigate(); // Inicializa o hook useNavigate para redirecionar o usuário

  // Função para realizar o logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Remove o token de acesso do armazenamento local
    localStorage.removeItem('refreshToken'); // Remove o token de atualização do armazenamento local
    navigate('/login'); // Redireciona o usuário para a página de login
  };

  // Retorna o JSX que será renderizado na tela
  return (
    <Container size={420} my={40}> {/* Define um container com largura e margem vertical */}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md"> {/* Cria um papel com borda, sombra e espaçamento */}
        <Title order={2} ta="center"> {/* Define um título centralizado */}
          Dashboard
        </Title>
        <Text ta="center" mt="md"> {/* Adiciona um texto centralizado com margem superior */}
          Bem-vindo! Você está autenticado.
        </Text>
        <Button onClick={handleLogout} fullWidth mt="xl"> {/* Botão que chama a função de logout ao ser clicado */}
          Logout
        </Button>
      </Paper>
    </Container>
  );
}