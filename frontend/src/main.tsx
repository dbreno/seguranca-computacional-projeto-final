// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import '@mantine/core/styles.css';
// Importe o CSS das notificações
import '@mantine/notifications/styles.css'; 
import { MantineProvider } from '@mantine/core';
// Importe o provedor de notificações
import { Notifications } from '@mantine/notifications';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      {/* Adicione o provedor de notificações */}
      <Notifications />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);