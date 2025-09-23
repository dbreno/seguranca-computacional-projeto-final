# Projeto Final: Bloqueador de Ataques de Força Bruta

## 1. Visão Geral

Este é o projeto final para a disciplina de **Segurança Computacional**, ministrada pelo Professor Iguatemi na Universidade Federal da Paraíba (UFPB). O objetivo principal é explorar, desenvolver e demonstrar uma contramedida prática e eficaz contra ataques de força bruta em sistemas de autenticação de aplicações web.

O projeto consiste em uma arquitetura moderna e desacoplada, com um backend robusto construído em **NestJS** e um frontend interativo construído em **React**.

### Integrantes da Equipe
* Deivily Breno Silva Carneiro
* Luiz Manoel Barbosa Ramalho
* Rafael de França Silva
* Reuben Lisboa Ramalho Claudino

## 2. Objetivo de Segurança

O ataque de força bruta é uma das ameaças mais comuns contra sistemas de autenticação, consistindo em tentativas repetitivas e automatizadas de adivinhar credenciais. Este projeto implementa uma defesa baseada em **Rate Limiting (Limitação de Taxa)** por endereço IP.

A lógica de segurança monitora as tentativas de login com falha. Após um número pré-definido de falhas (neste caso, 5 tentativas) dentro de uma janela de tempo (5 minutos), o endereço IP do atacante é temporariamente bloqueado, impedindo novas tentativas e mitigando o ataque sem afetar usuários legítimos.

## 3. Arquitetura e Funcionalidades

O projeto está estruturado como um **monorepo**, contendo duas aplicações principais:

* **`backend/`**: Uma API RESTful desenvolvida com NestJS, responsável por toda a lógica de negócio, segurança e persistência de dados.
* **`frontend/`**: Uma Single-Page Application (SPA) desenvolvida com React, que consome a API do backend e fornece a interface para o usuário.

### Funcionalidades Implementadas:
* **API de Autenticação Segura**:
    * Registro e Login de usuários.
    * Armazenamento seguro de senhas utilizando `bcrypt` para hashing.
    * Sistema de autenticação baseado em JSON Web Tokens (JWT) com fluxo de *Access Tokens* e *Refresh Tokens*.
* **Contramedida de Força Bruta**:
    * Limite de 5 tentativas de login a cada 5 minutos por IP, implementado com `@nestjs/throttler`.
* **Persistência de Dados**:
    * Utilização do **SQLite** com o ORM **TypeORM** para armazenamento persistente de dados dos usuários.
* **Interface de Usuário Moderna**:
    * Frontend reativo construído com React, Vite e TypeScript.
    * Componentes de UI profissionais da biblioteca **Mantine**.
    * Páginas de Login, Registro e um Dashboard protegido por autenticação.
* **Testes Automatizados**:
    * Teste End-to-End (E2E) que valida automaticamente o funcionamento da contramedida de força bruta.
* **Logging Estruturado**:
    * Logs detalhados para eventos de segurança, como tentativas de login falhas, logins bem-sucedidos e criação de usuários.

## 4. Tecnologias Utilizadas

| Backend                   | Frontend                 |
| ------------------------- | ------------------------ |
| **Framework**: NestJS     | **Framework**: React c/ Vite |
| **Linguagem**: TypeScript | **Linguagem**: TypeScript |
| **Banco de Dados**: SQLite c/ TypeORM | **UI Library**: Mantine |
| **Autenticação**: Passport.js (JWT) | **Roteamento**: React Router |
| **Segurança**: `bcrypt`, `@nestjs/throttler` | **Comunicação API**: Axios |
| **Testes**: Jest, Supertest |                          |

## 5. Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento localmente.

### Pré-requisitos
* **Node.js**: Versão 20.x ou superior. (Recomendamos usar o [NVM](https://github.com/nvm-sh/nvm) para gerenciar as versões).
* **NPM**: Versão 10.x ou superior (geralmente vem com o Node.js).
* **Git**

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/dbreno/seguranca-computacional-projeto-final.git](https://github.com/dbreno/seguranca-computacional-projeto-final.git)
    cd brute-force-blocker
    ```

2.  **Instale as dependências do Backend:**
    ```bash
    cd backend
    npm install
    ```

3.  **Instale as dependências do Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### Executando a Aplicação

Para que a aplicação funcione, você precisa rodar o backend e o frontend simultaneamente, cada um em um terminal diferente.

1.  **Terminal 1: Iniciar o Backend**
    ```bash
    # A partir da raiz do projeto, navegue para o backend
    cd backend
    npm run start:dev
    ```
    O servidor da API estará rodando em `http://localhost:3000`.

2.  **Terminal 2: Iniciar o Frontend**
    ```bash
    # A partir da raiz do projeto, navegue para o frontend
    cd frontend
    npm run dev
    ```
    A interface do usuário estará acessível em `http://localhost:5173`.

### Como Demonstrar a Contramedida de Segurança

1.  Acesse `http://localhost:5173` no seu navegador.
2.  Tente fazer login com o usuário padrão (`user@example.com`) e uma senha incorreta.
3.  Após a **quinta tentativa**, a interface exibirá uma mensagem de erro informando que o acesso foi bloqueado.
4.  As tentativas seguintes resultarão no mesmo erro, até que a janela de tempo de 5 minutos expire.
5.  No terminal do backend, você verá os logs de cada tentativa falha.

#### Usando o Script de Ataque
Alternativamente, para uma simulação rápida e automatizada:

1.  Com o backend rodando, abra um terceiro terminal.
2.  Navegue até a pasta `backend`.
3.  Execute o script:
    ```bash
    node attack-script.js
    ```
    O script irá simular 10 tentativas de login, mostrando no console a mudança da resposta de `401 Unauthorized` para `429 Too Many Requests`.

## 6. Rodando os Testes

Para garantir a integridade da funcionalidade de segurança, você pode rodar os testes End-to-End.

```bash
# A partir da pasta 'backend'
npm run test:e2e