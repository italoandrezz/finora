# Dicionário de dados proposto

Referências: [ER](entity-relationship.md), [regras](business-rules.md) e [tenant](../architecture/multi-tenancy.md). Tipos PostgreSQL 17 sugeridos; este documento **não é SQL executável**. Tudo além das diretrizes E permanece proposta para revisão. Ajustes/taxas e autenticação dependem das questões de produto.

## Convenções que se aplicam a todas as tabelas

| Entidade / campo | Tipo PostgreSQL | Obrigatório | Unicidade / relacionamento | Descrição |
| --- | --- | --- | --- | --- |
| Todas: id | uuid | Sim | PK global | Gerado pelo servidor; proposta UUID v4, não autorização |
| Todas de negócio e IdempotencyRecord: tenant_id | uuid | Sim | FK Tenant.id; par (tenant_id,id) único | Fronteira lógica da empresa, nunca inferida somente do request |
| AuditEvent: tenant_id | uuid | Em operação de negócio | FK Tenant.id | Nulo somente em evento global de identidade |
| Tenant e AppUser: tenant_id | Não se aplica | — | — | Raiz da empresa e identidade global não pertencem a outro tenant |
| Cadastros/agregados mutáveis: created_at, updated_at | timestamptz | Sim | — | Instantes de criação/última alteração |
| Cadastros/agregados mutáveis: version | bigint | Sim | — | Concorrência otimista, começa em zero; inclui parcela para controlar baixas concorrentes |
| Registros financeiros imutáveis: created_at, created_by | timestamptz, uuid | Sim | created_by → AppUser.id | Autor autenticado autorizado naquele tenant; não alterar posteriormente |
| Cadastros/agregados mutáveis: created_by, updated_by | uuid | Sim após provisionamento | AppUser.id | Bootstrap registra responsável; alteração exige membership ativo |

Cadastros/agregados mutáveis: Tenant, AppUser, TenantMembership, TenantSettings, Customer, Product, Sale, Receivable, ReceivableInstallment, Payable, PaymentMethod, FinancialCategory e CashAccount. SaleItem pode mudar somente em DRAFT. Pagamentos, reversões, movimentos e auditoria são imutáveis. IdempotencyRecord grava resultado final atomicamente; não é um estado financeiro editável.

Campos monetários abaixo usam `numeric(19,2)` (abreviado **M**); valores intermediários Java são BigDecimal. Nenhum campo financeiro usa real/double precision. Valores de amount são magnitudes positivas; direção fica separada. Campos textuais de estado são conjuntos controlados por CHECK e mapeados a enum no domínio, não enums PostgreSQL difíceis de evoluir sem necessidade.

## Identidade e tenancy

| Entidade / campo | Tipo | Obrigatório | Unicidade / relacionamento | Descrição |
| --- | --- | --- | --- | --- |
| Tenant.name | varchar(160) | Sim | Não único globalmente | Nome de exibição da empresa |
| Tenant.legal_name | varchar(200) | Não | — | Razão social; obrigatoriedade em Q-002 |
| Tenant.document | varchar(20) | Não | Política em Q-002 | CNPJ normalizado se houver; não assumir que cliente precisa de CNPJ |
| Tenant.status | varchar(20) | Sim | ACTIVE/SUSPENDED/ARCHIVED | Suspensão revoga acesso de negócio; não apaga finanças |
| AppUser.name | varchar(160) | Sim | — | Nome global do usuário |
| AppUser.email | varchar(254) | Sim | Único, normalizado | Identificação de contato/login proposta; política de autenticação no ADR-003 |
| AppUser.status | varchar(20) | Sim | ACTIVE/DISABLED | Desativação global impede sessões/autorização |
| TenantMembership.user_id | uuid | Sim | FK AppUser; único (tenant_id,user_id) | Relação N:M de usuário e empresa |
| TenantMembership.role_code | varchar(20) | Sim | ADMIN/FINANCE/SALES | Um papel fixo por vínculo; customização posterior |
| TenantMembership.status | varchar(20) | Sim | ACTIVE/REVOKED | Sem excluir vínculo histórico |
| TenantSettings.tenant_id | uuid | Sim | Também único | Uma configuração por tenant |
| TenantSettings.currency | char(3) | Sim | BRL no recorte | Moeda única; sem conversão cambial |
| TenantSettings.timezone | varchar(64) | Sim | Identificador IANA validado | Referência para datas comerciais; não só offset fixo |
| TenantSettings.default_cash_account_id | uuid | Não durante bootstrap | FK composta CashAccount | Conta ativa do mesmo tenant; obrigatória antes da primeira baixa |
| TenantSettings.default_income_category_id | uuid | Não durante bootstrap | FK composta FinancialCategory | Categoria INCOME padrão para vendas; provisionar antes de confirmar |
| TenantSettings.fee_category_id | uuid | Não | FK composta FinancialCategory | Categoria EXPENSE exigida se taxa de recebimento for habilitada |

