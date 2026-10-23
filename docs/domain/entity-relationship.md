# Modelo entidade-relacionamento proposto

Modelo lógico para revisão, **não schema implementado**. Tipos, nulabilidade, regras e índices estão no [dicionário](data-dictionary.md); sem SQL executável ou migrations. Referência semântica: [RN-001–017](business-rules.md).

Os nomes de domínio em inglês correspondem a tabelas futuras em snake_case. `AppUser` evita usar o nome SQL reservado User; é identidade global. `Role` será inicialmente um código fixo em TenantMembership, não uma tabela/editor de permissões. `PaymentMethod` representa meio realizado; crediário é Sale.payment_terms. `PayableInstallment` foi adiado: o MVP usa um título de despesa por vencimento, com vários pagamentos parciais.

```mermaid
erDiagram
    TENANT ||--o{ TENANT_MEMBERSHIP : autoriza
    APP_USER ||--o{ TENANT_MEMBERSHIP : participa
    TENANT ||--|| TENANT_SETTINGS : configura
    TENANT ||--o{ CUSTOMER : possui
    TENANT ||--o{ PRODUCT : possui
    TENANT ||--o{ PAYMENT_METHOD : define
    TENANT ||--o{ FINANCIAL_CATEGORY : classifica
    TENANT ||--o{ CASH_ACCOUNT : possui
    TENANT ||--o{ SALE : registra
    TENANT ||--o{ SALE_ITEM : isola
    TENANT ||--o{ RECEIVABLE : isola
    TENANT ||--o{ RECEIVABLE_INSTALLMENT : isola
    TENANT ||--o{ RECEIVABLE_PAYMENT : isola
    TENANT ||--o{ PAYABLE : isola
    TENANT ||--o{ PAYABLE_PAYMENT : isola
    TENANT ||--o{ PAYMENT_REVERSAL : isola
    TENANT ||--o{ CASH_MOVEMENT : isola
    TENANT ||--o{ IDEMPOTENCY_RECORD : isola
    TENANT o|--o{ AUDIT_EVENT : contextualiza
    CUSTOMER ||--o{ SALE : compra
    SALE ||--|{ SALE_ITEM : contem
    PRODUCT ||--o{ SALE_ITEM : referencia_historica
    PAYMENT_METHOD o|--o{ SALE : intencao
    SALE ||--o| RECEIVABLE : gera_na_confirmacao
    FINANCIAL_CATEGORY ||--o{ RECEIVABLE : receita
    RECEIVABLE ||--|{ RECEIVABLE_INSTALLMENT : divide
    RECEIVABLE_INSTALLMENT ||--o{ RECEIVABLE_PAYMENT : recebe
    PAYMENT_METHOD ||--o{ RECEIVABLE_PAYMENT : meio
    CASH_ACCOUNT ||--o{ RECEIVABLE_PAYMENT : destino
    FINANCIAL_CATEGORY ||--o{ PAYABLE : despesa
    PAYABLE ||--o{ PAYABLE_PAYMENT : paga
    PAYMENT_METHOD ||--o{ PAYABLE_PAYMENT : meio
    CASH_ACCOUNT ||--o{ PAYABLE_PAYMENT : origem
    RECEIVABLE_PAYMENT o|--o| PAYMENT_REVERSAL : reverte_recebimento
    PAYABLE_PAYMENT o|--o| PAYMENT_REVERSAL : reverte_pagamento
    CASH_ACCOUNT ||--o{ CASH_MOVEMENT : movimenta
    FINANCIAL_CATEGORY o|--o{ CASH_MOVEMENT : categoriza
    RECEIVABLE_PAYMENT o|--o{ CASH_MOVEMENT : principal_e_taxa
    PAYABLE_PAYMENT o|--o{ CASH_MOVEMENT : desembolso
    PAYMENT_REVERSAL o|--|{ CASH_MOVEMENT : compensa
    CASH_MOVEMENT o|--o| CASH_MOVEMENT : movimento_inverso
    APP_USER ||--o{ IDEMPOTENCY_RECORD : solicita
    APP_USER o|--o{ AUDIT_EVENT : executa
    CASH_ACCOUNT o|--o| TENANT_SETTINGS : conta_padrao
    TENANT {
        uuid id PK
        varchar name
        varchar status
    }
    APP_USER {
        uuid id PK
        varchar email UK
        varchar status
    }
    TENANT_MEMBERSHIP {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        varchar role_code
        varchar status
    }
    TENANT_SETTINGS {
        uuid id PK
        uuid tenant_id FK,UK
        char currency
        varchar timezone
        uuid default_cash_account_id FK
        uuid default_income_category_id FK
        uuid fee_category_id FK
    }
    CUSTOMER {
        uuid id PK
        uuid tenant_id FK
        varchar name
        varchar document
        boolean active
    }
    PRODUCT {
        uuid id PK
        uuid tenant_id FK
        varchar code
        varchar name
        decimal sale_price
        decimal unit_cost
        boolean active
    }
    SALE {
        uuid id PK
        uuid tenant_id FK
        uuid customer_id FK
        uuid planned_payment_method_id FK
        bigint number
        date sold_on
        varchar status
        varchar payment_terms
        decimal subtotal
        decimal discount_amount
        decimal surcharge_amount
        decimal total
    }
    SALE_ITEM {
        uuid id PK
        uuid tenant_id FK
        uuid sale_id FK
        uuid product_id FK
        varchar product_name
        varchar product_code
        int quantity
        decimal unit_price
        decimal unit_cost
        decimal subtotal
    }
    PAYMENT_METHOD {
        uuid id PK
        uuid tenant_id FK
        varchar code
        varchar name
        boolean active
    }
    FINANCIAL_CATEGORY {
        uuid id PK
        uuid tenant_id FK
        varchar name
        varchar kind
        boolean active
    }
    CASH_ACCOUNT {
        uuid id PK
        uuid tenant_id FK
        varchar name
        date opened_on
        boolean active
    }
    RECEIVABLE {
        uuid id PK
        uuid tenant_id FK
        uuid sale_id FK
        uuid category_id FK
        decimal original_amount
        varchar status
    }
    RECEIVABLE_INSTALLMENT {
        uuid id PK
        uuid tenant_id FK
        uuid receivable_id FK
        int sequence
        date due_on
        decimal original_amount
    }
    RECEIVABLE_PAYMENT {
        uuid id PK
        uuid tenant_id FK
        uuid installment_id FK
        uuid payment_method_id FK
        uuid cash_account_id FK
        date paid_on
        decimal principal_amount
        decimal amount
        decimal discount_amount
        decimal surcharge_amount
        decimal fee_amount
    }
    PAYABLE {
        uuid id PK
        uuid tenant_id FK
        uuid category_id FK
        varchar supplier_name
        varchar description
        date due_on
        decimal original_amount
        varchar status
    }
    PAYABLE_PAYMENT {
        uuid id PK
        uuid tenant_id FK
        uuid payable_id FK
        uuid payment_method_id FK
        uuid cash_account_id FK
        date paid_on
        decimal principal_amount
        decimal amount
        decimal discount_amount
        decimal surcharge_amount
    }
    PAYMENT_REVERSAL {
        uuid id PK
        uuid tenant_id FK
        uuid receivable_payment_id FK
        uuid payable_payment_id FK
        varchar kind
        date reversed_on
        boolean refund_fee
        text reason
    }
    CASH_MOVEMENT {
        uuid id PK
        uuid tenant_id FK
        uuid cash_account_id FK
        uuid category_id FK
        uuid receivable_payment_id FK
        uuid payable_payment_id FK
        uuid reversal_id FK
        uuid reverses_movement_id FK
        varchar kind
        varchar direction
        date occurred_on
        decimal amount
    }
    IDEMPOTENCY_RECORD {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        varchar operation
        varchar key
        char request_hash
        jsonb response
    }
    AUDIT_EVENT {
        uuid id PK
        uuid tenant_id FK
        uuid actor_user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        timestamptz occurred_at
    }
```

