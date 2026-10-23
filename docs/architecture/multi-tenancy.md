# Multi-tenancy no Finora

## Diretriz e fronteira

**E:** PostgreSQL 17 compartilhado, schema compartilhado e isolamento lógico por tenant. Usuário global AppUser pode participar de várias empresas via TenantMembership; cada membership ativo tem seu próprio papel. O tenant é determinado por contexto autenticado e validado, não por confiar em ID fornecido pelo cliente. Nenhum mecanismo foi implementado nesta fase.

**P:** usar `X-Tenant-Id` por requisição de negócio. O seletor visual escolhe um ID da lista autorizada, mas o servidor revalida usuário ativo, tenant ativo, membership e permissão em toda requisição. O header é um seletor não confiável; não autoriza por si. Rotas globais `/me` e `/me/tenants` só precisam de identidade e não aceitam IDs arbitrários para listar empresas alheias.

TenantContext imutável dura uma requisição/transação. Não usar tenant global em singleton, variável estática ou seleção mutável compartilhada entre abas. Corpos de DTO de negócio não recebem tenant_id; o serviço o atribui do contexto validado. Tarefas futuras precisarão carregar contexto explicitamente, sem fallback para “primeira empresa”.

## Camadas de proteção propostas

1. Filtro/autorização valida identidade e membership; contexto ausente ou inválido falha fechado.
2. Serviços verificam permissão e escopo do agregado; não retornam custos/documentos completos sem autorização de campo.
3. Repositórios e consultas recebem tenant obrigatoriamente; nomes como findByTenantIdAndId tornam o escopo explícito. Inclui count, exist, joins, relatórios, exportações, buscas e gravações em lote.
4. Toda tabela de negócio tem tenant_id NOT NULL e UNIQUE(tenant_id,id). Toda FK para outro negócio usa tenant_id + id; não basta UUID global. Isso inclui item/produto, pagamento/parcela/conta, categoria, reversão e defaults de settings.
5. Índices de busca/ordenação começam por tenant onde aplicável; unicidades de catálogo e documentos são locais, não globais. AppUser é exceção de identidade global.
6. Auditoria registra tenant e ator. Caches e idempotência são particionados por contexto; logs não contêm credenciais/CPF completo.

Uma associação cruzada entre tenants deve falhar também numa gravação direta no PostgreSQL de teste. Autorização na aplicação, isolamento de consultas e integridade de FKs têm responsabilidades diferentes; nenhuma substitui as demais.

## Papéis fixos propostos, não matriz aprovada

| Capacidade | ADMIN | FINANCE | SALES |
| --- | --- | --- | --- |
| Dados básicos de clientes; criar/editar cliente | Sim | Consultar | Sim |
| Produtos | Gerenciar | Consultar com custo | Consultar sem custo |
| Vendas | Criar/consultar/cancelar | Consultar | Criar/consultar; sem cancelar |
| Listagem financeira de recebíveis; registrar baixas | Sim | Sim | Não; situação da venda apenas dentro do detalhe comercial permitido |
| Despesas e pagamentos | Sim | Sim | Não |
| Dashboard/caixa financeiro | Sim | Consultar | Não |
| Reverter baixa, definir abertura inicial | Sim | Não | Não |
| Empresa, memberships e papéis | Sim | Não | Não |

Um único desenvolvedor não elimina perfis do produto: são perfis dos usuários das lojas, não aprovações de PR. A matriz traduz T-13 com simplificações propostas e depende de Q-005. Administrador de uma loja não é administrador de outra nem superusuário da plataforma. Impedir a revogação/rebaixamento do último ADMIN ativo; provisionamento controlado deve permitir recuperação sem bypass silencioso.

## RLS: defesa adicional a avaliar

