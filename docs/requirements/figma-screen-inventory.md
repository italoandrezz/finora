# Inventário visual do protótipo

## Material e confirmação de acesso

- Original: `C:\Users\TwoLi\Downloads\Projeto Sistema Financeiro.zip`.
- SHA-256 do ZIP: `22D0831FE90E92067D3318BE061B074CA4F13B4DA04E2B8927DBBBA6F1808833`.
- Cópia extraída para inspeção: `C:\Users\TwoLi\AppData\Local\Temp\finora-prototipo-d8dae6614c3e491cbe5e014e146c174b`.
- **23 arquivos PNG, todos abertos individualmente e legíveis. Nenhuma falha de abertura.** A imagem mobile de nova venda foi exibida com redução proporcional, mantendo legíveis seus campos.
- A lista abaixo registra todos os nomes originais. Nenhuma imagem foi inferida como existente apenas a partir de um botão. O ZIP contém imagens estáticas, não o arquivo editável nem conexões interativas do Figma.
- Os PNGs não foram adicionados ao Git; permanecem no material original do usuário. Os nomes e o hash permitem conferir a origem deste inventário.

## Convenções comuns observadas

O desktop usa menu lateral, seletor de empresa, busca global, sino, identificação de usuário e área central com cards/tabelas. O mobile usa cabeçalho compacto e navegação inferior Início/Vendas/Caixa/Mais. Há destaques roxos, verde para recebido, vermelho para atraso e âmbar para pendência. A busca global e o destino de ajuda não têm fluxo demonstrado.

Cada ficha cobre objetivo, elementos/informações, campos, tabelas, filtros, ações/navegação, estados e regras/dependências. **O** descreve o que foi visto. **P** registra interpretações. Salvo indicação específica, não foram fornecidos estados de carregamento, erro, vazio, exclusão, falta de permissão ou confirmação de abandono; não se presume seu comportamento.

## T-01 — Dashboard

Arquivo: `Dashboard.png` — visualizado.

- **Objetivo (O):** visão financeira da empresa selecionada no período.
- **Elementos/informações (O):** faturamento R$ 4.800; recebimentos R$ 3.900; despesas pagas R$ 2.600; saldo R$ 6.300; resultado R$ 1.300; gráfico realizado; contas a receber R$ 2.200; vencidos R$ 300 e próximos pagamentos.
- **Campos (O):** seletor de período; nenhum formulário de escrita.
- **Tabela (O):** últimas vendas com venda/data, cliente, pagamento, valor e status.
- **Filtros/pesquisa (O):** período e busca global do shell.
- **Ações/navegação (O):** Nova venda, Ver todas as vendas, atalhos de contas e navegação lateral.
- **Estados (O):** exemplo preenchido; não mostra erro/vazio nem interação dos atalhos.
- **Regras/dependências (O/P):** nota distingue faturamento e recebimentos de vendas antigas. Depende de vendas, recebíveis, pagamentos, caixa e empresa; métricas precisam compartilhar critérios (RN-001, RN-013).

## T-02 — Vendas

Arquivo: `Vendas.png` — visualizado.

- **Objetivo (O):** listar vendas e sua posição de recebimento.
- **Elementos/informações (O):** 8 vendas; faturamento R$ 4.800, recebido dessas vendas R$ 3.300, a receber R$ 1.500, ticket R$ 600.
- **Campos (O):** campo de busca; controles de período, pagamento e filtros.
- **Tabela (O):** venda, cliente/itens, data, pagamento, valor total, status e reticências sem menu aberto.
- **Filtros (O):** Todas/Recebidas/Parciais/A receber; busca por cliente ou número; pagamento e Filtros.
- **Ações/navegação (O):** Nova venda, Exportar, paginação e menu de linha cujo conteúdo não foi mostrado.
- **Estados (O):** preenchido; rodapé “8 de 8”; nenhum erro/vazio.
- **Regras/dependências (O/P):** nota diz que parcelas só entram no caixa quando recebidas. “Recebida/Parcial” é situação financeira, não ciclo comercial da venda. Depende de itens, clientes e recebimentos.

## T-03 — Nova venda desktop

Arquivo: `Nova venda.png` — visualizado.

