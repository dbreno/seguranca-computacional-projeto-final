import { Routes, Route, Navigate } from 'react-router-dom'; // Importa os componentes necessários do react-router-dom para gerenciar as rotas
import { LoginPage } from './pages/LoginPage'; // Importa o componente da página de login
import { RegisterPage } from './pages/RegisterPage'; // Importa o componente da página de registro
import { DashboardPage } from './pages/DashboardPage'; // Importa o componente da página do dashboard
import { ProtectedRoute } from './components/ProtectedRoute'; // Importa o componente de rota protegida

function App() {
  return (
    <Routes>
      {/* Define a rota para a página de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Define a rota para a página de registro */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Define uma rota protegida */}
      <Route element={<ProtectedRoute />}>
        {/* Define a rota para a página do dashboard, que só será acessível se o ProtectedRoute permitir */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Define uma rota padrão que redireciona para o dashboard caso a rota acessada não exista */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App; // Exporta o componente App como padrão