O [PostgreSQL 17](https://www.postgresql.org/docs/17/ddl-rowsecurity.html) permite políticas por linha. A proposta futura usa identidade de conexão de aplicação sem BYPASSRLS/superuser e sem ser dona das tabelas; a identidade de migrations fica separada. Owners normalmente contornam RLS e podem exigir FORCE ROW LEVEL SECURITY; regras de integridade referencial também não são filtradas por RLS. Por isso não é substituto para FKs compostas e autorização.

Em prova de conceito, o tenant de cada transação seria configurado por contexto validado e com escopo local à transação. Não deixar configuração de conexão persistir no pool após commit/rollback; contexto ausente nega acesso. Avaliar políticas de leitura e escrita, joins, funções, manutenção, backups, plano de execução e performance. Contexto de sessão do banco, sozinho, não autentica o usuário da loja.

**Decisão pendente:** ADR-007. Antes do piloto multiempresa, decidir se o benefício compensa a complexidade operacional e comprovar testes com os papéis reais. Se não adotado inicialmente, consultas explicitamente filtradas e FKs continuam obrigatórias. Não declarar que o banco atual já possui políticas RLS.

## Riscos e mitigação verificável

| Risco | Mitigação proposta |
| --- | --- |
| UUID adivinhado ou copiado de outra loja | Busca pelo par tenant/id; 404 genérico; sem vazamento em mensagens |
| Join/query nativa sem filtro | Revisão de consulta e testes A/B com dados coincidentes, inclusive totais |
| FK válida por UUID, porém de tenant alheio | FK composta e teste de inserção cruzada no PostgreSQL |
| Cache ou requisição em voo de empresa anterior | Chave inclui tenant; abortar/descartar resposta antiga e limpar formulário ao trocar |
| Privilégio de ADMIN vazando entre empresas | Permissão calculada da membership corrente, não papel global em token antigo |
| Vínculo revogado e sessão ainda válida | Revalidar membership em cada ação; se cache futuro, definir invalidação e prazo máximo explícitos |
| Pool reutilizando contexto RLS | Transação com contexto local, teste de alternância A/B na mesma conexão e após exceção |
| Logs/exportações/backups expondo empresas | Redação de campos, acesso operacional restrito e teste de restauração/exportação |

## Estratégia de testes de isolamento futura

Usar PostgreSQL 17 real, migrações futuras e dados de A/B com nomes/códigos/números de venda iguais; usuário U participa de ambas com papéis diferentes e não de C. H2 não comprova constraints/políticas PostgreSQL.

| ID | Teste | Aceitação |
| --- | --- | --- |
| ISO-01 | Listar, contar, buscar, paginar e agregar sob A e B | Nenhum UUID, nome, contador ou soma de outra empresa |
| ISO-02 | Ler/alterar UUID de A com contexto B | 404; nenhuma mutação, auditoria de falha sem expor o objeto |
| ISO-03 | Gravar venda/item/pagamento com FK de A em B diretamente no banco | Violação da FK composta; rollback |
| ISO-04 | Enviar header/corpo de C sem vínculo; omitir contexto | Rejeição sem acesso nem seleção automática |
| ISO-05 | ADMIN em A, SALES em B tenta baixar/estornar em B | 403; A não eleva B |
| ISO-06 | Revogar membership durante sessão ativa | Próxima operação negada; sem janela indefinida por token/cache |
| ISO-07 | Alternar tenant com requisições concorrentes e duas abas | Respostas/formulários/caches nunca cruzam contextos |
| ISO-08 | Reutilizar idempotency-key em tenants diferentes | Operações independentes, cada uma no próprio tenant; nenhum replay alheio |
| ISO-09 | Estorno, relatório, default de conta e categoria cruzados | Mesmo isolamento das operações de criação/leitura |
| ISO-10 | Se RLS aprovado: conexão sem contexto, reutilização do pool e rollback | Falha fechado; usuário da aplicação não contorna política; dono/migration testados separadamente |

Não usar acesso de manutenção como credencial da aplicação para “facilitar” testes. Antes de dar acesso ao piloto, adicionar concorrência financeira, snapshots de permissão e restauração conforme RNF-004–014.
