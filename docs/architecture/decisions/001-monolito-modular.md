# ADR-001 — Monólito modular

**Estado:** diretriz explícita do pedido; limites entre módulos propostos. Data: 23/10/2026.

Contexto: equipe inicial individual, consistência financeira local e infraestrutura Spring Boot existente.

Decisão de escopo: manter uma aplicação backend organizada por capacidade de negócio, conforme [módulos](../modular-monolith.md). Não mudar infraestrutura.

Alternativas: monólito sem fronteiras (menor formalidade, maior acoplamento); microsserviços (deploy independente, mas rede, autenticação entre serviços e transações distribuídas sem necessidade atual).

Vantagens: transação única para venda/parcelas/baixa/caixa, operação simples, testes integrados acessíveis. Desvantagens: exige disciplina para não compartilhar entidades/repositórios indiscriminadamente; escala de deploy é conjunta.

Consequências: contratos públicos entre módulos, grafo sem ciclos de implementação e separação de queries de relatório. Extração futura só com necessidade mensurada. Nenhuma classe gerada nesta fase.
