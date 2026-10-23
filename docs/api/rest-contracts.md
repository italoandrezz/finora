# Contratos REST futuros do MVP

**Proposta para revisão, sem endpoints implementados nesta fase.** Hoje somente o healthcheck da base técnica é público. Identificadores API-xx permitem rastrear as telas e [RF](../requirements/functional-requirements.md). Regras financeiras em [RN](../domain/business-rules.md); campos persistidos no [dicionário](../domain/data-dictionary.md).

## Convenções aplicáveis a cada operação

- Base `/api/v1`; JSON camelCase; UUID textual; dinheiro como string decimal com duas casas, por exemplo `"200.00"`; moeda BRL no recorte. Datas de negócio ISO `YYYY-MM-DD`; instantes técnicos RFC 3339 UTC.
- Negócio exige identidade, `X-Tenant-Id` validado contra membership ativo e permissão da operação. O header é seleção, **não autorização**. Corpo não aceita tenantId para escolher empresa. GET /me e /me/tenants são globais autenticados, sem tenant selecionado.
- Perfis propostos: A = ADMIN, F = FINANCE, S = SALES. São atalhos para permissões da [matriz](../architecture/multi-tenancy.md), pendentes Q-005. Endpoint sempre verifica autorização no servidor; DTOs omitem custo de produto e resumos financeiros não autorizados.
- Todos podem retornar 400 (JSON/query/UUID inválidos), 401 (sem identidade), 403 (permissão/contexto não autorizado), 404 (recurso ausente naquele tenant) e 500 (falha interna redigida). Em mutações: 422 para campos/regras inválidos; 409 para versão/saldo/idempotência/estado conflitantes. Nunca indicar que o UUID existe em outra empresa.
- POSTs de negócio e PATCHs usam `Idempotency-Key`; chave igual/corpo igual retorna mesmo status/recurso após reautorização. Corpo diferente com a mesma chave retorna 409 IDEMPOTENCY_CONFLICT. `expectedVersion` é obrigatório em alteração de agregado e baixa/reversão, conforme recurso; versão antiga gera 409 VERSION_CONFLICT para pedido novo. Replay autorizado é consultado antes da validação de versão.
- Listas paginadas: `page` base zero, `size` padrão 20/máximo 100, `sort=campo,asc|desc` limitado a allowlist e desempate por id. Resposta `items,page,size,totalElements,totalPages,meta`. Não trocar para paginação infinita só por ser mobile.
- `from/to` são inclusivos e `from <= to`; o significado de data é declarado em cada operação. `asOf` de posição financeira é data de referência até hoje do tenant; resposta informa critério e timezone. A política operacional de cancelamentos retroativos está em Q-017; não promete snapshot contábil imutável.
- Recurso criado: 201 + Location do recurso. Cancelamento/reversão são registros de operação POST, não DELETE físico. Não há endpoint público genérico para inserir CashMovement.

## Formatos compartilhados

Os nomes abaixo são schemas de discussão e seus campos são definidos aqui. `?` significa opcional. PATCH aceita somente os campos listados; campos calculados e tenant não são mass-assigned.