- **Objetivo (O):** montar e confirmar uma venda individual.
- **Elementos/informações (O):** rascunho #1049; subtotal R$ 480, desconto R$ 20, acréscimos R$ 0 e total R$ 460; agenda 2 × R$ 230.
- **Campos (O):** cliente obrigatório, data obrigatória, pesquisa de produto, desconto, observação, forma Pix/Dinheiro/Cartão/Crediário, número de parcelas e primeiro vencimento.
- **Tabela (O):** produto com código/descrição, quantidade, unitário e subtotal.
- **Filtros (O):** pesquisa de produtos; nenhum filtro de listagem.
- **Ações/navegação (O):** breadcrumb Vendas, Concluir venda e Cancelar. Alteração de quantidade só está explícita no mobile T-23.
- **Estados (O):** rascunho; nota informa que não compõe faturamento/caixa. Não demonstra persistência automática ou confirmação de saída.
- **Regras/dependências (O/P):** crédito de loja difere de cartão; resumo prevê caixa zero sem recebimento. Depende de clientes, catálogo e planejamento de parcelas; parcelas de cartão versus repasse precisam de Q-008.

## T-04 — Clientes

Arquivo: `Clientes.png` — visualizado.

- **Objetivo (O):** localizar clientes e pendências.
- **Elementos/informações (O):** 10 clientes, 4 com saldo, R$ 2.200 a receber e R$ 300 em atraso.
- **Campos (O):** busca e seletores, sem formulário de cadastro aberto.
- **Tabela (O):** cliente/e-mail, telefone, compras, total comprado, saldo pendente e situação.
- **Filtros (O):** Todas/Com pendências/Em atraso; nome, CPF ou telefone; seletor “Todas as clientes” e Filtros sem opções demonstradas.
- **Ações/navegação (O):** Cadastrar cliente, paginação 1 de 2; abertura do detalhe sugerida pela existência de T-05 (P).
- **Estados (O):** em dia, a vencer e em atraso; nenhum erro/vazio.
- **Regras/dependências (P):** situação deve ser derivada de parcelas e data de referência, não campo editável. Depende de clientes, vendas e recebíveis.

## T-05 — Detalhe da cliente

Arquivo: `Cliente · Ana Souza.png` — visualizado.

- **Objetivo (O):** histórico e pendências de uma cliente.
- **Elementos/informações (O):** dados pessoais, CPF mascarado, contato/localidade, observação, cliente desde, última compra, total R$ 1.080, recebido R$ 180, pendente R$ 900, vencido R$ 180.
- **Campos (O):** nenhum campo editável na imagem.
- **Tabelas (O):** compras: venda/data/total/recebido/status; parcelas: venda e sequência/vencimento/valor/situação.
- **Filtros (O):** abas Visão geral, Compras e Parcelas; não há opções de pesquisa abertas.
- **Ações/navegação (O):** Editar cadastro, Nova venda e breadcrumb Clientes.
- **Estados (O):** aviso de atraso de 7 dias; parcela recebida com data, vencida e a vencer. As demais abas não foram abertas.
- **Regras/dependências (P):** preservar histórico e mascaramento; informação de atraso depende da data do protótipo, 22/10, não da data atual. Depende de recebíveis e vendas.

## T-06 — Produtos

Arquivo: `Produtos.png` — visualizado.

- **Objetivo (O):** catálogo com indicadores de estoque.
- **Elementos/informações (O):** 8 produtos, 95 unidades, custo R$ 5.572, um produto com estoque baixo, sete ativos e um inativo.
- **Campos (O):** busca e seletores; cadastro/importação não estão abertos.
- **Tabela (O):** produto/código, categoria, preço de venda, custo unitário, estoque e status. As três marcas à direita não têm rótulos legíveis: **não é possível afirmar quais ações representam**.
- **Filtros (O):** Todos/Ativos/Estoque baixo/Inativos, nome ou código, categoria, Filtros e paginação.
- **Ações/navegação (O):** Importar produtos e Cadastrar produto; seus fluxos não vieram no ZIP.
- **Estados (O):** ativo, inativo e estoque baixo; sem erro/vazio.
- **Regras/dependências (O/P):** nota impede contabilizar custo novamente como saída de caixa. Estoque, importação e margem não são automaticamente escopo essencial (Q-006). Catálogo alimenta itens históricos de venda.

## T-07 — Contas a receber

Arquivo: `Contas a receber.png` — visualizado.

