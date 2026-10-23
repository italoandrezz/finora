# Regras de negócio e invariantes propostas

E = exigência do pedido; O = observação do [inventário](../requirements/figma-screen-inventory.md); P = desenho proposto, sujeito às [questões abertas](../requirements/open-questions.md). As regras descrevem comportamento futuro; não há código ou schema financeiro implementado.

## RN-001 — Seis fatos diferentes (E/O)

| Fato | Registro proposto | Impacto imediato no caixa |
| --- | --- | --- |
| Venda realizada | Sale CONFIRMED + SaleItems históricos | Nenhum por si só |
| Valor previsto a receber | Receivable + ReceivableInstallments | Nenhum |
| Valor efetivamente recebido | ReceivablePayment | Entrada realizada vinculada |
| Despesa prevista | Payable | Nenhum |
| Despesa efetivamente paga | PayablePayment | Saída realizada vinculada |
| Movimentação real de caixa | CashMovement | Somente realização, abertura ou reversão registrada |

“Receita recebida” nas telas é uma métrica operacional de caixa, não reconhecimento contábil/fiscal. Estoque/custo de produto não geram saída de caixa automaticamente. Registrar previsão e realização como entradas simultâneas duplicaria dinheiro.

## RN-002 — Tenant e autorização (E)

Toda entidade de negócio tem tenant_id obrigatório. Autenticação, membership ativo e permissão no tenant são necessários em cada operação, inclusive leitura, agregado e reversão. UUID de outra empresa não pode ser associado a venda, conta, categoria ou pagamento. Relações tenant-scoped usam chave estrangeira composta; ver [isolamento](../architecture/multi-tenancy.md).

## RN-003 — Dinheiro e centavos (E/P)

Java usa BigDecimal construído de decimal textual; banco NUMERIC(19,2); moeda inicial BRL proposta. Contratos usam strings como `"200.00"`. Inputs monetários devem ter no máximo duas casas, valor dentro da precisão e sem sinal quando representam montante. Não converter passando por float/double; no frontend Number não é autoridade para dinheiro.

Proposta de arredondamento de cálculos que realmente precisem dele: HALF_UP, explicitamente ao fechar o valor comercial em duas casas; entradas com escala indevida são rejeitadas, não arredondadas silenciosamente. Quantidades inteiras no MVP evitam arredondamento por unidade fracionada (Q-006).

Distribuição de parcelas: converter o total decimal exato em centavos inteiros, dividir por N, distribuir o resto de um centavo nas primeiras parcelas, em ordem. Exemplo R$ 100/3: 33,34; 33,33; 33,33. Cada parcela deve ser positiva; rejeitar N que produza parcela zero. A soma é exatamente o total; não arredondar cada parcela independentemente.

Fonte de referência técnica: [BigDecimal — Java 17](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/math/BigDecimal.html). A escolha HALF_UP é proposta do projeto, não exigência da biblioteca ou regra legal.

## RN-004 — Itens e total comercial (E/O/P)

SaleItem preserva product_id e snapshots de código, nome, unit_price e unit_cost quando conhecido. Alterar Product não reprecifica vendas confirmadas. Proposta: quantidade inteira > 0; unit_price ≥ 0; subtotal = soma de quantity × unit_price; desconto comercial entre zero e subtotal; acréscimo ≥ 0; total = subtotal − desconto + acréscimo > 0. Backend calcula todos os derivados e rejeita divergência de confirmação enviada pelo cliente.

Mudanças de preço/custo em venda confirmada são proibidas; cancelamento e nova venda preservam histórico. Arquivar cliente/produto não apaga itens ou movimentos. Para rascunhos, produtos inativos não podem ser confirmados. O significado do custo para margem/estoque está pendente; não apresentar lucro contábil.

## RN-005 — Ciclo comercial versus situação financeira (E/P)

