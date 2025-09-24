import { Navigate, Outlet } from 'react-router-dom';

// Componente de rota protegida
export const ProtectedRoute = () => {
  // Obtém o token de autenticação armazenado no localStorage
  const token = localStorage.getItem('accessToken');

  // Se não houver token, redireciona o usuário para a página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Se houver token, renderiza o conteúdo da rota protegida (usando o Outlet)
  return <Outlet />;
};