- **Objetivo (O):** acompanhar e baixar parcelas.
- **Elementos/informações (O):** em aberto R$ 2.200/11 parcelas, a vencer R$ 1.900, vencidas R$ 300, recebido R$ 3.900, últimos recebimentos.
- **Campos (O):** pesquisa, seletor de vencimentos e Filtros.
- **Tabela (O):** cliente, venda/parcela, vencimento, valor, situação e Registrar recebimento.
- **Filtros (O):** Em aberto/A vencer/Vencidas/Recebidas; busca por cliente/venda/parcela; vencimentos.
- **Ações/navegação (O):** Registrar recebimento global e por linha, Ver recebidas e paginação.
- **Estados (O):** vencida/a vencer/recebida; nenhum erro/vazio. Não mostra como o botão global escolhe uma parcela.
- **Regras/dependências (O/P):** baixar parcela é ação distinta de confirmar venda. A soma das 11 linhas é R$ 2.180, divergindo do card em R$ 20 (Q-012); não copiar o total do desenho para o backend.

## T-08 — Contas a pagar

Arquivo: `Contas a Pagar.png` — visualizado.

- **Objetivo (O):** planejar e realizar pagamentos de despesas.
- **Elementos/informações (O):** R$ 1.200 previstos, zero vencido, R$ 2.600 pagos; aviso compara próximos compromissos com saldo disponível; gastos pagos por categoria.
- **Campos (O):** período, pesquisa e categoria.
- **Tabela (O):** despesa/fornecedor, categoria, vencimento, valor, status e ação.
- **Filtros (O):** Todas/A vencer/Vencidas/Pagas; despesa ou fornecedor; categorias e Filtros.
- **Ações/navegação (O):** Nova despesa, Registrar pagamento, Ver comprovante e paginação; esses formulários não foram fornecidos.
- **Estados (O):** “Tudo em dia” no card de vencidas; contas pagas e previstas. Zero no indicador não comprova tela vazia.
- **Regras/dependências (P):** lançamento previsto não reduz caixa; fornecedor pode começar como nome textual, sem módulo próprio. Depende de categorias, conta e pagamento.

## T-09 — Fluxo de caixa

Arquivo: `Fluxo de Caixa.png` — visualizado.

- **Objetivo (O):** distinguir realizado e projetado.
- **Elementos/informações (O):** inicial R$ 5.000 + entradas R$ 3.900 − saídas R$ 2.600 = atual R$ 6.300; projeção R$ 5.400 com R$ 300 esperados e R$ 1.200 previstos.
- **Campos (O):** período; sem formulário de movimentação.
- **Tabela (O):** período, entradas, saídas, resultado, saldo acumulado e visão.
- **Filtros (O):** período e abas Movimentação por período/Por conta; segunda aba não aberta.
- **Ações/navegação (O):** Exportar fluxo e menu lateral.
- **Estados (O):** gráfico separa barras suaves projetadas; aviso de que os R$ 300 atrasados não são garantidos.
- **Regras/dependências (O/P):** saldo realizado vem de movimentos; projeção inclui apenas saldos pendentes, sem repetir os já pagos. Depende de recebíveis, pagáveis e contas; inclusão de atrasados na projeção é proposta configurável (Q-010).

## T-10 — Relatórios

Arquivo: `Relatórios.png` — visualizado.

- **Objetivo (O):** comparar períodos e reconciliar vendas/caixa.
- **Elementos/informações (O):** cards de faturamento, receitas, despesas e resultado; distribuição de vendas por pagamento; conciliação R$ 3.300 das vendas de outubro + R$ 600 de meses anteriores = R$ 3.900 recebidos.
- **Campos (O):** tipo de relatório, período e comparar com.
- **Tabelas (O):** origem dos recebimentos, valor recebido e tratamento.
- **Filtros (O):** abas Visão financeira/Vendas/Clientes/Produtos/Contas e parcelas; Aplicar filtros.
- **Ações/navegação (O):** Exportar CSV/PDF e menu de gráfico não aberto.
- **Estados (O):** cartão sem vendas informado em texto; sem erro/vazio geral.
- **Regras/dependências (O/P):** crédito é faturamento a prazo, não entrada imediata; relatórios avançados/exportações são evolução, mas a reconciliação básica é essencial. Depende de todos os agregados financeiros.

## T-11 — Configurações da empresa

