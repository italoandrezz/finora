# Fase 1 — Requisitos e modelagem financeira

Finora — Gestão financeira para quem empreende. Análise de 23/10/2026, baseada no pedido da Fase 1 e em 23 imagens fornecidas pelo responsável pelo produto. A marca “lume” nas imagens é referência visual; o produto continua sendo Finora.

**Estado: proposta para revisão, sem implementação.** “MVP essencial” significa prioridade proposta, não funcionalidade pronta nem aprovação implícita do produto. Diretrizes expressas do pedido são obrigatórias; escolhas complementares continuam propostas até aprovação. Nenhuma classe, migration, autenticação, tela ou infraestrutura foi alterada nesta fase.

## Como distinguir as evidências

| Marca | Significado |
| --- | --- |
| E | Requisito explícito do pedido desta fase |
| O / T-xx | Elemento observado em uma imagem identificada no inventário |
| P | Proposta ou inferência técnica, ainda sujeita a revisão |
| S | Sugestão de melhoria, não compromisso de escopo |
| Q-xxx | Questão pendente no registro de decisões de produto |

Os textos das imagens são evidência de intenção, não autorização automática para implementar todos os módulos. Valores exibidos são dados de demonstração, não regras fixas.

## Ordem de leitura

1. [Inventário das 23 telas](requirements/figma-screen-inventory.md).
2. [Escopo do MVP](requirements/mvp-scope.md), [requisitos funcionais](requirements/functional-requirements.md), [não funcionais](requirements/non-functional-requirements.md) e [questões abertas](requirements/open-questions.md).
3. [Regras de negócio](domain/business-rules.md) e [cenários de referência](domain/financial-scenarios.md).
4. [Modelo ER](domain/entity-relationship.md) e [dicionário de dados e constraints](domain/data-dictionary.md).
5. [Multi-tenancy](architecture/multi-tenancy.md), [monólito modular](architecture/modular-monolith.md) e [ADRs](architecture/decisions/README.md).
6. [Contratos REST futuros](api/rest-contracts.md) e [mapeamento das telas](frontend/screen-api-mapping.md).

O [resumo de arquitetura existente](architecture.md) continua sendo o ponto de entrada geral; o [guia operacional](development.md) permanece a referência de execução, com versões documentadas alinhadas à base já existente. O [roadmap](roadmap.md) distingue documentação produzida de implementação futura.

As [verificações documentais executadas e seus limites](validation.md) estão registradas separadamente dos testes futuros do domínio.

## Rastreabilidade e revisão

T-xx identifica a imagem; RF/RNF identificam requisitos; RN identifica regra; A–G identificam cenários; API-xx identifica operação; ADR identifica decisão arquitetural. Os documentos se referenciam por esses identificadores. As pendências indicam quais escolhas precisam ser resolvidas antes da respectiva implementação.

Revisar especialmente: cancelamento após recebimento, taxas de cartão, arredondamento, política de acesso, autenticação e a divergência de R$ 20 no conjunto de exemplo. Não usar o protótipo como fixture financeira sem reconciliá-lo.
