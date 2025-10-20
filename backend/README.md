# Tutorial de Configuração: SFSys Backend

Este guia detalha os passos necessários para configurar e rodar o SFSys Backend localmente, tanto em sistemas Linux (Mint) quanto em Windows.

## Pré-requisitos

Certifique-se de que os seguintes programas estão instalados no seu sistema:

    Node.js e NPM (Versão 18+ ou 20+).

    Docker e Docker Compose (Essencial para rodar o PostgreSQL).

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
Copie o conteúdo do arquivo <strong>.env.example</strong> para ele.
Importante: Use as credenciais do Docker abaixo para a variável <strong>DATABASE_URL</strong>.

Conteúdo do seu .env.development.local (exemplo):
Snippet de código

```
DATABASE_URL="postgres://sfsys_user:sfsys_password@localhost:5432/sfsys_db"
JWT_SECRET=sua_chave_secreta_aqui_para_assinatura
JWT_EXPIRATION_TIME=1h
```

### Passo 2: Configuração do Banco de Dados (PostgreSQL via Docker)

Vamos iniciar o servidor de banco de dados PostgreSQL usando o Docker.

Inicie o Serviço Docker no seu sistema.

Execute o Contêiner PostgreSQL:

Este comando inicia o PostgreSQL na porta padrão (5432) com as credenciais que correspondem à sua DATABASE_URL.

Se você já rodou isso antes, use <strong>docker start postgres-dev</strong>.

```
docker run --name postgres-dev -e POSTGRES_USER=sfsys_user -e POSTGRES_PASSWORD=sfsys_password -e POSTGRES_DB=sfsys_db -p 5432:5432 -d postgres:latest
```

Verifique se o Contêiner está Ativo:

```
docker ps
```

Confirme se postgres-dev está na lista com <strong>status Up</strong>.

### Passo 3: Criar o Esquema e Popular os Dados Iniciais

Com o servidor de banco de dados rodando, use o Sequelize CLI para criar a estrutura (tabelas) e inserir os dados iniciais (admin e cliente@teste.com).

Aplicar Migrations (Criar as Tabelas):

```
npx sequelize-cli db:migrate
```

Isso cria todas as 10 tabelas do modelo objeto-relacional.

Rodar Seeders (Popular os Dados de Autenticação):

```
npx sequelize-cli db:seed:all
```

Isso insere o admin e o cliente@teste.com para que você possa começar a testar o login.

### Passo 4: Iniciando a Aplicação

Iniciar o Servidor Node.js:

A aplicação será iniciada em modo de desenvolvimento (nodemon).

```
npm run dev
```

(Presumindo que você tenha um script dev no seu package.json configurado para rodar com nodemon.)

Acessar a Aplicação:

O servidor estará ativo em http://localhost:[Sua Porta] (ex: 3000 ou 8080).

## Comandos Úteis do Sequelize

### Criar uma Nova Migration

npx sequelize-cli migration:create --name nome-da-nova-acao

### Reverter a Última Migration

npx sequelize-cli db:migrate:undo

### Reverter Todos os Seeders

npx sequelize-cli db:seed:undo:all
