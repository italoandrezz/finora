# Revisão documental da Fase 1

Data: 23/10/2026. Escopo: documentação e diagramas, sem implementação de domínio, autenticação, SQL, migrations ou frontend.

## Verificações executadas

- Abertura individual dos 23 PNGs do ZIP identificado no [inventário](requirements/figma-screen-inventory.md); todos legíveis, com nomes originais registrados. Fluxos ausentes estão declarados, não inventados.
- Comparação do inventário com a lista real dos arquivos e conferência dos 23 identificadores T.
- Parsing dos documentos Markdown e verificação de existência dos destinos dos links locais.
- Parsing dos exemplos JSON dos contratos.
- Parsing **e renderização** dos blocos Mermaid: ER, módulos e arquitetura geral, usando Mermaid no Chromium. Isso valida a sintaxe/renderização; a coerência semântica depende da revisão abaixo.
- Conferência das sequências RF-001–034, RNF-001–016, Q-001–018 e API-01–36.
- Conferência aritmética com centavos inteiros: 600/3, 100/3, pagamento parcial 80/200, saldo inicial/entradas/saídas, baixa de 180, reversão com taxa devolvida ou retida e diferença de 20 no exemplo visual.
- `git diff --check` e comparação contra develop confirmando ausência de mudanças em backend, frontend, workflows, Compose e configurações de infraestrutura.

As ferramentas auxiliares de validação foram instaladas em diretório temporário, sem mudar manifests ou lockfiles da aplicação.

## Coerência revisada

| Tema | Resultado da revisão documental |
| --- | --- |
| Previsão/realização | Venda e obrigação não criam caixa sem baixa efetiva; regra, ER, cenário B e API-08/16 concordam |
| Parcialidade | Várias baixas por parcela; saldo calculado do principal líquido, não do bruto de caixa |
| Cancelamento | Cobrança zero em obrigação cancelada, restante histórico preservado; restituição não é baixa automática |
| Reversão | PaymentReversal referencia exatamente uma baixa; CashMovement inverso preserva original e impede segunda reversão |
| Taxa | Principal recebido e taxa separados no caixa; despesa inclui taxa uma vez; cartão/ajustes aguardam política aprovada |
| Abertura | Não vira receita; abertura na data inicial e posteriores estão explicitamente separadas na equação de saldo |
| Tenant | Tabelas de negócio com tenant obrigatório; FKs compostas, filtro autorizado e testes de isolamento; RLS não declarado ativo |
| Escopo | Estoque, assinatura, integrações e relatórios avançados não entram automaticamente no MVP |
| Propostas | Diretrizes E separadas de O/P/S; autenticação e RLS pendentes em ADRs, decisões de produto no registro Q |

## Limites

Não foram executados testes de regras financeiras, banco multiempresa ou APIs futuras: essas funcionalidades não existem. Cenários A–G e ISO-01–10 são especificações para implementação posterior, não evidência de isolamento atual. Os pipelines existentes do PR verificam que a base continua passando; não aprovam hipóteses de produto ou a segurança de uma implementação que ainda não foi feita.

A aprovação de escopo, os bloqueios por módulo e a reconciliação dos dados do protótipo permanecem em [questões abertas](requirements/open-questions.md). Nenhuma decisão pendente foi encerrada automaticamente por esta revisão técnica.
