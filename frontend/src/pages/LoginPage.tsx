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
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function LoginPage() {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 429) {
          setError('Muitas tentativas falhas. Seu acesso foi bloqueado temporariamente.');
        } else {
          setError('Email ou senha inválidos.');
        }
      } else {
        setError('Erro de conexão. O servidor backend está rodando?');
      }
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
            {error && (
              <Alert
                variant="light"
                color="red"
                title="Erro no Login"
                icon={<IconAlertCircle />}
              >
                {error}
              </Alert>
            )}
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              Entrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}