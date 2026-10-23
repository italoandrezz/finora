# Cenários financeiros de referência

Propostas de aceitação futuras, não execuções da aplicação atual. Todos os casos pressupõem identidade autenticada, membership ativo, permissão, tenant T, BRL, conta C e operação idempotente. Datas e valores são exemplos; hipóteses ainda abertas estão em [Q](../requirements/open-questions.md). “Aberto” abaixo é principal cobrável, não soma de caixa. Referências: [RN](business-rules.md) e [RF](../requirements/functional-requirements.md).

## A — Venda à vista de R$ 150

- **Pré-condições:** cliente/produto ativos; saldo inicial de C = 0; Pix efetivamente recebido; sem taxa, desconto ou acréscimo.
- **Operações:** confirmar venda com um item total 150 e baixa imediata declarada pelo operador. Proposta de comando combinado API-08.
- **Registros:** Sale, SaleItem, Receivable, uma ReceivableInstallment 150, ReceivablePayment 150, CashMovement IN 150, auditoria e idempotência.
- **Estados:** venda CONFIRMED; recebível ACTIVE; parcela SETTLED e situação financeira PAID.
- **Contas a receber/pagar:** principal previsto 150, liquidado 150, aberto 0; nenhum pagável.
- **Caixa:** +150 uma vez; faturamento +150. Confirmar sem recebimento criaria aberto 150 e caixa zero, não este cenário de pagamento realizado.
- **Aceitação:** rollback injetado não deixa venda/baixa parcial; reenvio da mesma chave retorna mesma venda/baixa; somas e IDs não se duplicam. RF-008–014/RN-001/012.
- **Pendente:** aprovação da confirmação combinada, método inicial e cliente obrigatório (Q-003/Q-008).

## B — Venda de R$ 600 em três parcelas

- **Pré-condições:** conta C = 0; crediário; primeiro vencimento 10/11/2026; nenhuma realização.
- **Operações:** confirmar venda em 23/10/2026 e gerar vencimentos 10/11, 10/12 e 10/01/2027. Receber a primeira em 10/11 é etapa posterior separada.
- **Registros:** uma Sale, seus itens, um Receivable 600 e três parcelas de 200; depois um ReceivablePayment e seu movimento 200.
- **Estados:** inicialmente CONFIRMED/UNPAID, parcelas OPEN; depois PARTIAL e primeira SETTLED.
- **Contas:** aberto 600 → 400 após a primeira baixa; nenhuma alteração do total da venda.
- **Caixa:** inicialmente 0; após baixa +200, não +600 nem +800.
- **Aceitação:** datas distintas, soma 600, chaves únicas de sequência; consulta anterior à baixa não mostra dinheiro futuro. RF-009/011/012/013.
- **Pendente:** calendário/limite de parcelas (Q-004). Variação de centavos: 100/3 → 33,34 + 33,33 + 33,33; 31/01 → fim de fevereiro → 31/03 pela proposta RN-006.

## C — Pagamento parcial de parcela R$ 200

- **Pré-condições:** parcela OPEN 200 de obrigação ativa; saldo C = 0; desconto/acréscimo/taxa = 0.
- **Operações:** registrar 80 em 23/10; registrar 120 em data posterior. Pode ser antecipado ou atrasado em relação ao due_on.
- **Registros:** a mesma parcela e dois ReceivablePayments independentes; dois movimentos IN, 80 e 120.
- **Estados:** OPEN → PARTIAL com saldo 120 → SETTLED. Se vencida, indicador OVERDUE permanece após primeira baixa e some após quitação.
- **Contas:** principal liquidado 80 e depois 200; aberto 120 e depois 0; não criar nova parcela 120.
- **Caixa:** +80 e depois +120; faturamento não muda.
- **Aceitação:** baixa > saldo é rejeitada; dois pedidos concorrentes de 200 não geram 400; timeout e mesma chave de 80 não geram segunda baixa. Duas chaves diferentes para 80 exigem confirmação de fato, não deduplicação por igualdade simples. RF-013/RNF-005.
- **Pendente:** quitação em lote/excedentes (Q-018); ajustes na baixa (Q-007).

## D — Despesa futura de R$ 350

- **Pré-condições:** categoria EXPENSE e conta autorizadas; fornecedor textual; saldo C = 1.000.
- **Operações:** cadastrar em 23/10, vencimento 05/11; pagar 100 em 05/11 e 250 depois.
- **Registros:** um Payable 350; dois PayablePayments e CashMovements OUT 100/250; não há PayableInstallment neste modelo.
- **Estados:** ACTIVE/OPEN → PARTIAL → SETTLED; atraso temporal se existir saldo após vencimento.
- **Contas:** previsto 350 não é pago; saldo devido 350 → 250 → 0; nenhum recebível.
- **Caixa:** cadastro mantém 1.000; pagamentos reduzem para 900 e 650. Previsão não altera realizado.
- **Aceitação:** mesma chave não duplica pagamento; parcela/conta/categoria de outro tenant são rejeitadas; data futura não pode ser marcada como pagamento já realizado. RF-015–018.
- **Pendente:** despesas parceladas/recorrentes e anexos ficam para evolução; política de saldo negativo em Q-010.