| Schema | Campos / validações principais |
| --- | --- |
| CustomerWrite | name (1–160), document?, phone?, email?, city?, state?, notes?; formatos/limites do dicionário; política Q-003 |
| CustomerView | id, name, documentMasked?, phone?, email?, city?, state?, notes?, active, version; financialSummary somente A/F |
| ProductWrite | code, name, salePrice ≥ 0, unitCost? ≥ 0; código único local; nenhuma quantidade de estoque |
| ProductView | id, code, name, salePrice, active, version; unitCost só A/F |
| SaleWrite | customerId, soldOn, items[{productId,quantity}], discountAmount, surchargeAmount, paymentTerms, plannedPaymentMethodId?, installmentCount, firstDueOn, expectedTotal, notes?, initialReceipt?; preço vem do catálogo no servidor, sem override implícito |
| SaleView | id, number, customer, soldOn, status, paymentTerms, subtotal, discountAmount, surchargeAmount, total, settlementStatus, refundPendingAmount, version, items[{productId,productCode,productName,quantity,unitPrice,subtotal}], receivable{id,installments[]}; nunca custo para S |
| InstallmentView | id, receivableId, saleId, saleNumber, customer{id,name}, sequence, dueOn, originalAmount, settledPrincipal, remainingPrincipal, outstandingAmount, settlementStatus, overdue, version; cancelada: outstandingAmount=0, settlementStatus=CANCELLED e restante histórico preservado |
| PaymentWrite | amount, paidOn, paymentMethodId, cashAccountId, discountAmount?=0, surchargeAmount?=0, feeAmount?=0 somente recebimento, externalReference?, notes?, expectedVersion do título/parcela; amount + desconto − acréscimo deve ser >0 e ≤ saldo |
| PaymentView | id, installmentId ou payableId, principalAmount, amount, discountAmount, surchargeAmount, feeAmount? (recebimento), paidOn, paymentMethodId, cashAccountId, reversed, reversalId?, createdAt, version:0; registros imutáveis, versão zero para referência de reversão |
| PaymentResult | payment (PaymentView), outstandingAmount, settlementStatus, cashEffect{direction,netAmount,movementIds}, meta; após commit, não simulação de frontend |
| PayableWrite | description, supplierName?, categoryId, originalAmount > 0, dueOn; sem campo paid=true |
| PayableView | id, description, supplierName?, categoryId, originalAmount, dueOn, status, settledPrincipal, remainingPrincipal, outstandingAmount, settlementStatus, overdue, version; cancelado aplica RN-005 sem tratar como quitado |
| ReversalWrite | kind, reversedOn, refundFee?, reason (1–500), expectedVersion:0 da baixa imutável; contexto de título bloqueado é revalidado. REFUND só de recebimento de venda cancelada; uma reversão por baixa |
| ReversalView | id, paymentId, kind, reversedOn, movementIds, reason, resultingOutstandingAmount, meta; taxas retornadas só se fato confirmado |
| SettingsView/Write | name?, currency, timezone, defaultCashAccountId?, defaultIncomeCategoryId?, feeCategoryId?, version; PATCH inclui expectedVersion; BRL e defaults ativos/do tenant; não atualizar saldo por settings |
| MembershipView | id, user{id,name,email}, roleCode, status, version; sem credencial |
| CashAccountView | id, name, openedOn, active, balance, version; balance calculado |
| MovementView | id, cashAccountId, occurredOn, kind, direction, amount, categoryId?, source{id,type}, reversesMovementId?, createdAt; somente leitura |
| Meta | tenantId quando contextual, currency, timezone, asOf?, filters; permite descartar resposta da empresa anterior no frontend |

PaymentView.version:0 é apenas token estável de referência, não coluna mutável adicional. A exclusividade da reversão é garantida por lock e unique, não por incrementar versão de uma baixa imutável. Cancelamento da venda usa Sale.version; a baixa recebe a versão da parcela/pagável.

## Catálogo de operações essenciais propostas

Cada linha herda contexto, erros e envelopes acima; os códigos adicionais são conflitos específicos. `∅` indica sem body e não significa ausência de autorização. Paginação só onde indicada.

