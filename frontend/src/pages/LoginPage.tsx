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

// Componente da página de login
export function LoginPage() {
  // Estados para armazenar o email, senha, mensagem de erro e estado de carregamento
  const [email, setEmail] = useState('user@example.com'); // Email inicial
  const [password, setPassword] = useState(''); // Senha inicial
  const [error, setError] = useState(''); // Mensagem de erro
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const navigate = useNavigate(); // Hook para navegação entre páginas

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    setError(''); // Limpa a mensagem de erro
    setLoading(true); // Define o estado de carregamento como verdadeiro

    try {
      // Faz uma requisição POST para o backend com o email e senha
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      // Armazena os tokens de acesso e atualização no localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // Redireciona o usuário para a página de dashboard
      navigate('/dashboard');
    } catch (err) {
      // Trata erros da requisição
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 429) {
          // Caso o status seja 429, exibe mensagem de bloqueio temporário
          setError('Muitas tentativas falhas. Seu acesso foi bloqueado temporariamente.');
        } else {
          // Caso contrário, exibe mensagem de email ou senha inválidos
          setError('Email ou senha inválidos.');
        }
      } else {
        // Caso ocorra um erro de conexão
        setError('Erro de conexão. O servidor backend está rodando?');
      }
    } finally {
      // Define o estado de carregamento como falso
      setLoading(false);
    }
  };

  // Retorna o JSX da página de login
  return (
    <Container size={420} my={40}>
      {/* Título da página */}
      <Title ta="center">Bem-vindo!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {/* Link para a página de registro */}
        Não tem uma conta?{' '}
        <Link to="/register" style={{ color: 'var(--mantine-color-anchor)' }}>
          Crie uma agora
        </Link>
      </Text>

      {/* Formulário de login */}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
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
                title="Erro no Login"
                icon={<IconAlertCircle />}
              >
                {error}
              </Alert>
            )}
            {/* Botão de envio do formulário */}
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              Entrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}