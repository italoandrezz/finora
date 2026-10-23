# ADR-006 — Auditoria e histórico financeiro

**Estado:** proposta; retenção/anonimização pendentes Q-013. Data: 23/10/2026.

Contexto: corrigir uma baixa não pode destruir a explicação de como o saldo mudou.

Proposta: pagamentos, movimentos e reversões append-only no fluxo de aplicação; cancelamentos e arquivos lógicos nos agregados; AuditEvent com tenant, ator, instante, ação, alvo e motivo. Auditoria de sucesso compartilha a transação; falha reverte a operação inteira. Eventos globais de identidade podem não ter tenant, mas eventos de negócio sempre o têm.

Alternativas: apenas timestamps (não explica ator/motivo); logs livres (podem vazar dados e não têm consistência transacional); event sourcing integral (reconstrução completa, porém complexidade excessiva para o primeiro MVP).

Vantagens: rastreabilidade e reconciliação sem sistema de eventos distribuídos. Desvantagens: armazenamento/controle de acesso e política de retenção; administrador do banco ainda exige governança operacional.

Consequências: allowlist/redação em changes JSON, sem tokens/senhas/documentos completos; leitura de auditoria restrita. Exclusão de dados pessoais e preservação de fatos financeiros precisam de decisão específica, sem afirmar retenção eterna ou conformidade legal pronta.
