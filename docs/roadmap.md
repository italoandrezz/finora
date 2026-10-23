# Roadmap

A base técnica está inicializada. As funcionalidades de negócio continuam futuras. A Fase 1 produziu uma **proposta documental para revisão**, sem implementação ou aprovação automática de suas hipóteses.

| Fase | Escopo | Estado / critério de conclusão |
| --- | --- | --- |
| 1 | Requisitos e modelagem financeira | [Documentação produzida](README.md): 23 telas, RF/RNF, MVP, regras, A–G, ER/dicionário, APIs e ADRs. Aprovação de produto e resolução das questões essenciais pendentes. |
| 2 | Autenticação e multi-tenancy | Futuro: decidir Q-001/Q-005, identidade e vínculos; implementar filtros/FKs e comprovar ISO-01–10; decidir RLS com prova de conceito. |
| 3 | Clientes e produtos | Futuro: cadastros mínimos e snapshots; decidir estoque/fracionados antes de incluí-los. |
| 4 | Vendas e parcelamentos | Futuro: confirmação atômica, preços históricos, centavos e calendário aprovados. |
| 5 | Contas a pagar e receber | Futuro: baixas parciais, idempotência, cancelamentos/reversões e testes PostgreSQL concorrentes. |
| 6 | Fluxo de caixa | Futuro: abertura, histórico realizado e reconciliação com pagamentos; projeção é evolução. |
| 7 | Dashboard e relatórios | Futuro: indicadores mínimos reconciliados; comparação/CSV/PDF posteriormente. |
| 8 | Integrações e preparação SaaS | Futuro: avaliar demanda antes de gateway/assinaturas/integrações; operação, backups, segurança e observabilidade revisados. |

Portão para implementar cada módulo: aprovar os critérios de aceitação e as [questões abertas](requirements/open-questions.md) que o afetam. Não exigir todas as telas comerciais do protótipo no MVP. Não há compromisso de datas.