| ID | Método e caminho | Finalidade / autorização / tenant | Request | Response / sucesso | Validações e erros específicos / paginação |
| --- | --- | --- | --- | --- | --- |
| API-01 | GET `/me` | Identidade atual; autenticado; global | ∅ | 200 {id,name,email} | Usuário desativado:401; sem informações de lojas não autorizadas |
| API-02 | GET `/me/tenants` | Empresas autorizadas; autenticado; global | ∅ | 200 {items:[{id,name,roleCode}]} | Só vínculos ativos; lista sem empresas é vazia, sem seleção automática |
| API-03 | GET `/tenant/settings` | Preferências mínimas; A/F/S; tenant validado | ∅ | 200 SettingsView | Campos pessoais/administrativos restritos a A; sem segredos |
| API-04 | PATCH `/tenant/settings` | Alterar preferências; A; tenant | SettingsWrite + expectedVersion | 200 SettingsView | BRL, IANA, defaults do tenant/tipo correto; 409 mudança proibida por lançamentos/política não aprovada |
| API-05 | POST `/customers` | Cadastrar cliente; A/S; tenant | CustomerWrite | 201 CustomerView | 409 DOCUMENT_CONFLICT se política de unicidade aprovada; não exigir CPF por inferência |
| API-06 | GET `/customers` | Pesquisar; A/F/S; tenant | q?,active?,financialStatus? A/F | 200 página CustomerView | q por nome/CPF/telefone; S sem filtros/agregados financeiros; sort name,createdAt |
| API-07 | GET `/customers/{id}` | Detalhe; A/F/S; tenant | ∅ | 200 CustomerView | Resumo financeiro A/F; histórico via API-09/15 filtradas; notas/permissões revistas Q-013 |
| API-08 | POST `/sales` | Confirmar venda atomicamente; A/S; tenant | SaleWrite | 201 SaleView + initialPayment? | Produtos/clientes ativos; total recalculado; 409 PRICE_CHANGED/IDEMPOTENCY_CONFLICT; cartão condicionado Q-008 |
| API-09 | GET `/sales` | Listar vendas; A/F/S; tenant | from?,to? por soldOn; q?,customerId?,status?,settlementStatus[]?,paymentMethodId? | 200 página SaleView resumida + summary | sort soldOn,number,total; mesmos filtros no summary; OR entre estados e AND entre dimensões; sem itens completos em cada linha |
| API-10 | GET `/sales/{id}` | Itens e situação da venda; A/F/S; tenant | ∅ | 200 SaleView | Sem dados de outras vendas/contas para S; sem custos |
| API-11 | POST `/sales/{id}/cancellations` | Cancelar comercialmente; A; tenant | {reason,expectedVersion} | 201 {id,saleId,status,refundPendingAmount} | 409 SALE_STATE_CONFLICT; não gerar caixa nem excluir pagamentos |
| API-12 | POST `/products` | Cadastrar produto; A; tenant | ProductWrite | 201 ProductView | 409 PRODUCT_CODE_CONFLICT; preços/custo ≥0 |
| API-13 | GET `/products` | Catálogo; A/F/S; tenant | q?,active? | 200 página ProductView | sort name,code,salePrice; sem estoque fictício, custo omitido para S |
| API-14 | PATCH `/products/{id}` | Editar/inativar; A; tenant | code?,name?,salePrice?,unitCost?,active?,expectedVersion | 200 ProductView | Não reescrever snapshot histórico; 409 código/versão |
| API-15 | GET `/receivable-installments` | Posição de parcelas; A/F; tenant | customerId?,saleId?,from?,to? por dueOn; settlementStatus[]?,overdue?,asOf? | 200 página InstallmentView + summary | sort dueOn,sequence; saldo/atraso derivados; filtros e totalização reconciliáveis |
| API-16 | POST `/receivable-installments/{id}/payments` | Recebimento integral/parcial; A/F; tenant | PaymentWrite | 201 PaymentResult | 409 BALANCE_CONFLICT/TITLE_CANCELLED/VERSION_CONFLICT; paidOn não futuro; taxa/ajustes só após Q-007/008 |
| API-17 | GET `/receivable-payments` | Histórico realizado; A/F; tenant | from?,to? por paidOn; installmentId?,customerId?,saleId?,cashAccountId? | 200 página PaymentView | sort paidOn,createdAt; reversões visíveis, sem excluir original |
| API-18 | POST `/receivable-payments/{id}/reversals` | Corrigir/restituir baixa; A; tenant | ReversalWrite | 201 ReversalView | 409 ALREADY_REVERSED/REFUND_REQUIRES_CANCELLED_SALE; data ≥ original; compensação integral |
| API-19 | POST `/payables` | Registrar despesa prevista; A/F; tenant | PayableWrite | 201 PayableView | Categoria EXPENSE ativa; nenhum efeito em caixa |
| API-20 | GET `/payables` | Listar obrigações; A/F; tenant | q?,categoryId?,from?,to? por dueOn; settlementStatus[]?,overdue?,asOf? | 200 página PayableView + summary | sort dueOn,originalAmount; busca descrição/fornecedor |
| API-21 | POST `/payables/{id}/payments` | Pagar despesa; A/F; tenant | PaymentWrite sem feeAmount | 201 PaymentResult com direction OUT | 409 saldo/estado/versão; conta ativa; pagamento não futuro |
| API-22 | GET `/payable-payments` | Histórico de saídas; A/F; tenant | payableId?,from?,to? por paidOn; cashAccountId? | 200 página PaymentView | sort paidOn,createdAt; reversão não apaga original |
| API-23 | POST `/payable-payments/{id}/reversals` | Corrigir pagamento; A; tenant | ReversalWrite com kind CORRECTION e refundFee=false | 201 ReversalView | 409 ALREADY_REVERSED; reabre principal e gera IN; restituição comercial de fornecedor fora do recorte |
| API-24 | GET `/cash-accounts` | Contas e saldos; A/F; tenant | active?,asOf? | 200 página CashAccountView | sort name; mesma moeda; sem expor conta de outro tenant |
| API-25 | POST `/cash-accounts` | Abrir conta e saldo inicial; A; tenant | {name,openedOn,openingBalance} | 201 CashAccountView | Saldo decimal assinado; se não zero gera OPENING de magnitude absoluta; conta só recebe abertura uma vez; saldo negativo pendente Q-010 |
| API-26 | GET `/cash-movements` | Caixa realizado; A/F; tenant | from,to por occurredOn; cashAccountId?,kind?,direction? | 200 página MovementView + summary | sort occurredOn,createdAt; summary distingue abertura, operação, taxa e reversões; não inclui previsão |
| API-27 | GET `/dashboard` | Indicadores básicos; A/F; tenant | from,to por soldOn/paidOn conforme métrica; asOf para posição | 200 DashboardView abaixo | Intervalo válido; metadados de datas; sem agregar tenants; vazio → zero/null |
| API-28 | GET `/payment-methods` | Meios disponíveis; A/F/S; tenant | active? | 200 {items:[{id,code,name,active}]} | Catálogo pequeno limitado; CARD inativo até Q-008; crediário não é meio |
| API-29 | GET `/financial-categories` | Categorias; A/F; tenant | kind?,active? | 200 página {id,name,kind,active} | sort name; defaults podem ser provisionados sem CRUD completo inicial |
| API-30 | PATCH `/customers/{id}` | Editar/arquivar; A/S; tenant | CustomerWrite parcial + active? + expectedVersion | 200 CustomerView | Não apaga vendas; 409 versão/documento |
| API-31 | GET `/products/{id}` | Consultar produto; A/F/S; tenant | ∅ | 200 ProductView | Custo omitido para S; inativo continua consultável por histórico |
| API-32 | GET `/payables/{id}` | Consultar despesa; A/F; tenant | ∅ | 200 PayableView | Pagamentos via API-22; sem comprovante inexistente |
| API-33 | POST `/payables/{id}/cancellations` | Cancelar previsão sem baixas; A; tenant | {reason,expectedVersion} | 201 {id,payableId,status} | 409 PAYABLE_HAS_PAYMENTS; cancelar com realização exige nova política, não apagar saída |
| API-34 | GET `/receivables/{id}` | Consultar título/parcelas; A/F; tenant | ∅ | 200 {id,saleId,originalAmount,status,installments:[InstallmentView]} | Mesma posição da API-15; título cancelado não aparece como quitado |
| API-35 | GET `/tenant/memberships` | Listar vínculos existentes; A; tenant | status? | 200 página MembershipView | sort userName,createdAt; sem revelar diretório global de usuários |
| API-36 | PATCH `/tenant/memberships/{id}` | Alterar papel/revogar vínculo existente; A; tenant | {roleCode?,status?,expectedVersion} | 200 MembershipView | 409 LAST_ADMIN; membership e papel do tenant, não usuário global; não é envio de convite |