Arquivo: `Configurações · Empresa.png` — visualizado.

- **Objetivo (O):** manter identificação e preferências da empresa.
- **Elementos/informações (O):** identificação/logo, endereço, data de atualização, saldo de abertura R$ 5.000 em 01/10.
- **Campos (O):** nome fantasia, razão social, CNPJ (marcados obrigatórios), segmento, e-mail, telefone, CEP, logradouro, número/complemento, bairro, cidade, estado, moeda, fuso e conta padrão de recebimento.
- **Tabela (O):** nenhuma.
- **Filtros (O):** nenhum; abas Empresa/Usuários/Permissões/Assinatura.
- **Ações/navegação (O):** Alterar logo e Salvar alterações.
- **Estados (O):** aviso de dados fictícios e preferências por empresa; sem confirmação de salvamento ou erro.
- **Regras/dependências (P):** moeda/fuso afetam todo o domínio; BRL inicial e saldo de abertura auditável são propostas. Obrigatoriedade de CNPJ para pequena loja exige confirmação (Q-002), não imposição automática do desenho.

## T-12 — Usuários

Arquivo: `Configurações · Usuários.png` — visualizado.

- **Objetivo (O):** listar equipe e convidar pessoas.
- **Elementos/informações (O):** três de cinco acessos usados; perfis Administradora/Financeiro/Vendedora e últimos acessos.
- **Campos (O):** e-mail de trabalho e perfil de acesso no convite.
- **Tabela (O):** usuário/e-mail, perfil, último acesso, status e marcas de ações sem rótulos; não inferir ações específicas.
- **Filtros (O):** não há busca; abas de configurações.
- **Ações/navegação (O):** Convidar usuário, Enviar convite e Revisar permissões por perfil.
- **Estados (O):** ativo e convite com validade de sete dias descrita; não há fluxo de aceite ou falha de envio.
- **Regras/dependências (O/P):** texto restringe convites/alterações a administradores. Limite de cinco acessos e prazo de convite são observações comerciais pendentes, não regras aprovadas (Q-005/Q-011). Depende de identidade e vínculos.

## T-13 — Permissões

Arquivo: `Configurações · Permissões.png` — visualizado.

- **Objetivo (O):** visualizar permissões por perfil.
- **Elementos/informações (O):** matriz Administradora/Financeiro/Vendedora com dashboard, vendas/clientes, cancelamento, produtos/estoque, custos/margens, recebíveis, pagáveis, caixa/relatórios, usuários e empresa/assinatura.
- **Campos (O):** não há seletor de edição demonstrado; há marcações e textos.
- **Tabela (O):** recurso/permissão e três perfis.
- **Filtros (O):** nenhum; abas de configurações.
- **Ações/navegação (O):** Salvar permissões.
- **Estados (O):** permitido/sem acesso/oculto e autoria/data de alteração; não mostra erro nem confirmação.
- **Regras/dependências (O/P):** administradora tem acesso total no desenho; alterações de perfil valem para seus usuários. Personalização da matriz é posterior; a fundação pode usar perfis fixos propostos (Q-005). Ocultar controles não substitui autorização da API.

## T-14 — Assinatura

Arquivo: `Configurações · Assinatura.png` — visualizado.

- **Objetivo (O):** administrar plano SaaS.
- **Elementos/informações (O):** Essencial R$ 79/mês, teste até 31/10, cinco usuários, cartão mascarado, primeira cobrança em novembro.
- **Campos (O):** nenhum dado de cartão editável demonstrado.
- **Tabela (O):** histórico de cobrança, sem faturas existentes, cobrança agendada em novembro.
- **Filtros (O):** nenhum; abas de configurações.
- **Ações/navegação (O):** Gerenciar plano, Cancelar assinatura e Atualizar cartão.
- **Estados (O):** período de teste, ausência de faturas e cobrança agendada; cancelamento não mostrado.
- **Regras/dependências (P):** preços, planos, limites e gateway são decisões futuras. Sem justificativa para faturamento SaaS no MVP; não misturar cobrança da plataforma com as vendas da loja.

## T-15 — Seletor de empresa

Arquivo: `Seletor de empresa aberto.png` — visualizado.

