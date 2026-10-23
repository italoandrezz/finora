# ADR-005 — UUID como identidade

**Estado:** UUID obrigatório; geração UUID v4 no servidor proposta. Data: 23/10/2026.

Contexto: recursos multiempresa e contratos desacoplados de sequência física do banco.

Proposta: PK UUID; número comercial de venda separado, único por tenant e gerado com concorrência controlada. FK de negócio usa tenant_id + UUID, mesmo com PK global.

Alternativas: bigint sequencial (índices menores, mas acoplamento e enumeração fáceis); UUID v7 (melhor localidade potencial, exige biblioteca/geração escolhida e análise operacional); IDs compostos expostos (mais complexos para contratos).

Vantagens: geração independente e identificadores estáveis. Desvantagens: índices maiores que bigint e custo de localidade de v4; medir antes de otimizar.

Consequências: não adicionar extensão SQL antecipadamente; `UUID.randomUUID()` é opção futura da stack Java 17. UUID não é segredo nem controle de acesso; validação de tenant/membership continua obrigatória.