Provisionar usuário/loja/vínculo inicial será operação controlada da aplicação após decidir identidade; não expor endpoint público que permita a um usuário comum criar vínculos privilegiados. Convites, assinatura, upload de logo/comprovante, relatório exportável, busca global e notificações ficam fora deste catálogo essencial. Não inventar endpoint funcional para toda aba do protótipo.

## Exemplos JSON representativos

UUIDs abaixo são fictícios e só identificam recursos de exemplo dentro do mesmo tenant. Os exemplos não são payloads da aplicação atual nem credenciais reais.

### Cliente — API-05

Request:

```json
{
  "name": "Cliente de exemplo",
  "phone": "+5585999990000",
  "notes": "Contato preferencial por mensagem"
}
```

Response 201 (Location `/api/v1/customers/11111111-1111-4111-8111-111111111111`):

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Cliente de exemplo",
  "phone": "+5585999990000",
  "active": true,
  "version": 0
}
```

### Confirmação parcelada — API-08

Request com Idempotency-Key opaca e estável:

```json
{
  "customerId": "11111111-1111-4111-8111-111111111111",
  "soldOn": "2026-10-23",
  "items": [
    {"productId": "22222222-2222-4222-8222-222222222222", "quantity": 1}
  ],
  "discountAmount": "0.00",
  "surchargeAmount": "0.00",
  "expectedTotal": "600.00",
  "paymentTerms": "INSTALLMENTS",
  "installmentCount": 3,
  "firstDueOn": "2026-11-10"
}
```

Response 201, excerto dos campos financeiros (demais campos seguem SaleView):

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "number": 1,
  "status": "CONFIRMED",
  "total": "600.00",
  "settlementStatus": "UNPAID",
  "refundPendingAmount": "0.00",
  "version": 0,
  "receivable": {
    "id": "44444444-4444-4444-8444-444444444444",
    "installments": [
      {"id": "55555555-5555-4555-8555-555555555551", "sequence": 1, "dueOn": "2026-11-10", "originalAmount": "200.00", "outstandingAmount": "200.00", "version": 0},
      {"id": "55555555-5555-4555-8555-555555555552", "sequence": 2, "dueOn": "2026-12-10", "originalAmount": "200.00", "outstandingAmount": "200.00", "version": 0},
      {"id": "55555555-5555-4555-8555-555555555553", "sequence": 3, "dueOn": "2027-01-10", "originalAmount": "200.00", "outstandingAmount": "200.00", "version": 0}
    ]
  }
}
```