Dados de endereço da empresa, logo e segmento estão observados em T-11, mas não são necessários para a primeira operação financeira; serão detalhados quando Q-002 aprovar escopo. O modelo de credencial/provedor não é escolhido por um campo password fictício: acrescentar estrutura apropriada após ADR-003, antes da implementação de identity.

## Comercial

| Entidade / campo | Tipo | Obrigatório | Unicidade / relacionamento | Descrição |
| --- | --- | --- | --- | --- |
| Customer.name | varchar(160) | Sim | Não único | Nome para identificação |
| Customer.document | varchar(20) | Não | Único por tenant quando informado, proposta Q-003 | CPF normalizado, nunca UUID do usuário |
| Customer.phone | varchar(30) | Não na proposta | Não único | A imagem o exige; decisão Q-003 ainda aberta |
| Customer.email | varchar(254) | Não | Não único | Contato, não credencial de acesso |
| Customer.city, state | varchar(100), char(2) | Não | UF validada quando preenchida | Localidade observada |
| Customer.notes | text | Não | Limite de aplicação proposto 2.000 caracteres | Notas sem dados sensíveis desnecessários |
| Customer.active | boolean | Sim | — | Arquivamento lógico |
| Product.code | varchar(64) | Sim | Único (tenant_id,code) | Código estável de catálogo, sem reutilizar código arquivado |
| Product.name | varchar(160) | Sim | — | Nome atual |
| Product.sale_price | M | Sim | ≥ 0 | Preço atual; confirmação exige total da venda > 0 |
| Product.unit_cost | M | Não | ≥ 0 se informado | Custo conhecido; não prova custo médio nem movimenta caixa |
| Product.active | boolean | Sim | — | Inativo não entra em nova confirmação |
| Sale.customer_id | uuid | Sim no recorte proposto | FK composta Customer | Cliente da venda, Q-003 |
| Sale.number | bigint | Sim | Único (tenant_id,number), > 0 | Número de exibição; alocação serializada por tenant, sem MAX+1 concorrente |
| Sale.sold_on | date | Sim | Índice por tenant/data | Data comercial; futuro não permitido na proposta |
| Sale.status | varchar(20) | Sim | DRAFT/CONFIRMED/CANCELLED | Ciclo comercial; DRAFT depende de Q-016 |
| Sale.payment_terms | varchar(20) | Sim | IMMEDIATE/INSTALLMENTS | Prazo comercial, distinto do meio realizado |
| Sale.planned_payment_method_id | uuid | Não | FK composta PaymentMethod | Intenção, não registro de caixa; nulo para crediário sem meio definido |
| Sale.subtotal, discount_amount, surcharge_amount, total | M cada | Sim | Equação RN-004; desconto/acréscimo default zero | Totais calculados no backend; subtotal/total não editáveis independentemente |
| Sale.notes | text | Não | Limite proposto 2.000 | Observação comercial |
| Sale.confirmed_at, cancelled_at | timestamptz cada | Conforme estado | Confirmed exige confirmed_at; cancelada exige cancelled_at | Horários técnicos, sem substituir sold_on |
| Sale.cancellation_reason | text | Ao cancelar | Limite proposto 500 | Justificativa auditável |
| SaleItem.sale_id | uuid | Sim | FK composta Sale | Item pertence à mesma empresa |
| SaleItem.product_id | uuid | Sim | FK composta Product | Referência histórica preservada, sem cascade delete |
| SaleItem.product_code, product_name | varchar(64), varchar(160) | Sim | Snapshot | Preserva o que foi vendido |
| SaleItem.quantity | integer | Sim | > 0 | Quantidade inteira proposta; fracionados em Q-006 |
| SaleItem.unit_price, subtotal | M | Sim | subtotal = quantity × unit_price | Valor vendido, não preço atual |
| SaleItem.unit_cost | M | Não | ≥ 0 | Snapshot se conhecido; margem não prometida |
| PaymentMethod.code | varchar(32) | Sim | Único (tenant_id,code) | PIX/CASH/BANK_TRANSFER/CARD; CARD depende de Q-008; não incluir STORE_CREDIT como meio de recebimento |
| PaymentMethod.name | varchar(80) | Sim | — | Nome apresentado |
| PaymentMethod.active | boolean | Sim | — | Não remover método usado no histórico |
| FinancialCategory.name | varchar(100) | Sim | Único (tenant_id,kind,name), normalizado | Classificação financeira |
| FinancialCategory.kind | varchar(16) | Sim | INCOME/EXPENSE | Sentido operacional; reversão conserva a categoria original |
| FinancialCategory.active | boolean | Sim | — | Inativação preserva dados |

