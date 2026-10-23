# Escopo proposto do MVP

## Resultado esperado para uma pequena loja

Cadastrar cliente/produto, registrar venda, planejar parcelas, registrar dinheiro efetivamente recebido, lançar despesas e pagamentos, consultar pendências e saldo. Exemplo central: venda de R$ 600 em três parcelas gera R$ 600 previstos e **zero caixa**; o primeiro recebimento de R$ 200 produz caixa +200 e saldo a receber 400.

Essa prioridade deriva do pedido (E). O detalhamento abaixo é proposta de produto (P), não aprovação tácita das inferências do protótipo. Não há implementação nesta fase.

## Incluído na proposta essencial

- Fundação segura: identidade autenticada, empresa, vínculo muitos-para-muitos, perfis fixos e seleção autorizada de tenant (RF-001–004).
- Clientes com dados mínimos, histórico e arquivamento; catálogo sem controle de estoque obrigatório (RF-005–007).
- Venda individual com vários itens, snapshot do nome/preço/custo conhecido, desconto explícito, confirmação e cancelamento auditável (RF-008–011, RF-019, RF-032).
- Recebível de venda, parcelas, baixa parcial/integral/antecipada/atrasada, histórico e estorno integral de uma baixa (RF-012–014, RF-020).
- Despesa como obrigação de um vencimento, pagamentos parciais/integral e categorias (RF-015–017, RF-023). PayableInstallment não é necessário para esse primeiro recorte.
- Conta financeira mínima, saldo de abertura e movimentos realizados imutáveis; fluxo realizado e indicadores básicos (RF-018/RF-021/RF-022).
- Mesmo contrato para desktop/mobile, confirmação pelo servidor, validação e tratamento de duplicidade (RF-034/RNF-004–005).

## Propostas de simplificação sujeitas a confirmação

| Tema | Proposta inicial | Pendência |
| --- | --- | --- |
| Moeda | Apenas BRL, valores com 2 casas | Q-002 |
| Cliente | Obrigatório na venda para suportar cobrança; nome obrigatório; demais campos minimizados | Q-003 |
| Quantidade | Unidades inteiras positivas no MVP; sem fracionados | Q-006 |
| Recebimento | Pix/dinheiro registrados manualmente e crediário como condição de prazo | Q-008 |
| Cartão | Não habilitar antes de definir diferença entre parcelas do comprador e repasse; modelo prevê liquidação manual/taxa | Q-008 |
| Juros/desconto na baixa | Campos propostos em zero até aprovar política e permissão | Q-007 |
| Contas | Uma conta padrão inicial; modelo suporta outras contas do mesmo tenant, sem transferências no primeiro recorte | Q-010 |
| Usuários | Provisionamento controlado; perfis ADMIN, FINANCE e SALES, sem editor de permissões | Q-001/Q-005 |
| Exclusão | Arquivar cadastros; cancelar/reverter financeiros; sem apagar histórico | Q-013 |

Essas escolhas reduzem risco; se rejeitadas, revisar modelo e aceitação antes da implementação correspondente. Ter fundação multiempresa é obrigatório mesmo que só uma loja use o piloto.

## Fora do primeiro MVP

Integrações de WhatsApp/vendas/bancos, adquirentes e conciliação automática; cobranças recorrentes SaaS; cartão da assinatura; NF-e e contabilidade fiscal; estoque/custo médio sem aprovação; importação em lote; PDF/CSV; relatórios avançados; notificações persistentes; personalização de papéis; renegociação complexa, estorno parcial e pagamentos mistos de uma venda. A exclusão não transforma essas funções observadas em defeitos: são evolução ou questões abertas.

## Sequência de implementação posterior

1. Resolver autenticação, identidade, provisionamento e matriz de acesso; testar isolamento.
2. Cadastros e conta de abertura, sem movimentações geradas por simples cadastro de produto.
3. Venda + título + parcelas, com atomicidade/idempotência.
4. Recebimentos, despesas e pagamentos com caixa e reversões.
5. Indicadores e reconciliação dos cenários A–G, testes de concorrência e restauração antes do piloto.

## Critério de prontidão para implementação

Revisão dos documentos por produto; Q-001–008 resolvidas para o módulo afetado; ER/dicionário/contratos coerentes; critérios essenciais transformáveis em testes; nenhuma regra de dinheiro ou autorização baseada apenas no frontend. Concluir documentação não significa concluir a Fase 2 ou disponibilizar isolamento pronto.
