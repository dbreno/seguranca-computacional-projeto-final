// Importa o React, que é necessário para criar componentes e utilizar funcionalidades do React
import React from 'react';

// Importa o ReactDOM, que é usado para renderizar a aplicação no DOM
import ReactDOM from 'react-dom/client';

// Importa o componente principal da aplicação (App)
import App from './App.tsx';

// Importa o BrowserRouter, que é usado para gerenciar as rotas da aplicação
import { BrowserRouter } from 'react-router-dom';

// Importa os estilos padrão da biblioteca Mantine
import '@mantine/core/styles.css';

// Importa o MantineProvider, que é usado para configurar o tema e outras propriedades globais da biblioteca Mantine
import { MantineProvider } from '@mantine/core';

// Renderiza a aplicação no elemento HTML com o ID 'root'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Configura o MantineProvider com o tema padrão "dark" */}
    <MantineProvider defaultColorScheme="dark">
      {/* Configura o BrowserRouter para gerenciar as rotas da aplicação */}
      <BrowserRouter>
        {/* Renderiza o componente principal da aplicação */}
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);