# Telas e integração futura

Mapeamento proposto, não frontend implementado. Fonte visual: [T-01–23](../requirements/figma-screen-inventory.md); contratos: [API-01–36](../api/rest-contracts.md). Endpoint proposto não significa funcionalidade aprovada/pronta. Cada linha associa dados, filtros e ações; os estados comuns abaixo fazem parte da proposta de UX (S/P).

| Tela | Dados / consultas previstas | Filtros, ordenação e paginação | Ações que alteram dados / limites |
| --- | --- | --- | --- |
| T-01 Dashboard | API-27; atalhos API-09/15/20 | Período comercial/realizado e asOf; séries com intervalo explícito | Nova venda navega para T-03; não escreve no dashboard |
| T-02 Vendas | API-09; cliente/método/counters/summary | soldOn, q, settlementStatus[], método; soldOn desc/id; página 20 | Nova venda API-08; menus de linha não especificados; exportar posterior |
| T-03 Nova venda | API-06/13/28/03; preços atuais, meios e defaults | Busca de cliente/produto limitada e paginada | API-08 confirma; Cancelar edição só descarta formulário local proposto; não chamar API-11 |
| T-04 Clientes | API-06; resumo financeiro só A/F | q nome/CPF/telefone, financeiro para A/F; name asc/id; página 20 | API-05/30; abrir T-05 |
| T-05 Cliente | API-07, API-09 customerId, API-15 customerId e API-17 | Abas com paginação própria; compras por data, parcelas por dueOn | Editar API-30; Nova venda pré-seleciona cliente; recebimento somente se permissão |
| T-06 Produtos | API-13/31; campos de custo filtrados por permissão | q,active; code/name; página 20 | API-12/14; estoque/categoria comercial/importação e ícones ambíguos não ganham operação inventada |
| T-07 Receber | API-15/17/28/24 | dueOn,overdue,estado,q estruturado; dueOn asc/id; página 20 | API-16; botão global precisa selecionar parcela autorizada antes do modal |
| T-08 Pagar | API-20/22/29 | dueOn,categoria,q,estado; dueOn asc/id; página 20 | API-19/21; comprovantes e parcelamento de despesa posteriores |
| T-09 Caixa | API-26/24/27; saldo inicial e realizado | occurredOn,conta; ocorrido asc/id; lista paginada, summary de toda seleção | Nenhuma criação direta de movimento; projeção/CSV posterior |
| T-10 Relatórios | Reuso API-27/09/17/20/22/26 para resumo essencial | Períodos com semântica de venda/recebimento separada; tabelas paginadas | PDF/CSV e comparação avançada posteriores; não somar recebimentos de novo ao faturamento |
| T-11 Empresa | API-03/24/29 | Sem paginação de settings | API-04; abertura em API-25 no fluxo administrativo proposto; logo/endereço completo pendentes |
| T-12 Usuários | API-35 e identidade restrita | status; userName/id; página 20 | API-36 altera vínculo existente; convite por e-mail/limite de plano posteriores |
| T-13 Permissões | Matriz fixa proposta + permissões efetivas da sessão/contexto | Sem editor dinâmico no MVP | Não implementar Salvar matriz como se já aprovado; só alterar roleCode do vínculo por API-36 |
| T-14 Assinatura | Nenhum endpoint essencial | Não se aplica no MVP | Gerenciar/cancelar plano e cartão fora do MVP; não criar gateway ou armazenar cartão |
| T-15 Empresas | API-02 | Apenas empresas com vínculo ativo; sem busca vista | Troca limpa estado local e altera header por requisição; Adicionar empresa depende de provisionamento definido |
| T-16 Filtro | Estado local ligado à API-09 | Data inicial/final; OR entre status, AND entre dimensões; Aplicar reinicia página zero | Aplicar/Limpar são alterações de consulta, não da venda; fechar sem aplicar mantém filtro ativo anterior, proposta Q-009 |
| T-17 Notificações | Sem central essencial; pendências mínimas API-27 | Feed, paginação e marcação não definidos | Marcar lidas posterior; notificação não cria lançamentos |
| T-18 Cadastro cliente | API-05 e erros por campo | Não se aplica | Confirmar usa chave idempotente; ao cancelar não criar; atualizar seleção só após 201 |
| T-19 Baixa | API-15/34 para versão/saldo; API-28/24 para opções | Uma parcela identificada; sem quitação em lote | API-16; bloquear duplo clique, preservar chave após timeout, 409 recarrega saldo |
| T-20 Sucesso baixa | PaymentResult de API-16; revalidar API-27/15/17 | Mesmos filtros da tela de origem | Concluído fecha; não reenviar pagamento; usar números do commit, não totais fixos do desenho |
| T-21 Dashboard mobile | Mesma API-27 de T-01 | Mesma data de referência; período clicável ainda não observado | Mesmas ações permitidas; não alterar fórmula de saldo por dispositivo |
| T-22 Vendas mobile | Mesma API-09 de T-02 | Em aberto = UNPAID/PARTIAL proposto; explicitar próxima página para >20, Q-009 | API-08; não buscar toda base para filtrar no aparelho |
| T-23 Nova venda mobile | Mesmas APIs de T-03 | Busca de produtos paginada; ordenação de itens local | +/−/remover altera formulário; API-08 calcula total final; alerta de descarte é sugestão |

## Estados propostos para todas as telas essenciais

| Situação | Comportamento proposto |
| --- | --- |
| Carregando consulta | Skeleton/indicador; manter contexto e não exibir totais de outra empresa enquanto carrega |
| Nenhum registro | Estado vazio com ação compatível com a permissão, sem chamar ausência de dados de erro |
| Nenhum resultado do filtro | Explicar filtros ativos e permitir limpar; não oferecer criação de duplicata automaticamente |
| 401 | Invalidar identidade de UI e ir para fluxo de acesso a definir em Q-001 |
| 403 | Mensagem de falta de acesso; não esconder somente botão enquanto API continua liberando |
| 404 de recurso contextual | Informar indisponibilidade sem dizer que pertence a outra loja |
| 409 | Recarregar saldo/versão e permitir revisão; chave conflitante não gera nova tentativa silenciosa |
| 422 | Associar erros aos campos e preservar o formulário; não perder notas/parcelamento |
| Timeout após POST | Reconsultar/repetir com mesma chave, pois o commit pode ter ocorrido; não declarar pagamento falhou sem verificar |
| Sucesso | Exibir resultado retornado; invalidar caches de títulos, caixa, vendas e indicadores afetados |
| Troca de empresa | Confirmar descarte de edição, abortar/ignorar requests antigos e particionar caches por tenant; nunca levar IDs selecionados da empresa anterior |

Máscaras/formatadores pt-BR são apresentação: converter decimal textual com cuidado, sem enviar `R$ 1.000,00` como valor de API e sem confiar em arredondamento binário do navegador. Acessibilidade de modal exige foco, retorno ao acionador e nomes de ícones; estados não podem depender exclusivamente de cores.

## Dados e comportamentos ainda não comprovados pelas imagens

Pesquisa global, menus de linha, semântica do seletor “Todas as clientes”, edição da matriz, cartão, estoque e descarte de rascunho continuam pendentes. Contrato API-15 usa filtros estruturados customerId/saleId, não promete uma busca textual universal por número de parcela sem especificação. Onde a imagem apresenta recurso adiado, implementar mensagem/ocultação consistente após aprovação de escopo, sem botão que simule operação real.
