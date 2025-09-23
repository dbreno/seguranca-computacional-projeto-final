import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar os tokens guardados
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Redirecionar para a página de login
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard (Página Protegida)</h2>
      <p>Bem-vindo! Você está autenticado.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}