Produto não ganha saldo de estoque editável nesta fase. Categoria de produto é evolução de catálogo, distinta de FinancialCategory. Dados agregados de cliente/venda são calculados e não estão armazenados nesses cadastros.

## Obrigações e liquidação

| Entidade / campo | Tipo | Obrigatório | Unicidade / relacionamento | Descrição |
| --- | --- | --- | --- | --- |
| Receivable.sale_id | uuid | Sim | Único (tenant_id,sale_id), FK composta Sale | Um título por venda confirmada no recorte |
| Receivable.category_id | uuid | Sim | FK composta FinancialCategory INCOME | Classificação da receita |
| Receivable.original_amount | M | Sim | > 0; igual Sale.total | Previsão original preservada |
| Receivable.status | varchar(20) | Sim | ACTIVE/CANCELLED | Cancelamento bloqueia cobrança |
| Receivable.cancelled_at | timestamptz | Ao cancelar | — | Mesmo comando de cancelamento de venda |
| ReceivableInstallment.receivable_id | uuid | Sim | FK composta Receivable | Título de origem |
| ReceivableInstallment.sequence | integer | Sim | Único (tenant_id,receivable_id,sequence), > 0 | Ordem de parcelamento |
| ReceivableInstallment.due_on | date | Sim | Índice tenant/data | Vencimento original; renegociação fora do MVP |
| ReceivableInstallment.original_amount | M | Sim | > 0; soma = Receivable.original_amount | Valor previsto; saldo e atraso são derivados |
| ReceivablePayment.installment_id | uuid | Sim | FK composta ReceivableInstallment | Uma parcela por baixa |
| Payable.category_id | uuid | Sim | FK composta FinancialCategory EXPENSE | Categoria da despesa |
| Payable.supplier_name | varchar(160) | Não | — | Snapshot textual; sem entidade Supplier inicial |
| Payable.description | varchar(200) | Sim | — | Despesa prevista |
| Payable.due_on | date | Sim | Índice tenant/data | Um vencimento por título |
| Payable.original_amount | M | Sim | > 0 | Valor previsto, não valor já pago |
| Payable.status | varchar(20) | Sim | ACTIVE/CANCELLED | Ciclo da obrigação |
| Payable.cancelled_at, cancellation_reason | timestamptz, text | Ao cancelar | Cancelar sem pagamentos na proposta inicial | Não apagar título; caso com pagamento exige política específica |
| PayablePayment.payable_id | uuid | Sim | FK composta Payable | Pagamento direto no título |
| Ambos os pagamentos: payment_method_id | uuid | Sim | FK composta PaymentMethod ativo | Meio efetivo |
| Ambos os pagamentos: cash_account_id | uuid | Sim | FK composta CashAccount ativa | Destino de recebimento ou origem de pagamento |
| Ambos os pagamentos: paid_on | date | Sim | ≤ hoje do tenant | Data de realização, não vencimento |
| Ambos os pagamentos: principal_amount | M | Sim | > 0 e ≤ saldo travado | Principal liquidado |
| Ambos os pagamentos: amount | M | Sim | > 0; principal − desconto + acréscimo | Valor bruto realizado |
| Ambos os pagamentos: discount_amount, surcharge_amount | M cada | Sim | ≥ 0, defaults zero; desconto ≤ principal | Ajuste manual pendente Q-007 |
| ReceivablePayment.fee_amount | M | Sim | 0 ≤ fee < amount; default zero | Taxa realizada, habilitação em Q-008 |
| Ambos os pagamentos: external_reference | varchar(120) | Não | Única por tenant e tipo de baixa quando informada | Identificador de comprovante externo, se houver; não inventar integração |
| Ambos os pagamentos: notes | text | Não | Limite proposto 2.000 | Observação da baixa |
| PaymentReversal.receivable_payment_id | uuid | Exatamente uma das duas FKs | FK composta; único quando informado | Baixa de recebimento original |
| PaymentReversal.payable_payment_id | uuid | Exatamente uma das duas FKs | FK composta; único quando informado | Baixa de pagamento original |
| PaymentReversal.kind | varchar(20) | Sim | CORRECTION/REFUND | REFUND apenas de recebimento de venda cancelada no recorte |
| PaymentReversal.reversed_on | date | Sim | ≥ paid_on original e ≤ hoje | Data efetiva da compensação |
| PaymentReversal.refund_fee | boolean | Sim | CORRECTION de recebimento inverte taxa; REFUND conforme devolução real | Falso para PayablePayment, que não tem taxa neste modelo |
| PaymentReversal.reason | text | Sim | Limite proposto 500 | Motivo da reversão integral |

