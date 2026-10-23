# Finora

**Gestão financeira para quem empreende.**

[![Backend CI](https://github.com/italoandrezz/finora/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/italoandrezz/finora/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/italoandrezz/finora/actions/workflows/frontend-ci.yml/badge.svg?branch=main)](https://github.com/italoandrezz/finora/actions/workflows/frontend-ci.yml)

Plataforma SaaS de gestão financeira para lojas e pequenos negócios, desenvolvida com Java, Spring Boot, React e TypeScript. O objetivo é simplificar a rotina de quem vende presencialmente, pelo WhatsApp e pelas redes sociais.

**Status: base técnica inicial, em desenvolvimento.** O backend disponibiliza somente um healthcheck público; os demais caminhos são bloqueados. O frontend apresenta uma página provisória. Autenticação, dados de negócio e isolamento multiempresa ainda serão implementados.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Java 17, Spring Boot 3.5.16, Maven 3.10.0 via Wrapper |
| API e persistência | Spring Web, Data JPA, Validation, Security, Actuator, PostgreSQL 17, Flyway, Lombok |
| Testes backend | JUnit 5, Mockito e Spring Security Test; H2 somente em testes |
| Frontend | React 19, TypeScript 5.9, Vite 8, Tailwind CSS 4, React Router 7, Axios |
| Qualidade frontend | ESLint, Prettier, Vitest, React Testing Library |
| Infraestrutura | Docker Compose, GitHub Actions, Dependabot; Node.js 24 LTS |

As versões exatas do frontend estão em `frontend/package-lock.json`; as do backend são gerenciadas pelo parent Spring Boot. A linha 3.5 foi mantida conforme o requisito do projeto; revisar seu ciclo de suporte antes de produção.

## Funcionalidades planejadas

Ainda não implementadas: dashboard financeiro; vendas; clientes e produtos; contas a pagar e receber; parcelamentos; fluxo de caixa; relatórios; usuários e permissões; múltiplas empresas com dados isolados; integrações com plataformas de vendas.

## Arquitetura e estrutura

Monorepo com frontend e backend independentes. A evolução seguirá um monólito modular com API REST e PostgreSQL compartilhado, com isolamento lógico por tenant a implementar. Veja [arquitetura](docs/architecture.md) e a [Fase 1 — requisitos e modelagem financeira](docs/README.md), proposta documental baseada nas 23 telas do protótipo.

```text
.github/         Workflows, Dependabot e templates
backend/         Spring Boot, Maven Wrapper, testes e Dockerfile
frontend/        React, estilos, rotas, serviços, testes e Dockerfile
docs/            Arquitetura, desenvolvimento e roadmap
compose.yaml     Ambiente local com três serviços
.env.example     Referência das variáveis locais
CONTRIBUTING.md  Convenções de contribuição
LICENSE          MIT
```

## Pré-requisitos

- Git e acesso ao repositório.
- Docker com Compose para executar o ambiente completo.
- Java **17** e Node.js **24 LTS, versão 24.15 ou superior**, para desenvolvimento fora dos containers (compatibilidade com jsdom 30).
- Maven não precisa ser instalado: use o Wrapper em `backend/`.
- Portas locais 5432, 8080 e 5173 disponíveis, ou alteradas no `.env`.

## Execução com Docker Compose

```sh
git clone https://github.com/italoandrezz/finora.git
cd finora
cp .env.example .env
# Edite .env e substitua DB_PASSWORD por uma senha local.
docker compose up --build
```

No PowerShell, use `Copy-Item .env.example .env`. O `.env` é ignorado pelo Git. Não use credenciais de produção.

- Frontend: <http://localhost:5173>.
- Healthcheck: <http://localhost:8080/actuator/health>, resposta esperada `{"status":"UP"}`.
- Banco: `localhost:5432`, acessível apenas pelo loopback do host e pela rede interna do Compose.

Em outro terminal, `docker compose ps` mostra a saúde dos serviços. Para executar em segundo plano, use `docker compose up --build -d --wait`.

Para parar **preservando os dados**:

```sh
docker compose down
```

O volume `postgres_data` persiste. `down -v` apaga os dados e não faz parte do fluxo normal. Alterar a senha no `.env` não altera a senha de um banco já inicializado no volume.

Este Compose é destinado ao desenvolvimento: frontend com Vite, portas no loopback e sem deploy. Em produção, não publique a porta do PostgreSQL e use infraestrutura, TLS, segredos e distribuição do frontend apropriados.

## Backend local

Inicie somente o banco e exporte as variáveis do `.env` no terminal antes de executar:

```sh
docker compose up -d postgres
export DB_USERNAME=finora_local
export DB_PASSWORD='<a mesma senha definida no .env>'
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

No PowerShell, atribua `$env:DB_USERNAME='finora_local'` e `$env:DB_PASSWORD='<sua senha local>'`; use `.\mvnw.cmd spring-boot:run`. O Spring não carrega o `.env` da raiz automaticamente.

Profiles: `dev` para desenvolvimento; `test` com banco H2 efêmero, sem Flyway; `prod` exige URL e credenciais por ambiente. O Hibernate usa `validate`, nunca altera o schema. O Flyway está habilitado em execução normal, mas ainda não existem migrations; quando necessário, adicione-as em `backend/src/main/resources/db/migration`.

A segurança permanece habilitada, com CSRF e bloqueio de todos os caminhos exceto `/actuator/health`. Não há usuário padrão, formulário de login ou JWT. O Actuator não retorna detalhes dos componentes.

## Frontend local

```sh
cd frontend
npm ci
npm run dev
```

O proxy do Vite encaminha `/api` para `http://localhost:8080`. No Compose o destino é o serviço `backend`. Para alterar a URL pública, crie `frontend/.env.local` com `VITE_API_BASE_URL`; ela será incluída no bundle e **não deve conter segredos**. A instância Axios está preparada para futuras chamadas, sem simular uma API de negócio.

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `POSTGRES_DB` | Banco criado pelo Compose; padrão `finora` |
| `DB_USERNAME`, `DB_PASSWORD` | Credenciais locais obrigatórias |
| `DB_URL` | JDBC local; no Compose é definida com hostname `postgres` |
| `SPRING_PROFILES_ACTIVE` | Profile do backend; Compose usa `dev` |
| `POSTGRES_PORT`, `BACKEND_PORT`, `FRONTEND_PORT` | Portas do host no Compose |
| `VITE_API_BASE_URL` | Base pública da API; padrão `/api` |
| `API_PROXY_TARGET` | Destino interno do proxy Vite; não é uma variável pública `VITE_*` |

## Testes e builds

```sh
cd backend
./mvnw -B compile
./mvnw -B test
./mvnw -B -DskipTests package
cd ../frontend
npm ci
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
```

No Windows, substitua `./mvnw` por `.\mvnw.cmd`. Os testes backend verificam inicialização, healthcheck sem dados sensíveis, bloqueio de acesso e CSRF. Usam H2 e não substituem validação de integração PostgreSQL. Os testes frontend verificam apresentação, status de desenvolvimento e rota inexistente.

## Integração contínua

Os workflows [Backend CI](.github/workflows/backend-ci.yml) e [Frontend CI](.github/workflows/frontend-ci.yml) executam em pushes e PRs para `main` e `develop`, com `contents: read`, cache de dependências e Actions fixadas por SHA. Não existe deploy automático. Dependabot verifica Maven, npm e Actions semanalmente.

## Branches e contribuições

`main` contém a versão estável; `develop` integra alterações. Crie branches `feature/*`, `fix/*`, `hotfix/*`, `chore/*`, `docs/*` ou `release/*` a partir de `develop`. Abra PR para `develop`; releases seguem por PR de `develop` para `main`. Use Squash Merge e apague a branch de trabalho após o merge, preservando `develop`.

Os checks de CI devem passar e as conversas ser resolvidas. Aprovação por outra pessoa não é obrigatória no fluxo individual. Consulte [CONTRIBUTING.md](CONTRIBUTING.md) e [desenvolvimento](docs/development.md).

## Roadmap

1. Requisitos e modelagem financeira.
2. Autenticação e multi-tenancy.
3. Clientes e produtos.
4. Vendas e parcelamentos.
5. Contas a pagar e receber.
6. Fluxo de caixa.
7. Dashboard e relatórios.
8. Integrações e preparação SaaS.

Detalhes e critérios de cada fase em [docs/roadmap.md](docs/roadmap.md).

## Autor e licença

Desenvolvido por **Ítalo Ramos** — [italoandrezz](https://github.com/italoandrezz).

Licenciado sob a [MIT](LICENSE).