## Leitura e limites do diagrama

- PK UUID em todas as entidades. Nas entidades tenant-scoped, a unicidade adicional `(tenant_id, id)` permite FKs compostas para **toda referência de negócio**, inclusive reverses_movement_id e defaults de settings. Uma FK isolada por UUID não basta para essa segurança.
- Sale → Receivable é opcional no desenho para DRAFT; confirmação exige exatamente um título com soma de parcelas igual ao total. Não se deixa venda CONFIRMED sem título por ser opcional no ER.
- Cada PaymentReversal aponta a **uma e somente uma** baixa; as duas relações opcionais representam uma exclusão mútua, não a permissão de preencher ambas.
- CashMovement usa fontes tipadas exclusivas; uma abertura não tem pagamento, uma taxa compartilha a baixa de recebimento e uma reversão aponta ao PaymentReversal e ao movimento inverso original. O diagrama não substitui as constraints por kind.
- Dados comuns de criação/versionamento foram omitidos do desenho para legibilidade, mas estão no dicionário. AuditEvent é técnico: tenant pode faltar somente em evento global de identidade; finanças e auditoria de negócio sempre carregam tenant.
- Campos de saldo/atraso/quitação/restituição são projeções, não colunas monetárias editáveis. Não há tabela de assinatura, estoque, fornecedor ou autenticação escolhida implicitamente.