- Sale.status: DRAFT, CONFIRMED, CANCELLED. DRAFT só será persistido se Q-016 aprovar; formulário local não precisa de registro no banco.
- CONFIRMED exige uma venda válida, um Receivable ativo e suas parcelas, gravados atomicamente.
- Situação financeira de venda ativa é derivada: UNPAID se principal liquidado líquido = 0; PARTIAL se entre 0 e total; PAID se igual ao total.
- Atraso é dimensão independente: existe parcela com saldo > 0 e due_on < asOf. Uma venda PARTIAL também pode estar atrasada.
- Receivable tem ciclo ACTIVE/CANCELLED; situação de cada parcela ativa é OPEN/PARTIAL/SETTLED, derivada de principal líquido. Quando a obrigação está cancelada, a projeção retorna settlementStatus=CANCELLED, não SETTLED. OVERDUE é indicador temporal separado, não estado persistido que exige um job diário.
- Payable tem ACTIVE/CANCELLED e situação financeira derivada equivalente.

Não editar manualmente “pago” ou “vencido”. A interface pode traduzir estados, mas não usar o rótulo “Recebida” como ciclo comercial da venda.

Para evitar ambiguidade no cancelamento: remainingPrincipal = original − principal líquido liquidado é saldo histórico não liquidado; outstandingAmount é remainingPrincipal somente para obrigação ACTIVE e zero para CANCELLED. Uma obrigação cancelada pode conservar remainingPrincipal=600 sem cobrar 600. Venda cancelada também retorna situação financeira CANCELLED; sua restituição pendente é calculada separadamente a partir dos valores brutos recebidos ainda não devolvidos. Pagamentos/estornos não são apagados para forçar zeros.

## RN-006 — Condições, métodos e calendário (E/O/P)

PaymentMethod é catálogo por tenant de meios realizados, por exemplo PIX, CASH, BANK_TRANSFER e CARD. **Crediário é condição de prazo, não meio pelo qual dinheiro entrou.** Sale.payment_terms distingue IMMEDIATE de INSTALLMENTS; planned_payment_method_id pode indicar intenção, mas não cria pagamento.

Crediário sem método planejado gera parcelas do cliente. Venda Pix/dinheiro só gera caixa se o usuário também confirmar recebimento efetivo; a confirmação combinada deve usar a mesma transação de venda/baixa. O formulário de crédito observado prevê caixa zero.

Vencimentos propostos: manter dia-âncora do primeiro vencimento nos meses seguintes; se inexistente, usar último dia do mês, sem propagar o dia reduzido. 31/01 → 28/02 → 31/03 em ano não bissexto. Feriados/limites de parcelas em Q-004. due_on e paid_on são datas comerciais no fuso do tenant, não horários UTC deslocados.

## RN-007 — Pagamentos parciais, antecipados e atraso (E/P)

Uma ReceivablePayment baixa exatamente uma parcela; uma parcela admite várias baixas. Proposta: não aceitar excedente nem crédito implícito; não permitir baixa em obrigação cancelada; antecipação e atraso não mudam valor automaticamente. O atraso termina quando o saldo chega a zero, preservando a data original e a efetiva.

Para Payable, cada PayablePayment baixa diretamente o título de um vencimento. Parcelamento de despesa é posterior; por isso PayableInstallment não integra o modelo essencial. Se aprovado, introduzir a entidade e migrar vínculos mediante decisão própria, sem fingir que já existe.

## RN-008 — Desconto e acréscimo na liquidação (E exige avaliação; P)

Campos propostos, habilitação dependente de Q-007: principal_amount P, discount_amount D, surcharge_amount J e amount A efetivamente pago pelo cliente. **A = P − D + J**; P > 0, D/J ≥ 0, D ≤ P, A > 0 e P ≤ saldo de principal. A parcela original não é reescrita. A API pode receber A/D/J e calcular P = A + D − J.

Exemplos: principal 200, desconto 10, acréscimo 0 → recebido 190 e parcela quitada; principal 200, acréscimo 5 → recebido 205. Pagamento parcial simples usa P = A, D = J = 0. Proposta inicial: D/J sempre zero enquanto política/permissão não forem aprovadas; nenhum juro automático por atraso.

Não subtrair caixa diretamente do principal. Principal líquido liquidado = soma de principal_amount dos pagamentos com paid_on até asOf **menos** principal_amount das reversões efetivas até asOf. Saldo = original − principal líquido. Não pode ficar negativo. Estornos não são novos pagamentos com sinal negativo.

## RN-009 — Taxas de cartão e realização (E exige avaliação; P)

