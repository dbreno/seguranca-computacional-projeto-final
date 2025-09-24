// src/pages/RegisterPage.tsx

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
  // O Alert não é mais necessário
} from '@mantine/core';
// O IconAlertCircle não é mais necessário
import { notifications } from '@mantine/notifications';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      // 1. Tenta registrar o usuário
      await axios.post('http://localhost:3000/users', { name, email, password });

      // 2. Se o registro for bem-sucedido, tenta fazer o login
      const loginResponse = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      // 3. Armazena os tokens no localStorage
      localStorage.setItem('accessToken', loginResponse.data.accessToken);
      localStorage.setItem('refreshToken', loginResponse.data.refreshToken);

      // 4. Mostra a notificação de sucesso (toast)
      notifications.show({
        title: 'Cadastro realizado!',
        message: 'Seu cadastro foi realizado com sucesso.',
        color: 'green',
      });

      // 5. Redireciona para o dashboard
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Erro de conexão. O servidor backend está rodando?';
      let title = 'Erro no Cadastro';

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
      <Title ta="center">Criar Conta</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Já tem uma conta?{' '}
        <Link to="/login" style={{ color: 'var(--mantine-color-anchor)' }}>
          Faça o login
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              Registrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}