- **Objetivo (O):** trocar o contexto da loja.
- **Elementos/informações (O):** Aurora Boutique selecionada e Aurora Studio; nota “Dados financeiros separados por empresa”.
- **Campos/tabela/filtros (O):** lista de duas empresas, sem busca ou formulário.
- **Ações/navegação (O):** selecionar empresa e Adicionar empresa; fluxo de adição não fornecido.
- **Estados (O):** marca de selecionada; sem erro, lista vazia ou vínculo revogado.
- **Regras/dependências (E/P):** usuário só pode selecionar empresas autorizadas. Trocar exige limpar caches e ignorar respostas anteriores. Depende de identidade, membership e autorização, não apenas de um ID enviado no header.

## T-16 — Filtro de vendas

Arquivo: `Filtro aberto.png` — visualizado.

- **Objetivo (O):** preparar filtros da listagem de vendas.
- **Elementos/informações (O):** painel flutuante “Filtrar vendas” e indicação de seleção pendente de aplicação.
- **Campos (O):** datas inicial/final, checkboxes Recebidas/Parciais/A receber e forma de pagamento.
- **Tabela (O):** nenhuma.
- **Filtros (O):** esses campos formam o filtro; combinação lógica não explicitada.
- **Ações/navegação (O):** fechar, Limpar e Aplicar filtros.
- **Estados (O):** Parciais e A receber selecionados, Recebidas desmarcada; não mostra resultado aplicado ou intervalo inválido.
- **Regras/dependências (P):** OR entre estados e AND entre dimensões; datas inicial ≤ final; Aplicar confirma seleção (Q-009). Depende da listagem T-02/T-22.

## T-17 — Notificações

Arquivo: `Painel de notificações.png` — visualizado.

- **Objetivo (O):** alertar sobre vencimentos e confirmação de venda.
- **Elementos/informações (O):** três novas: pagamento de R$ 900, duas parcelas vencidas somando R$ 300 e venda #1048 confirmada.
- **Campos/tabela/filtros (O):** lista de notificações com tipo, texto e horário; nenhum campo de formulário ou filtro.
- **Ações/navegação (O):** Marcar todas como lidas; destino ao clicar na mensagem não mostrado.
- **Estados (O):** contador de novas e frase “em dia com as novidades”; não há lista vazia real ou erro.
- **Regras/dependências (P):** mensagens precisam ser limitadas ao tenant/usuário; notificação não dispara lançamento financeiro. Central completa é posterior; pendências básicas ficam no dashboard.

## T-18 — Cadastro de cliente

Arquivo: `Modal · Cadastro de cliente.png` — visualizado.

- **Objetivo (O):** cadastrar cliente sem sair do contexto.
- **Elementos/informações (O):** formulário preenchido, indicação de campos obrigatórios e texto de privacidade.
- **Campos (O):** nome completo e telefone obrigatórios; CPF mascarado, e-mail, cidade, estado e observações.
- **Tabela/filtros (O):** nenhum.
- **Ações/navegação (O):** fechar, Cancelar e Cadastrar cliente; retorno exato não mostrado.
- **Estados (O):** preenchido; validações, duplicidade e confirmação de cadastro não fornecidas.
- **Regras/dependências (P):** máscara não prova formato de armazenamento; obrigatoriedade de telefone/CPF deve ser confirmada (Q-003). Depende do cadastro de clientes e tenant.

## T-19 — Registrar recebimento

Arquivo: `Modal · Registrar recebimento.png` — visualizado.

- **Objetivo (O):** dar baixa em uma parcela identificada.
- **Elementos/informações (O):** Ana Souza, venda #1030, parcela 2/3 vencida, saldo R$ 180 e vencimento original 15/10.
- **Campos (O):** valor recebido, data do recebimento, forma de pagamento e conta de destino obrigatórios; observação opcional.
- **Tabela/filtros (O):** nenhum.
- **Ações/navegação (O):** fechar, Cancelar e Confirmar recebimento.
- **Estados (O):** simulação de quitação integral por Pix em 22/10; não mostra pagamento parcial, estorno ou erro.
- **Regras/dependências (O/P):** nota prevê +R$ 180 no caixa sem mudar faturamento. Pagamento parcial vem do pedido E, não desta imagem. Depende da parcela, conta e método; confirmação exige idempotência.

## T-20 — Recebimento confirmado

Arquivo: `Recebimento registrado.png` — visualizado.