Para cenário A, `paymentTerms=IMMEDIATE`, count=1, dueOn=soldOn e `initialReceipt` segue PaymentWrite sem expectedVersion (parcela ainda está sendo criada), com amount=150, paidOn e método/conta autorizados. Informar método planejado sem initialReceipt **não** baixa título automaticamente.

### Baixa parcial — API-16

Request sobre a primeira parcela acima:

```json
{
  "amount": "80.00",
  "paidOn": "2026-11-10",
  "paymentMethodId": "66666666-6666-4666-8666-666666666666",
  "cashAccountId": "77777777-7777-4777-8777-777777777777",
  "expectedVersion": 0
}
```

Response 201, excerto:

```json
{
  "payment": {
    "id": "88888888-8888-4888-8888-888888888888",
    "installmentId": "55555555-5555-4555-8555-555555555551",
    "principalAmount": "80.00",
    "amount": "80.00",
    "discountAmount": "0.00",
    "surchargeAmount": "0.00",
    "feeAmount": "0.00",
    "paidOn": "2026-11-10",
    "reversed": false,
    "version": 0
  },
  "outstandingAmount": "120.00",
  "settlementStatus": "PARTIAL",
  "cashEffect": {"direction": "IN", "netAmount": "80.00", "movementIds": ["99999999-9999-4999-8999-999999999999"]},
  "meta": {"currency": "BRL", "timezone": "America/Fortaleza", "asOf": "2026-11-10"}
}
```