Não armazenar saldo pendente, overdue, settlement_status ou refund_status como campos livremente editáveis. São projeções dos títulos/pagamentos/reversões, com semântica de data declarada. Campos de pagamentos são imutáveis; uma reversão não sobrescreve o registro original.

## Caixa, idempotência e auditoria

| Entidade / campo | Tipo | Obrigatório | Unicidade / relacionamento | Descrição |
| --- | --- | --- | --- | --- |
| CashAccount.name | varchar(100) | Sim | Único (tenant_id,name), normalizado | Conta financeira local |
| CashAccount.opened_on | date | Sim | — | Data de início do controle; abertura pode ser zero sem movimento |
| CashAccount.active | boolean | Sim | — | Inativar impede novas baixas |
| CashMovement.cash_account_id | uuid | Sim | FK composta CashAccount | Conta movimentada |
| CashMovement.category_id | uuid | Não para OPENING | FK composta FinancialCategory | RECEIPT/PAYOUT/FEE exigem categoria; REVERSAL copia a original |
| CashMovement.kind | varchar(20) | Sim | OPENING/RECEIPT/PAYOUT/FEE/REVERSAL | Papel da linha financeira |
| CashMovement.direction | varchar(3) | Sim | IN/OUT | Montante sempre positivo |
| CashMovement.amount | M | Sim | > 0 | Magnitude; não usar negativo mais direção simultaneamente |
| CashMovement.occurred_on | date | Sim | ≤ hoje, não anterior à abertura | Data efetiva |
| CashMovement.receivable_payment_id | uuid | Em RECEIPT/FEE | FK composta ReceivablePayment | Mesma baixa gera principal e taxa, sem duplicar tipo |
| CashMovement.payable_payment_id | uuid | Em PAYOUT | FK composta PayablePayment | Origem da saída |
| CashMovement.reversal_id | uuid | Em REVERSAL | FK composta PaymentReversal | Origem da reversão |
| CashMovement.reverses_movement_id | uuid | Em REVERSAL | FK composta CashMovement; único quando informado | Mesma conta/montante e direção inversa do original |
| CashMovement.reason | text | Em OPENING | Limite proposto 500 | Justificativa de abertura; outras causas na origem |
| IdempotencyRecord.user_id | uuid | Sim | FK AppUser | Autor da requisição, sujeito a autorização também no replay |
| IdempotencyRecord.operation, key | varchar(200), varchar(128) | Sim | Único (tenant_id,user_id,operation,key) | Operação inclui recurso-alvo; chave opaca estável após timeout |
| IdempotencyRecord.request_hash | char(64) | Sim | SHA-256 canônico | Detecta corpo diferente com a mesma chave; não é credencial |
| IdempotencyRecord.response_status, response | integer, jsonb | Sim no commit | Resultado mínimo, sem credenciais | Permite replay; retenção em Q-013, sem expirar deduplicação curta por padrão |
| IdempotencyRecord.created_at | timestamptz | Sim | — | Commit da operação |
| AuditEvent.actor_user_id | uuid | Quando usuário identificável | FK AppUser | Nulo apenas em evento técnico não autenticado |
| AuditEvent.action, entity_type | varchar(100), varchar(80) | Sim | — | Tipo de operação e agregado |
| AuditEvent.entity_id | uuid | Se houver recurso criado | Identificador lógico | Referência técnica polimórfica, não usada para integridade de negócio |
| AuditEvent.occurred_at | timestamptz | Sim | Índice tenant/data | Instante técnico |
| AuditEvent.reason, correlation_id | text, varchar(128) | Conforme ação / Sim para correlação | — | Motivo e rastreio sem expor tokens/CPF |
| AuditEvent.changes | jsonb | Não | Allowlist/redação | Mudança relevante sem copiar indiscriminadamente dados pessoais |

