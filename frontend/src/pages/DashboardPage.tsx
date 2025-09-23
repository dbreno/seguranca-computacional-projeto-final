import { useNavigate } from 'react-router-dom';
import { Button, Container, Paper, Title, Text } from '@mantine/core';

export function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} ta="center">
          Dashboard
        </Title>
        <Text ta="center" mt="md">
          Bem-vindo! Você está autenticado.
        </Text>
        <Button onClick={handleLogout} fullWidth mt="xl">
          Logout
        </Button>
      </Paper>
    </Container>
  );
}