Datas futuras em relação ao momento da operação são exemplos de execução futura do cenário, não permissão para antecipar contabilização hoje.

### Despesa prevista e pagamento — API-19/API-21

```json
{
  "description": "Despesa de exemplo",
  "supplierName": "Fornecedor de exemplo",
  "categoryId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "originalAmount": "350.00",
  "dueOn": "2026-11-05"
}
```

Resposta PayableView começa com outstandingAmount=350, settlementStatus=OPEN e nenhum movimento. A baixa usa PaymentWrite amount=350 ou parcial, sem feeAmount; cashEffect.direction=OUT. Não existe entrada que aceite paid=true no cadastro.

### DashboardView — API-27

Exemplo sem reversões/taxas, com o período original do protótipo:

```json
{
  "sales": {"confirmedTotal": "4800.00", "count": 8, "averageTicket": "600.00"},
  "cash": {"openingBalance": "5000.00", "openingAdjustmentsNet": "0.00", "grossReceipts": "3900.00", "paidExpenses": "2600.00", "fees": "0.00", "refundInflows": "0.00", "refundOutflows": "0.00", "correctionInflows": "0.00", "correctionOutflows": "0.00", "operatingResult": "1300.00", "netResult": "1300.00", "closingBalance": "6300.00"},
  "receivables": {"outstandingAmount": "2200.00", "overdueAmount": "300.00"},
  "meta": {"currency": "BRL", "timezone": "America/Fortaleza", "asOf": "2026-10-22", "filters": {"from": "2026-10-01", "to": "2026-10-22"}}
}
```

O valor de recebíveis reproduz o card, **não valida a tabela inconsistente** (Q-012). Dashboard completo também retorna séries realizadas, próximas obrigações e últimas vendas com os mesmos critérios dos endpoints correspondentes; posições de recebíveis/pagáveis usam asOf, não são limitadas inadvertidamente à data de venda do período. Sem base de comparação, percentual e ticket médio retornam null. paidExpenses inclui fees; operatingResult = grossReceipts − paidExpenses; netResult acrescenta correctionInflows − correctionOutflows + refundInflows − refundOutflows. closingBalance = openingBalance + openingAdjustmentsNet + netResult. Aberturas na data from pertencem ao saldo inicial; aberturas de outras contas após from entram em openingAdjustmentsNet, nunca em receita (RN-013).

### Erro comum

```json
{
  "type": "about:blank",
  "title": "Conflito no saldo da parcela",
  "status": 409,
  "code": "BALANCE_CONFLICT",
  "detail": "O saldo mudou. Atualize os dados antes de confirmar.",
  "traceId": "exemplo-correlacao"
}
```

Erros 422 podem incluir `errors:[{field,message}]`. Erros de autorização não incluem saldo, nome ou ID de outro tenant. Sucesso HTTP só é emitido depois do commit transacional.

## Autenticação ainda não aprovada

RF-001 exige autenticação, mas não existe contrato definitivo de credenciais. Se ADR-003 for aprovado, uma proposta é POST `/auth/session` para iniciar e DELETE `/auth/session` para encerrar, com cookie HttpOnly e fluxo CSRF apropriado; erro de credencial é genérico e logout retorna 204. Se houver OIDC, o contrato muda para redirecionamento/callback seguro. Não implementar ambos nem inventar token JWT nesta fase. Login/recuperação/provisionamento devem ser detalhados antes de implementar identity.