## E — Cancelar venda antes de receber

- **Pré-condições:** venda CONFIRMED 600, três parcelas abertas, zero pagamentos.
- **Operações:** cancelar com motivo e versão esperada.
- **Registros:** Sale e Receivable marcados CANCELLED; parcelas preservadas e excluídas da cobrança; evento auditável. Nenhum CashMovement.
- **Estados:** comercial CANCELLED; saldo cobrável zero; não usar PAID para representar cancelamento.
- **Contas:** 600 deixam de ser cobrados; o valor original histórico permanece 600. Nenhum pagável gerado.
- **Caixa:** sem alteração; pelo critério operacional proposto o faturamento líquido de canceladas reduz 600, sem implicar saída monetária.
- **Aceitação:** repetir comando não duplica eventos; tentar receber parcela cancelada retorna 409; corrida entre cancelar/receber resulta em ordem transacional consistente. RF-019/RN-010/012.
- **Pendente:** reabertura e política de relatório histórico (Q-015/Q-017); sem exclusão física.

## F — Cancelar após recebimento e efetivar estorno

- **Pré-condições:** venda 600, primeira parcela 200 recebida, caixa +200 e principal cobrável 400; sem taxa.
- **Operações:** (1) cancelar venda; (2) devolver efetivamente os 200 e registrar REFUND sobre a baixa original.
- **Registros:** Sale/Receivable cancelados; ReceivablePayment original preservado; PaymentReversal liga a baixa; novo CashMovement OUT 200 com reverses_movement_id apontando para IN 200.
- **Estados:** após cancelar: CANCELLED/REFUND_PENDING; após restituição: CANCELLED/REFUNDED. Esses últimos são indicadores derivados, não prova automática de dinheiro devolvido.
- **Contas:** cobrança pendente 400 deixa de existir; restituição pendente 200 é informação separada, não recebível negativo. Após estorno não reabrir parcela de venda cancelada.
- **Caixa:** cancelamento mantém +200; restituição efetiva gera −200 e saldo líquido zero. Não apagar a entrada original.
- **Aceitação:** segunda reversão do mesmo pagamento é rejeitada; motivo/ator/data são preservados; estornar em outra empresa falha; dashboard não chama devolução de despesa operacional nem de venda nova. RF-019/020.
- **Pendente:** processo de devolução, taxa retida, devolução parcial e prazo de retenção (Q-008/Q-013/Q-015). Com taxa 6 não devolvida, IN 200/OUT 6/OUT 200 deixam saldo −6; com taxa devolvida, acrescentar IN 6 referenciando a taxa original.

Variação técnica: CORRECTION de pagamento em venda ainda ativa reabre seu principal, inversamente ao REFUND de venda cancelada. Para uma baixa parcial 80, correção integral da baixa reabre 80, não o total 200 da parcela.

## G — Usuário em duas empresas

- **Pré-condições:** usuário U é ADMIN em A, SALES em B e não participa de C; A/B têm clientes de mesmo nome e números de venda iguais.
- **Operações:** consultar A; trocar contexto para B; tentar usar cliente/conta/parcela de A em B; tentar consultar C; revogar vínculo de B durante sessão.
- **Registros:** dois TenantMemberships; entidades de cada tenant preservam seus IDs e FKs compostas; nenhuma cópia de dados é feita na troca.
- **Estados:** contexto selecionado muda; papel é recalculado por membership. Após revogação, próxima ação em B é negada.
- **Contas/caixa:** totais de A não aparecem em B; troca não cria recebível, pagamento ou movimento.
- **Aceitação:** lista de empresas contém só A/B autorizadas; acesso a C negado; UUID de A sob B retorna 404; FK cruzada falha mesmo por gravação direta; cache/requests em voo não misturam dados; papel de A não concede acesso a custos/estornos em B. RF-002/003 e testes ISO-01–10.
- **Pendente:** UX de vínculo revogado e acesso sem empresa ativa (Q-001/Q-005). Header de tenant não substitui autorização.

## Variações adicionais para a suíte futura

| Caso | Resultado proposto |
| --- | --- |
| Desconto na liquidação | P 200, D 10, J 0 → caixa 190, principal quitado 200, desconto reportado 10; condicionado a Q-007 |
| Acréscimo manual | P 200, D 0, J 5 → caixa bruto 205, principal quitado 200; não alterar parcela original |
| Taxa realizada | Recebido bruto 200 e taxa 6 → caixa líquido 194; não criar segunda despesa para a mesma taxa |
| Consulta vazia | Totais zero; ticket/comparação sem base = null; sem NaN/infinito |
| Pagamento futuro | Rejeitar como realizado; manter somente previsão |
| Falha entre baixa e caixa | Rollback integral, inclusive auditoria de sucesso e resultado idempotente |
| Reversão no mês seguinte | Caixa do mês original preserva realização; saída aparece na data real de reversão |

Esses testes são critérios de planejamento. Esta fase valida a consistência documental, não executa dinheiro real nem certifica regras contábeis ou tributárias.
