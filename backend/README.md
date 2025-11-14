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

Veja os comandos detalhados no final desse README

#### Criar migrations e seeds

Caso necessário criar migration ou seed, use esses comandos:

Migration (Tabela):

```
npx sequelize-cli migration:generate --name nome-da-migration
```

Seed (Dados):

```
npx sequelize-cli seed:generate --name nome-do-seed
```

### Passo 3: Iniciando a Aplicação

Iniciar o Servidor Node.js:

A aplicação será iniciada em modo de desenvolvimento (nodemon).

```
npm run dev
```

Acessar a Aplicação:

O servidor estará ativo em http://localhost:[Porta] (3000 dito anteriormente).

## Estrutura de scripts package.json

### Comandos de Inicialização do Servidor

<b>1. DEV:</b> Ambiente de trabalho com reinício automático (nodemon)

<b>2. TEST:</b> Comando para rodar testes

<b>3. PROD:</b> Ambiente final

### Comandos do Sequelize CLI

<b>4. FLUXO DEV:</b> Usará NODE_ENV=development e o .env

<b>5. FLUXO TEST:</b> Usará NODE_ENV=test e o .env.test

<b>6. FLUXO PROD:</b> Usará NODE_ENV=production e o .env

## Como usar

### Dev

Iniciar o Servidor DEV (Com nodemon)

```
"dev": npm run dev
```

Aplicar Migrações (Criar/Atualizar tabelas)

```
"db:migrate": npm run db:migrate
```

Reverter Migrações (Desfazer a última)

```
"db:migrate:undo": npm run db:migrate:undo
```

Resetar o Banco (Reverter TODAS as migrações)

```
"db:migrate:undo:all": npm run db:migrate:undo:all
```

Rodar Seeders (Inserir Admin, etc.)

```
"seed": npm run seed
```

Reverter Seeders (Remover Admin, etc.)

```
"seed:undo:dev": npm run seed:undo:dev
```

## Comandos para Teste e Produção

Use estes comandos apenas quando estiver trabalhando especificamente nesses ambientes:

### Test

Aplicar Migrações no TEST

```
"db:migrate:test": npm run db:migrate:test
```

Rodar Seeders no TEST

```
"seed:test": npm run seed:test
```

Rodar o Teste (testes unitários)

```
"test": npm run test
```

### Prod

Iniciar o Servidor PROD (Modo final)

```
"start": npm start
```

Aplicar Migrações no PROD

```
"db:migrate:prod": npm run db:migrate:prod
```

Rodar Seeders no PROD (Geralmente 1x)

```
"seed:prod"	npm run seed:prod
```
