# ADR-004 — Separar previsão e realização

**Estado:** separação obrigatória no pedido; estrutura detalhada proposta. Data: 23/10/2026.

Contexto: venda 600 em três parcelas não gera 600 em caixa; recebimentos antigos não são novo faturamento.

Proposta: Sale/itens representam fato comercial; Receivable/parcelas e Payable representam obrigações; pagamentos representam realização; CashMovement registra os efeitos realizados. Reversão referencia a baixa e o movimento original, sem apagar histórico. Payable tem um vencimento no MVP, sem PayableInstallment prematuro.

Alternativas: somente campo paid na venda (não representa parcialidade nem datas); lançamento de caixa na confirmação (duplica previsão/realização); contabilidade de partidas dobradas completa (poderosa, mas excede a necessidade inicial de gestão financeira).

Vantagens: suporta parcial/antecipação/atraso, saldo auditável e projeção separada. Desvantagens: mais registros e necessidade de transação/locks para manter invariantes.

Consequências: [RN-001–017](../../domain/business-rules.md), cenários A–G e idempotência. Um único pagamento gera seus movimentos uma vez; sem endpoint genérico de caixa para duplicá-lo. Modelo operacional não promete contabilidade fiscal.