- **Objetivo (O):** confirmar resultado financeiro da baixa.
- **Elementos/informações (O):** R$ 180 via Pix; saldo 6.300 → 6.480; a receber 2.200 → 2.020; vencido 300 → 120; receitas 3.900 → 4.080; faturamento permanece 4.800.
- **Campos/tabela/filtros (O):** nenhuma entrada; quadro comparativo antes/depois.
- **Ações/navegação (O):** fechar e Concluído; destino de retorno não demonstrado.
- **Estados (O):** sucesso e parcela liquidada integralmente; nenhuma falha.
- **Regras/dependências (O/P):** exibir dados confirmados pelo servidor, não apenas soma otimista no navegador. A divergência prévia de R$ 20 persiste nos valores do exemplo. Depende de commit transacional e atualização dos resumos.

## T-21 — Dashboard mobile

Arquivo: `Dashboard · Mobile.png` — visualizado.

- **Objetivo (O):** mesma visão financeira com hierarquia mobile.
- **Elementos/informações (O):** saldo destacado, faturamento, receitas, despesas, gráfico, pendências e últimas vendas em cards.
- **Campos (O):** período exibido como texto, não é demonstrado um seletor.
- **Tabela (O):** últimas vendas substituídas por cards com cliente, valor, venda/data e estado.
- **Filtros (O):** nenhum aberto; não assumir que o texto do período é clicável.
- **Ações/navegação (O):** Nova venda, Ver todas, seletor de empresa, sino e abas inferiores.
- **Estados (O):** preenchido; sem erro/vazio.
- **Regras/dependências (P):** mesmos critérios de T-01, evitando uma API financeira paralela por dispositivo. Destino “Mais” não veio no ZIP.

## T-22 — Vendas mobile

Arquivo: `Vendas · Mobile.png` — visualizado.

- **Objetivo (O):** consultar e iniciar vendas em tela estreita.
- **Elementos/informações (O):** faturamento, recebido e saldo pendente dessas vendas; oito cards.
- **Campos (O):** pesquisa por cliente ou número.
- **Tabela (O):** cards com venda/data, cliente, valor, método/parcelas/itens e estado.
- **Filtros (O):** Todas/Recebidas/Em aberto; botão Filtros. “Em aberto” agrega Parciais e A receber do desktop (P a confirmar).
- **Ações/navegação (O):** Nova venda e navegação inferior.
- **Estados (O):** todas as oito exibidas, sem botão de paginação; estratégia para mais registros não observada.
- **Regras/dependências (P):** preservar filtros e saldos do desktop; paginação futura deve ser explícita (Q-009). Depende da mesma consulta de vendas.

## T-23 — Nova venda mobile

Arquivo: `Nova venda · Mobile.png` — visualizado.

- **Objetivo (O):** montar venda em sequência vertical.
- **Elementos/informações (O):** rascunho, cliente, itens, pagamento, resumo e agenda 2 × R$ 230; caixa zero antes de confirmar/receber.
- **Campos (O):** cliente/data, pesquisa de produto, quantidades com −/+, desconto, observação, método, parcelamento e primeiro vencimento.
- **Tabela (O):** cards por item com código, quantidade, preço e subtotal.
- **Filtros (O):** busca de produto; nenhum filtro de listagem.
- **Ações/navegação (O):** remover item por lixeira, voltar, Concluir venda com total, Cancelar e abas inferiores.
- **Estados (O):** rascunho; sem validação de quantidade zero, perda de alterações ou erro de rede demonstrados.
- **Regras/dependências (P):** mesma transação de T-03; distinguir Cancelar edição de cancelar venda confirmada. Depende de clientes, catálogo e parcelas.

## Lacunas e sugestões

**Não fornecidos:** login/recuperação de acesso; vazio/erro/carregamento gerais; cadastro de produto; nova despesa; pagamento de despesa; detalhe de venda; estorno; cancelamento; aceite de convite; conteúdo dos menus de linha; versões mobile dos demais módulos. São lacunas de especificação visual, não arquivos cuja existência possa ser confirmada.

**S:** adicionar estados de conflito/duplicidade de pagamento, ausência de resultados, bloqueio por permissão e troca de tenant durante requisição; nomes acessíveis dos botões de ícone; aviso de alterações não salvas. Confirmar em [questões abertas](open-questions.md) antes de transformar em regra aprovada.
