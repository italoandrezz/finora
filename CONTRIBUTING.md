# Contribuindo com o Finora

Antes de alterar o projeto, leia o [README](README.md), a [arquitetura](docs/architecture.md) e o [guia de desenvolvimento](docs/development.md).

## Branches

| Branch | Finalidade |
| --- | --- |
| `main` | Versão estável |
| `develop` | Integração |
| `feature/*` | Funcionalidades |
| `fix/*` | Correções |
| `hotfix/*` | Correções urgentes |
| `chore/*` | Configuração e manutenção |
| `docs/*` | Documentação |
| `release/*` | Preparação de versões |

Parta de `develop` e abra PR para `develop`. Releases seguem por PR de `develop` para `main`. Use Squash Merge. As branches de trabalho podem ser apagadas após o merge; `main` e `develop` são permanentes e protegidas. Após squash de uma release, sincronize o histórico de `main` com `develop` por PR quando necessário, sem force push.

## Conventional Commits

Mensagens em português, com prefixos `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, `ci:` ou `build:`. Exemplos: `docs: esclarece execução local` e `fix: corrige validação de entrada`. O título do PR deve permitir uma mensagem final clara no Squash Merge.

## Pull Requests e revisão

Descreva o problema, o comportamento final e as verificações executadas. Evite alterações sem relação com o objetivo. Use o template do repositório e responda às conversas antes de integrar. O fluxo individual não exige aprovação de outra pessoa; CI e conversas resolvidas continuam obrigatórios.

Checklist de revisão:

- Escopo e critérios de aceitação atendidos.
- Segurança, validação e isolamento entre empresas considerados.
- Sem credenciais, logs sensíveis ou arquivos gerados.
- Testes relevantes passando e documentação coerente.
- Compatibilidade e impacto das dependências revisados.

## Validação antes do PR

No backend: `./mvnw -B compile`, `./mvnw -B test` e `./mvnw -B -DskipTests package` (Windows: `.\mvnw.cmd`). No frontend: `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run format:check` e `npm run build`. Ao alterar infraestrutura, valide `docker compose config --quiet` e o startup com healthchecks.

Use `npm run format` para formatar o frontend. Dependências de negócio, autenticação e migrations devem ser introduzidas somente com requisitos e testes correspondentes.
