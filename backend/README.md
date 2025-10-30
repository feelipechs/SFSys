# Tutorial de Configuração: SFSys Backend

Este guia detalha os passos necessários para configurar e rodar o SFSys Backend localmente.

## Pré-requisitos

Certifique-se de que os seguintes programas estão instalados no seu sistema:

    Node.js e NPM (Versão 18+ ou 20+).

    Git (Para clonar o repositório).

### Passo 1: Configuração Inicial do Projeto

Clonar o Repositório:

```
git clone https://github.com/feelipechs/SFSys.git
cd SFSys/backend
```

Instalar Dependências:

```
npm install
```

Configurar Variáveis de Ambiente:

Crie um arquivo chamado <strong>.env.development.local</strong> na pasta backend.
Siga o exemplo dp <strong>.env.example</strong> para ele.

### Passo 2: Criar o Esquema e Popular os Dados Iniciais

Com o servidor de banco de dados rodando, use o Sequelize CLI para criar a estrutura (tabelas) e inserir os dados iniciais

Aplicar Migrations (Criar as Tabelas):

```
npx sequelize-cli db:migrate
```

Isso cria todas as 10 tabelas do modelo objeto-relacional.

Rodar Seeders (Popular os Dados de Autenticação):

```
npx sequelize-cli db:seed:all
```

Isso insere o admin e o beneficiário para que você possa começar a testar

### Passo 3: Iniciando a Aplicação

Iniciar o Servidor Node.js:

A aplicação será iniciada em modo de desenvolvimento (nodemon).

```
npm run dev
```

Acessar a Aplicação:

O servidor estará ativo em http://localhost:[Sua Porta] (3000 dito anteriormente).

## Comandos Úteis do Sequelize

### Criar uma Nova Migration

npx sequelize-cli migration:create --name nome-da-nova-acao

### Reverter a Última Migration

npx sequelize-cli db:migrate:undo

### Reverter Todos os Seeders

npx sequelize-cli db:seed:undo:all

# Iniciar

no terminal, use:

```
npm run dev (iniciará o ambiente de desenvolvimento)
NODE_ENV=test npm run dev (ambiente de teste)
NODE_ENV=production npm start (ambiente de produção)
```

### Migrations

```
# Roda as migrations no banco de TESTE
NODE_ENV=test npx sequelize-cli db:migrate

# Roda as migrations no banco de PROD (CUIDADO!)
NODE_ENV=production npx sequelize-cli db:migrate
```
