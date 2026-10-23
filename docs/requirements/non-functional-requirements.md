# Requisitos não funcionais

E = obrigatório no pedido; P = proposta de critério para aprovação. Todos são classificados segundo o [MVP](mvp-scope.md); não representam verificações já implementadas.

| ID | Requisito e origem | Classificação | Aceitação verificável proposta |
| --- | --- | --- | --- |
| RNF-001 | Isolamento de tenant no servidor e no banco (E) | MVP essencial | Matriz A/B/C de [isolamento](../architecture/multi-tenancy.md) passa em PostgreSQL 17, incluindo FK cruzada e consultas agregadas. |
| RNF-002 | Autorização por membership/ação, negativa por padrão (E/P) | MVP essencial | Anônimo 401; papel insuficiente 403; UUID de outro tenant 404 sem revelar existência; mesma regra em UI/API. |
| RNF-003 | Dinheiro decimal exato (E) | MVP essencial | Java BigDecimal, PostgreSQL NUMERIC e JSON decimal como string; 100/3 conserva centavos; nenhuma soma financeira usa float/double/Number JS como fonte autoritativa. |
| RNF-004 | Atomicidade de previsão, baixa e caixa (E) | MVP essencial | Falha injetada entre cada gravação desfaz tudo; não existe pagamento confirmado sem seus movimentos correspondentes. |
| RNF-005 | Concorrência e idempotência financeira (E/P) | MVP essencial | Duas baixas concorrentes não excedem saldo; mesma chave/corpo gera um pagamento; chave/corpo diferente gera 409. |
| RNF-006 | Auditoria e histórico (E/P) | MVP essencial | Registrar tenant, ator, operação, horário, entidade e motivo de cancelamento/estorno; nenhum registro financeiro é apagado em edição comum. |
| RNF-007 | Minimização de dados e proteção de segredos (P; O T-18) | MVP essencial | Nenhum segredo/documento completo em log; acesso a dados pessoais por permissão; máscara na resposta quando aplicável; política de retenção em Q-013. Não presume conformidade jurídica pronta. |
| RNF-008 | Validação e erros consistentes (P) | MVP essencial | Erros Problem Details com código estável e campos inválidos, sem stack trace; total enviado pelo navegador não é confiável. |
| RNF-009 | Datas e fuso consistentes por tenant (P; O T-11) | MVP essencial | Horários técnicos em timestamptz/UTC; datas comerciais em date; teste de meia-noite e último dia do mês no fuso configurado. |
| RNF-010 | Acessibilidade e responsividade (P; O mobile) | MVP essencial | Operar formulários por teclado, foco em modal, rótulos associados, erro anunciado e estado não distinguido só por cor; validar 390px sem perda das ações principais. |
| RNF-011 | Consultas limitadas e estáveis (P) | MVP essencial | Paginação com limite máximo 100 e desempate por UUID; todos os índices começam com tenant onde pertinente; sem listagens de tamanho ilimitado. |
| RNF-012 | Testabilidade e regressão (E/P) | MVP essencial | A–G, arredondamento e concorrência viram testes de integração PostgreSQL antes das funcionalidades financeiras; H2 isoladamente não comprova isolamento. CI existente preservado. |
| RNF-013 | Modularidade e simplicidade operacional (E/P) | MVP essencial | Um deploy lógico Spring Boot; DTOs próprios, sem dependência de entidade JPA entre módulos; sem mensageria/microsserviços. |
| RNF-014 | Backup e restauração antes de dados reais (P) | MVP essencial | Ensaiar restauração com dados de duas empresas e conferir saldos e isolamento; frequência/RPO/RTO precisam de Q-014 antes do piloto. Nenhuma infraestrutura criada nesta fase. |
| RNF-015 | Metas numéricas de desempenho/disponibilidade (P) | Pendente de decisão | Medir carga e volume do piloto e aprovar p95, concorrência e disponibilidade em Q-014; não prometer SLA sem medição. |
| RNF-016 | RLS como camada adicional (E exige avaliação) | Pendente de decisão | Prova de conceito testa papéis reais, ausência de contexto, pool e custo; promoção condicionada ao ADR-007. |

Os critérios acima ampliam a base de testes futura; não autorizam alterar workflows, dependências ou autenticação nesta entrega documental.
