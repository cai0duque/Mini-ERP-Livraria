# Setup completo — Mini‑ERP Livraria (Windows + PostgreSQL 17 + Node 20)

> Passo‑a‑passo para preparar o ambiente em seu computador (Windows 10/11): configurar **PostgreSQL 17**, **Node 20**, clonar o repositório, instalar, migrar, popular e rodar **backend** e **frontend**.

---

## 0) Pré‑requisitos

- **PostgreSQL 17** e **pgAdmin 4** já instalados (como informado).
- **Git** instalado.
- **Node.js 20 LTS** (se não tiver, ver Seção 4 para instalar).
- Acesso de rede para `npm i` (se a rede tiver proxy, veja *Troubleshooting*).

---

## 1) Colocar o `psql` no PATH (PostgreSQL 17)

Queremos conseguir rodar `psql --version` em qualquer terminal.

### Opção A — GUI (recomendado)

1. Abra **Iniciar → Editar as variáveis de ambiente do sistema**.
2. Clique em **Variáveis de Ambiente…**.
3. Em **Variáveis de usuário** selecione **Path** → **Editar** → **Novo**.
4. Adicione:
   ```
   C:\Program Files\PostgreSQL\17\bin
   ```
5. **OK → OK → OK**. Feche e abra um novo **PowerShell** ou **Git Bash**.

Teste:

```powershell
psql --version
```

### Opção B — PowerShell (usuário atual)

> Abra um **PowerShell** novo (não precisa ser Admin) e rode:

```powershell
$pgBin = 'C:\Program Files\PostgreSQL\17\bin'
[Environment]::SetEnvironmentVariable('Path', $env:Path + ';' + $pgBin, 'User')
```

Feche e **abra outro** PowerShell/Git Bash e teste `psql --version`.

---

## 2) Verificar o serviço do Postgres e criar o banco

### 2.1 — Verificar/ligar o serviço

```powershell
Get-Service postgresql*  # deve listar: postgresql-x64-17
# Se estiver Stopped:
Start-Service postgresql-x64-17
```

### 2.2 — Criar o banco via `psql`

```powershell
psql -U postgres -h 127.0.0.1 -d postgres -W -c "CREATE DATABASE mvc_livraria;"
```

> Use a **senha** do usuário `postgres` definida na instalação.

**Alternativa via pgAdmin 4**:

- Conecte ao servidor → clique direito em **Databases** → **Create → Database…** → **Database:** `mvc_livraria` → **Save**.

---

## 3) Clonar o repositório

Use **Git Bash** ou PowerShell:

```bash
mkdir -p ~/Documents/MVC-DEV && cd ~/Documents/MVC-DEV
git clone https://github.com/cai0duque/Mini-ERP-Livraria
cd Mini-ERP-Livraria
```

---

## 4) Garantir **Node.js 20 LTS**

### Opção A — Instalador oficial (mais simples)

1. Instale **Node 20 LTS**.
2. Abra um novo terminal e verifique:

```bash
node -v   # deve ser >= 20.x
npm -v
```

### Opção B — NVM for Windows (se preferir gerenciar versões)

```cmd
nvm install 20.16.0
nvm use 20.16.0
node -v
```

### Opção C — Portátil (zip)

- Extraia o zip do Node 20 para, por ex.: `C:\Users\SEU_USUARIO\Documents\node20`.
- Coloque essa pasta no PATH do usuário (GUI ou `setx`).

> **Motivo**: Prisma 6, bcrypt 6 e Express 5 exigem **Node >= 18** (recomendado 20 LTS).

---

## 5) Backend — configurar `.env`, instalar e migrar

Entre na pasta do backend e crie o arquivo de ambiente:

```bash
cd backend
# crie/edite .env (na pasta backend/)
```

Conteúdo de `backend/.env` (ajuste a senha):

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/mvc_livraria?schema=public"
PORT=3333
CORS_ORIGIN=http://localhost:3000
```

Valide se a variável está acessível:

```bash
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

Instalação e Prisma:

```bash
npm ci            # se a rede bloquear, use: npm i
npx prisma generate
npx prisma migrate dev
npx prisma db seed   # opcional (se existir seed)
```

Subir a API:

```bash
npm run dev   # API em http://localhost:3333
```

Teste rápido:

```bash
curl http://localhost:3333/api/health
```

---

## 6) Frontend Admin — configurar e rodar

Em outro terminal:

```bash
cd ~/Documents/MVC-DEV/Mini-ERP-Livraria/frontend
# copiar sample e editar (se necessário)
# Se o repo tiver .env.local.sample, use:
# cp .env.local.sample .env.local
# Caso contrário, crie direto:
printf "NEXT_PUBLIC_API_URL=http://localhost:3333/api\n" > .env.local

npm i
npm run dev    # http://localhost:3000/admin
```

No navegador, acessar: [**http://localhost:3000/admin**](http://localhost:3000/admin).

---

## 7) Troubleshooting (rápido)

- ``** não reconhecido** → PATH não inclui `C:\Program Files\PostgreSQL\17\bin` (Seção 1).
- `` → serviço parado: `Start-Service postgresql-x64-17`.
- **Senha incorreta** → teste login no **pgAdmin**; se necessário redefina a senha do usuário `postgres` por lá.
- ``** (Prisma)** → `.env` deve estar em **backend/** e carregado.
- ``** timeouts** (rede da faculdade/proxy):
  ```bash
  npm config set fetch-timeout 600000
  npm config set fetch-retry-maxtimeout 600000
  # Se houver proxy institucional:
  # npm config set proxy http://USUARIO:SENHA@proxy:PORTA
  # npm config set https-proxy http://USUARIO:SENHA@proxy:PORTA
  ```
- **Versão do Node incompatível** → garantir `node -v` ≥ 20.
- **Porta ocupada** → backend usa **3333**, frontend **3000**. Feche processos em conflito.
- **CORS** → se abrir o admin de outra origem, ajuste `CORS_ORIGIN` no `.env` do backend.

---

## 8) (Opcional) Comandos “one‑liner” úteis

- **Criar banco do zero (psql):**
  ```powershell
  psql -U postgres -h 127.0.0.1 -d postgres -W -c "DROP DATABASE IF EXISTS mvc_livraria; CREATE DATABASE mvc_livraria;"
  ```
- **Backend completo (instalar → prisma → rodar):**
  ```bash
  cd backend && npm i && npx prisma generate && npx prisma migrate dev && npx prisma db seed && npm run dev
  ```
- **Frontend rápido:**
  ```bash
  cd frontend && npm i && npm run dev
  ```

---

## 9) Checks finais

- `node -v` → **20.x**
- `psql --version` → **psql (PostgreSQL) 17**
- Banco `mvc_livraria` existe (pgAdmin/`\l` no psql)
- `backend/.env` correto e carregando 3 variáveis
- `GET http://localhost:3333/api/health` responde `{ ok: true, ... }`
- **Admin** em `http://localhost:3000/admin` lista entidades e permite CRUD/compra.
