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

// Função que define a página de registro
export function RegisterPage() {
  // Estados para armazenar os valores dos campos e mensagens de feedback
  const [name, setName] = useState(''); // Nome do usuário
  const [email, setEmail] = useState(''); // Email do usuário
  const [password, setPassword] = useState(''); // Senha do usuário
  const [error, setError] = useState(''); // Mensagem de erro
  const [success, setSuccess] = useState(''); // Mensagem de sucesso
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    setError(''); // Limpa a mensagem de erro
    setSuccess(''); // Limpa a mensagem de sucesso
    setLoading(true); // Define o estado de carregamento como verdadeiro

    try {
      // Faz uma requisição POST para registrar o usuário
      await axios.post('http://localhost:3000/users', { name, email, password });
      setSuccess('Usuário registrado com sucesso! Você já pode fazer o login.'); // Define a mensagem de sucesso
    } catch (err) {
      // Trata erros da requisição
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Falha ao registrar.'); // Define a mensagem de erro retornada pelo backend
      } else {
        setError('Erro de conexão. O servidor backend está rodando?'); // Define uma mensagem de erro genérica
      }
    } finally {
      setLoading(false); // Define o estado de carregamento como falso
    }
  };

  // Retorna o JSX da página
  return (
    <Container size={420} my={40}>
      {/* Título da página */}
      <Title ta="center">Criar Conta</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Já tem uma conta?{' '}
        {/* Link para a página de login */}
        <Link to="/login" style={{ color: 'var(--mantine-color-anchor)' }}>
          Faça o login
        </Link>
      </Text>

      {/* Formulário de registro */}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            {/* Campo de entrada para o nome */}
            <TextInput
              label="Nome"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {/* Campo de entrada para o email */}
            <TextInput
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Campo de entrada para a senha */}
            <PasswordInput
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Exibe mensagem de erro, se houver */}
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
            {/* Exibe mensagem de sucesso, se houver */}
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
            {/* Botão de envio do formulário */}
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              Registrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}