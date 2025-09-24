// src/pages/LoginPage.tsx

import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Paper,
  Title,
  Text,
  Stack,
  // O Alert não é mais necessário aqui
} from '@mantine/core';
// Importe o hook de notificações
import { notifications } from '@mantine/notifications';

// Componente da página de login
export function LoginPage() {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');
  // O estado de erro não é mais necessário para exibir o alerta
  // const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // setError(''); // Não é mais necessário
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // 4. Mostra a notificação de sucesso (toast)
      notifications.show({
        title: 'Login realizado!',
        message: 'Seu login foi realizado com sucesso.',
        color: 'green',
      });

      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Erro de conexão. O servidor backend está rodando?';
      let title = 'Erro no Login';

      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 429) {
          title = 'Limite de Tentativas Excedido';
          errorMessage = 'Muitas tentativas falhas. Seu acesso foi bloqueado temporariamente.';
        } else {
          errorMessage = err.response.data.message;
        }
      }

      // Mostra a notificação de erro
      notifications.show({
        title,
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Bem-vindo!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Não tem uma conta?{' '}
        <Link to="/register" style={{ color: 'var(--mantine-color-anchor)' }}>
          Crie uma agora
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* O componente Alert foi removido daqui */}
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              Entrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}