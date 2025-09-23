import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('http://localhost:3000/users', { name, email, password });
      setSuccess('Usuário registrado com sucesso! Você já pode fazer o login.');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Falha ao registrar.');
      } else {
        setError('Erro de conexão. O servidor backend está rodando?');
      }
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
            {error && (
              <Alert
                variant="light"
                color="red"
                title="Erro no Registro"
                icon={<IconAlertCircle />}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                variant="light"
                color="green"
                title="Sucesso"
                icon={<IconCheck />}
              >
                {success}
              </Alert>
            )}
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              Registrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}