## Constraints e índices indispensáveis

| ID | Camada | Garantia proposta |
| --- | --- | --- |
| DB-01 | Banco | PK UUID e NOT NULL tenant_id em todo negócio; UNIQUE(tenant_id,id) como alvo de FKs compostas. Toda referência de negócio usa o par, inclusive defaults, categoria, contas e reversões. |
| DB-02 | Banco | Uniques por tenant para membership/user, código de produto, método, número de venda, recebível/venda, sequência de parcela; CPF opcional somente se Q-003 aprovar. Nenhuma unicidade global de telefone/documento de cliente. |
| DB-03 | Banco | CHECKs locais: dinheiro positivo/não negativo, enums, quantidade, equação do total e da baixa, escala/precisão; EXATAMENTE uma FK de origem em PaymentReversal. |
| DB-04 | Banco | Unicidade parcial por baixa/papel em CashMovement; um RECEIPT e no máximo uma FEE por ReceivablePayment; um PAYOUT por PayablePayment; reverses_movement_id único; no máximo uma OPENING por conta. |
| DB-05 | Banco | CHECK por kind: OPENING sem fontes; RECEIPT/FEE só receivable_payment_id; PAYOUT só payable_payment_id; REVERSAL só reversal_id e reverses_movement_id. Direção de principal/taxa controlada. |
| DB-06 | Transação | Soma de parcelas = título = total da venda; pelo menos um item e uma parcela; montante do movimento = baixa; categoria do tipo correto; saldo não negativo; mesma conta e inversão exata em reversões. CHECKs não garantem essas condições entre linhas. |
| DB-07 | Transação + índices únicos | Locks de pai/parcela/pagamento, version e chave idempotente; duas baixas simultâneas não podem ultrapassar o principal. FK por UUID não substitui autorização. |
| DB-08 | Banco e acesso | Sem cascade delete em financeiro/cadastros referenciados; perfil de aplicação sem rotas de exclusão física; auditoria e movimentos append-only por API/permissões apropriadas. Usuário superpoderoso de manutenção continua sendo risco operacional. |
| IX-01 | Banco | Índices (tenant_id,sold_on,id), (tenant_id,customer_id,sold_on,id) em Sale; (tenant_id,receivable_id,sequence) e (tenant_id,due_on,id) em parcelas. |
| IX-02 | Banco | Pagamentos por (tenant_id,installment_id,paid_on,id) ou (tenant_id,payable_id,paid_on,id); pagáveis por (tenant_id,due_on,id) e categoria. |
| IX-03 | Banco | Movimentos por (tenant_id,cash_account_id,occurred_on,id); auditoria por (tenant_id,occurred_at,id); membership por (user_id,status,tenant_id). |
| IX-04 | Banco | Indexar lados filhos das FKs e buscas normalizadas por tenant; busca textual contém pode exigir estratégia própria após medir, sem adicionar extensão antecipadamente. |

Não indexar “vencido hoje” como valor temporal persistente nem confiar em CHECK com data corrente para manter estados diários. Validar datas relativas no comando e calcular atraso na consulta.

Referências técnicas: [constraints PostgreSQL 17](https://www.postgresql.org/docs/17/ddl-constraints.html) e [limites de RLS](https://www.postgresql.org/docs/17/ddl-rowsecurity.html). Os nomes/tipos aqui são contrato de discussão; migrações serão elaboradas somente após aprovação e testes PostgreSQL reais.
