# Desenvolvimento

## Preparação

Instale Git, Java 17 e Node.js 24 LTS; Docker e Compose são necessários para o ambiente integrado. Clone `https://github.com/italoandrezz/finora.git`, copie `.env.example` para `.env` e defina uma senha local. Não envie esse arquivo ao Git.

O Maven Wrapper baixa o Maven 3.9.11 no primeiro uso. Execute os comandos Maven dentro de `backend/`. No Linux/macOS use `./mvnw`; no Windows use `.\mvnw.cmd`.

## Execução

`docker compose up --build` inicia PostgreSQL, backend e frontend. `docker compose ps` consulta o estado e `docker compose logs backend` ajuda no diagnóstico. A interface fica em `http://localhost:5173` e o health em `http://localhost:8080/actuator/health`.

Para desenvolvimento no host, execute `docker compose up -d postgres`, exporte `DB_USERNAME` e `DB_PASSWORD` e rode `./mvnw spring-boot:run` no backend. Em outro terminal, execute `npm ci` e `npm run dev` no frontend. O `.env` da raiz é lido pelo Compose, não automaticamente pelo Maven ou Vite. Os comandos completos e todas as variáveis estão no [README](../README.md).

Não execute a cópia local de um serviço na mesma porta ocupada pelo Compose. Para encerrar o ambiente, `docker compose down` mantém o volume. Não use `down -v` sem intenção explícita de apagar o banco. A senha de um volume existente não muda por editar `.env`; altere a senha no próprio PostgreSQL caso necessário.

## Qualidade

- Backend: `./mvnw -B compile`, `./mvnw -B test`, `./mvnw -B -DskipTests package`.
- Frontend: `npm run lint`, `npm run typecheck`, `npm test`, `npm run format:check`, `npm run build`.
- Formatação frontend: `npm run format`.
- Infraestrutura: `docker compose config --quiet` e `docker compose up --build -d --wait`.

Os testes backend usam profile `test` e H2. O startup integrado com PostgreSQL deve ser validado ao alterar persistência. Os workflows usam os mesmos comandos de qualidade do ambiente local.

## Padrões de código

Documentação e mensagens de commit em português brasileiro. Código com nomes descritivos, Java com quatro espaços, TypeScript com dois espaços e UTF-8. Siga `.editorconfig`, ESLint e Prettier. Preserve os finais de linha do Wrapper definidos em `.gitattributes`.

Não crie abstrações sem uso. Valide entradas na fronteira da API e retorne erros sem dados sensíveis. Migrations futuras devem ser incrementais em `db/migration`; não use `ddl-auto=update`. Não adicione credenciais, arquivos gerados ou dependências sem propósito.

## Fluxo Git

Sincronize `develop`, crie uma branch de trabalho, implemente e teste. Abra PR para `develop`, aguarde CI e resolva as conversas. Use Squash Merge com Conventional Commits. Releases são PRs de `develop` para `main`; não exclua `develop`. Não faça force push nas branches protegidas. Veja [CONTRIBUTING](../CONTRIBUTING.md).