O modelo reserva fee_amount em ReceivablePayment, com zero como regra inicial; habilitar CARD depende de Q-008. Se adotado: 0 ≤ taxa < amount; gravar recebimento bruto IN amount e taxa OUT fee_amount na mesma conta/transação, como decomposição auditável do líquido recebido. Líquido = amount − fee_amount. Não criar adicionalmente um PayablePayment para a mesma taxa.

Exemplo principal 200, sem ajuste, taxa 6: cliente liquidou 200; entrada bruta 200 e saída de taxa 6; caixa líquido +194. A taxa não reabre dívida do cliente. Indicador de entradas brutas deve ser rotulado; saldo usa ambos os movimentos. Taxa é despesa operacional realizada, estorno comercial não é despesa operacional.

Uma venda autorizada no cartão não significa dinheiro disponível. Calendário de repasse da adquirente deve ser definido separadamente; no MVP proposto, cartão fica pendente em vez de simular integração ou presumir que as parcelas do comprador são datas de repasse.

## RN-010 — Cancelar não é devolver dinheiro (E/P)

Cancelamento exige motivo e ator e é irreversível no MVP proposto. Bloqueia novas baixas e cancela o saldo de cobrança do Receivable, mantendo valor original/parcelas/pagamentos para auditoria. Sem pagamentos, caixa não muda. Com recebimento líquido existente, Sale indica REFUND_PENDING derivado; nenhuma saída fictícia é criada.

PaymentReversal referencia exatamente uma ReceivablePayment ou PayablePayment. Proposta MVP: reversão integral de uma baixa, uma vez; parcial e reabertura de venda ficam fora. Dois tipos:

- CORRECTION: corrige baixa errada em título ativo; reabre o principal e inverte todos os movimentos originais, inclusive taxa registrada por erro.
- REFUND: restituição efetiva após cancelamento de venda; inverte o recebimento bruto e, somente se efetivamente restituída, a taxa. Não reabre a cobrança da venda cancelada. Q-008 define se a taxa volta; caso contrário a saída original de taxa permanece.

CashMovement de reversão aponta ao movimento original, que permanece imutável. Uma reversão não se apaga nem se reverte novamente no primeiro recorte; erro na própria reversão exige procedimento futuro, não edição silenciosa. Para PayablePayment, CORRECTION devolve entrada e reabre título; REFUND comercial de fornecedor não é parte do MVP. Motivo/observação não substituem prova de que dinheiro foi devolvido; na aplicação o usuário confirma o fato realizado.

## RN-011 — Caixa como histórico de fatos (E/P)

CashAccount começa com zero ou um movimento OPENING, datado e auditado; não editar saldo corrente. Balance(asOf) = soma de IN − OUT até a data, incluindo abertura e reversões. Abertura não é receita/despesa operacional. Transferências entre contas ficam fora do MVP para não criar uma API genérica capaz de duplicar recebimentos.

CashMovement nasce somente de abertura, recebimento, pagamento, taxa ou reversão autorizados; **não há endpoint livre para lançar de novo uma baixa**. Cada origem/papel gera no máximo um movimento. Resumos por conta e consolidados usam a mesma moeda; multi-moeda não incluída.

## RN-012 — Atomicidade, concorrência e duplicidade (E/P)

Confirmação: venda + itens + recebível + parcelas + auditoria + resultado idempotente em uma transação. Baixa: validar/lockar obrigação, criar pagamento, movimento(s), auditoria e resultado idempotente na mesma transação. Reversão idem, incluindo recalcular elegibilidade e impedir segunda reversão.

Usar bloqueio de linha do título/parcelas e ordem determinística: venda quando necessária → recebível/pagável → parcelas em ordem de UUID → pagamento → contas em ordem de UUID. Versionamento otimista detecta formulários antigos; lock serializa a baixa. Falhas de qualquer gravação causam rollback de toda a operação. Não usar soma consultada fora da transação como proteção de saldo.

Idempotency-Key é obrigatório em criação/confirmação, baixa, cancelamento e reversão. Escopo tenant + usuário + operação/alvo + chave; armazenar hash canônico do pedido e resultado mínimo no mesmo commit. Mesma chave/corpo retorna resultado original após nova autorização; mesma chave com outro corpo retorna 409. Verificar replay antes de rejeitar versão antiga; não repetir efeitos.

