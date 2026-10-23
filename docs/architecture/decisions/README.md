# Registros de decisão arquitetural

ADRs desta fase são propostas de projeto, não prova de implementação. “Diretriz definida” significa que o pedido explicitamente a exige; demais escolhas precisam de aprovação.

| ADR | Tema | Estado |
| --- | --- | --- |
| [001](001-monolito-modular.md) | Monólito modular | Diretriz definida; fronteiras propostas |
| [002](002-tenant-compartilhado.md) | Schema compartilhado e tenant_id | Diretriz definida; detalhes propostos |
| [003](003-autenticacao-futura.md) | Autenticação futura | Proposto, pendente Q-001 |
| [004](004-previsao-realizacao.md) | Previsão separada da realização | Diretriz definida; liquidação proposta |
| [005](005-identificadores-uuid.md) | Identificadores UUID | Diretriz definida; versão v4 proposta |
| [006](006-auditoria.md) | Auditoria e reversões | Proposto; retenção pendente |
| [007](007-rls.md) | Defesa adicional com RLS | Avaliação pendente; não ativada |

Ao aprovar uma escolha, registrar responsável/data e atualizar o material dependente no mesmo PR. Não reclassificar uma proposta como decisão aceita só porque este PR documental foi criado.
