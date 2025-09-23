import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:3000/users', { name, email, password });
      setSuccess('Utilizador registado com sucesso! Pode agora fazer o login.');
    } catch (err) {
      setError('Falha ao registar. O email já pode existir.');
    }
  };

  return (
    <div>
      <h2>Registar Novo Utilizador</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome Completo"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Registar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <p>
        Já tem uma conta? <Link to="/login">Faça o login aqui</Link>
      </p>
    </div>
  );
}