Não expirar metadados de deduplicação financeira automaticamente em 24h: retenção depende de Q-013. Outra chave para um pagamento parcial igual pode representar fato legítimo ou duplicata humana; não há como provar só pelo valor/data. Interface preserva chave após timeout e exige confirmação de possível repetição; referência externa única, quando informada, dá proteção adicional por tenant. Garantia idempotente não é garantia de conciliação bancária.

## RN-013 — Indicadores reconciliáveis (E/O/P)

- Faturamento operacional: totais das vendas confirmadas, por sold_on no intervalo, excluindo canceladas segundo política Q-017. Receber parcela antiga não cria faturamento.
- Recebimentos realizados: soma bruta das baixas por paid_on, com reversões apresentadas separadamente; caixa líquido usa taxa e reversões. Sempre informar se valor é bruto ou líquido.
- Recebido **dessas vendas**: pagamentos ligados às vendas do filtro comercial, com data de corte explícita; difere de recebimentos **no período** de vendas de qualquer data.
- Despesas pagas: pagamentos de despesas e taxas realizadas, não títulos previstos; reembolso de venda não deve ser rotulado como despesa operacional.
- Em aberto: soma de principal pendente de obrigações ativas; em atraso é subconjunto por due_on < asOf; data igual a hoje não está atrasada.
- Resultado operacional bruto: entradas operacionais − saídas operacionais; resultado líquido de caixa também inclui correções e restituições, com entradas/saídas separadas. Saldo inclui abertura e todos os movimentos. Não chamar nenhum deles de lucro.
- Ticket médio: faturamento ÷ quantidade de vendas confirmadas na mesma seleção; conjunto vazio retorna null (não divisão por zero). Comparação contra zero não produz infinito.

Proposta inicial de consulta histórica operacional: asOf e timezone explícitos; movimentos/reversões respeitam suas datas; faturamento pode ser reprocessado após cancelamento, sem promessa de fechamento contábil. Se exigida visão imutável “como era naquele dia”, decidir Q-017 e ampliar modelo/contrato antes da implementação.

Para não duplicar abertura em um intervalo: openingBalance é o saldo anterior a from somado às aberturas da própria data from (logicamente no início do dia); aberturas de novas contas depois de from aparecem em openingAdjustmentsNet, não em receita. closingBalance = openingBalance + openingAdjustmentsNet + grossReceipts − paidExpenses + correctionInflows − correctionOutflows + refundInflows − refundOutflows. paidExpenses já inclui fees; não somá-las outra vez. Taxa devolvida em REFUND entra em refundInflows; correção de taxa em correctionInflows. Operações comuns da data from pertencem ao fluxo, não ao saldo inicial.

## RN-014 — Previsto e projetado (O/P)

Projeção é saldo realizado + recebíveis ainda pendentes no horizonte − pagáveis ainda pendentes, com atrasados separados/identificados. Nunca somar valor original de parcela que já recebeu parte. Não gravar projeção como CashMovement. RF-029 é evolução; regra de incluir atrasados em Q-010.

## RN-015 — Integridade e arquivamento (E/P)

Entidades financeiras e seus vínculos não têm exclusão física em operações normais. Clientes/produtos/métodos/categorias/contas ficam inativos; dados históricos continuam consultáveis por usuários autorizados. Conta com saldo/histórico não é removida; inativa não recebe novos pagamentos. Correções cadastrais não modificam snapshots de vendas. Retenção/anonimização posterior depende de Q-013, sem apagar trilha monetária por cascata.

## RN-016 — Datas reais e datas técnicas (P)

paid_on/reversed_on não podem ser futuros; previsão usa due_on. created_at/confirmed_at/cancelled_at são horários técnicos de auditoria. Registrar ontem hoje preserva ambos. O fuso da empresa determina o “hoje”; os exemplos visuais têm referência em 22/10/2026 e não avançam automaticamente para a data de leitura. Backdating e limites por perfil exigem aprovação em Q-007/Q-017.

## RN-017 — Fronteiras verificáveis (P)

Somas entre linhas, saldo não negativo e quantidade de movimentos por baixa não são garantidos só por CHECK de uma linha. Serviços transacionais e locks garantem invariantes entre tabelas; constraints locais, FKs compostas e índices únicos dão defesa adicional. Não prometer que RLS protege uma associação tenant errada por conta própria. O [dicionário](data-dictionary.md) separa cada camada de garantia.
