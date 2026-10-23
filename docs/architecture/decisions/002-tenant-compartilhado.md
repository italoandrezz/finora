# ADR-002 — PostgreSQL e schema compartilhados

**Estado:** diretriz explícita; estratégia de aplicação proposta. Data: 23/10/2026.

Contexto: várias lojas na mesma plataforma, usuários N:M com empresas e PostgreSQL 17 já escolhido.

Diretriz: tenant_id obrigatório no negócio, contexto autenticado e autorizado, filtros em todas as consultas e FKs compostas para impedir vínculos cruzados. Seleção por header é apenas proposta de transporte, não autorização.

Alternativas: schema por tenant (melhor separação de nomes, mais complexidade de migrations e pool); banco por tenant (isolamento operacional maior, custo e provisionamento maiores); tenant_id com filtro só na UI (inaceitável por vazamento).

Vantagens: migrations únicas, menor custo e simplicidade de operação. Desvantagens: erro de query pode vazar dados, ruído de carga entre empresas, backup/restauração individual mais difícil.

Consequências: testes [ISO-01–10](../multi-tenancy.md), revisão de queries/joins/agregados, unicidades locais e papel por membership. RLS é decisão separada, não pré-requisito já implementado nem substituto da autorização.
