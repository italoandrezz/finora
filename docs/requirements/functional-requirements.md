# Requisitos funcionais

Proposta rastreável: [legenda de evidências](../README.md), [telas](figma-screen-inventory.md) e [questões](open-questions.md). Essencial indica prioridade no MVP proposto; escolhas P ainda dependem da revisão de produto. Os critérios abaixo serão testes futuros, não testes implementados nesta fase.

| ID | Requisito | Origem | Classificação | Critério de aceitação / limite |
| --- | --- | --- | --- | --- |
| RF-001 | Autenticar usuário e encerrar acesso | E; P sem tela de login | MVP essencial | Sessão válida permite identidade; anônimo recebe 401; encerrar impede reutilização. Mecanismo em Q-001. |
| RF-002 | Listar empresas autorizadas e selecionar contexto | E; O T-15 | MVP essencial | Usuário com lojas A/B pode consultar uma por vez; ID de C sem vínculo é negado. Cenário G. |
| RF-003 | Aplicar vínculo e perfil por empresa | E; O T-12/T-13 | MVP essencial | Mesmo usuário pode ter perfis diferentes; vínculo inativo ou papel insuficiente impede a ação no servidor. |
| RF-004 | Provisionar empresa e seu responsável | E; P | MVP essencial | Provisionamento controlado cria tenant, settings e membership administrador atomicamente; sem cadastro público obrigatório. Convite por e-mail é RF-025. |
| RF-005 | Cadastrar, editar e arquivar cliente | E; O T-04/T-18 | MVP essencial | Nome válido cria UUID no tenant; edição não altera valores de vendas; arquivar preserva histórico e impede novas vendas vinculadas. Telefone obrigatório em Q-003. |
| RF-006 | Pesquisar e consultar cliente/histórico | E; O T-04/T-05 | MVP essencial | Lista paginada por nome/contato; detalhe soma somente vendas e parcelas do tenant e identifica vencidos na data informada. |
| RF-007 | Cadastrar, editar e inativar produto | E; O T-06 | MVP essencial | Nome/código/preço válidos; código único por tenant; inativo não entra em nova confirmação; vendas antigas preservam nome/preço/custo vendidos. |
| RF-008 | Registrar venda com um ou mais itens | E; O T-03/T-23 | MVP essencial | Produto e cliente autorizados; quantidade positiva; backend recalcula subtotal/desconto/total e rejeita total divergente. |
| RF-009 | Confirmar venda e gerar previsão de recebimento | E; O T-03 | MVP essencial | Confirmação cria um recebível e suas parcelas em uma transação; repetir a mesma operação não duplica venda/título. Rascunho não afeta indicadores. |
| RF-010 | Registrar condições e método de pagamento | E; O T-03/T-19 | MVP essencial | Distinguir crediário (condição) de Pix/dinheiro (método realizado); método não prova recebimento. Cartão em RF-024. |
| RF-011 | Gerar parcelas com vencimentos e centavos consistentes | E; O T-03/T-05 | MVP essencial | R$ 600/3 gera 3 × 200; R$ 100/3 gera 33,34 + 33,33 + 33,33; soma igual ao total. Política de data em Q-004. |
| RF-012 | Listar parcelas/saldos a receber | E; O T-07 | MVP essencial | Saldo considera principal efetivamente baixado; atraso = saldo positivo e vencimento anterior à data de referência. Previsto não entra em caixa. |
| RF-013 | Registrar recebimento integral, parcial ou antecipado | E; O T-19 | MVP essencial | R$ 80 baixam parte de parcela 200, restando 120; data/conta/método obrigatórios; não aceitar valor superior ao saldo; cenário C. |
| RF-014 | Consultar recebimentos e confirmar resultado | E; O T-20 | MVP essencial | Resposta após commit identifica pagamento, saldo e efeito de caixa; reenvio idempotente retorna o mesmo resultado sem novo movimento. |
| RF-015 | Cadastrar despesa prevista | E; O T-08 | MVP essencial | Descrição, categoria, valor e vencimento criam obrigação sem saída de caixa; fornecedor começa como texto. Cenário D. |
| RF-016 | Registrar pagamento integral/parcial de despesa | E; P T-08 sem modal | MVP essencial | Pagamento 100 de título 350 deixa 250 e gera saída 100, atomicamente; pagamento futuro não pode ser registrado como realizado. |
| RF-017 | Consultar contas a pagar | E; O T-08 | MVP essencial | Listagem e totalização separam abertas/vencidas/pagas, por vencimento e categoria, sem confundir data de pagamento. |
| RF-018 | Registrar e consultar caixa realizado e abertura | E; O T-09/T-11 | MVP essencial | Saldo 5.000 + 3.900 − 2.600 = 6.300; abertura não vira receita; um pagamento não produz caixa duas vezes. |
| RF-019 | Cancelar venda com rastreabilidade | E; P sem tela | MVP essencial | Sem pagamentos: cancela obrigação e não muda caixa; com pagamentos: bloqueia cobrança e sinaliza restituição pendente, sem apagar entrada histórica. E/F. |
| RF-020 | Estornar recebimento ou pagamento com motivo | E; P sem tela | MVP essencial | Reversão integral referencia registro original e produz movimento inverso uma única vez; venda ativa reabre principal, venda cancelada não volta à cobrança. F/RN-010. |
| RF-021 | Exibir indicadores financeiros básicos | E; O T-01/T-21 | MVP essencial | Faturamento por data da venda difere de recebimentos por data de realização; mesmos filtros produzem os mesmos totais em telas distintas. |
| RF-022 | Manter moeda, fuso e conta padrão da empresa | E/P; O T-11 | MVP essencial | Proposta BRL e fuso IANA; conta padrão pertence ao tenant; saldo inicial auditável, sem sobrescrever saldo corrente. |
| RF-023 | Informar categorias de receitas/despesas | E; O T-08 | MVP essencial | Categoria ativa e do mesmo tenant; tipo compatível com operação; inativação preserva histórico. |
| RF-024 | Tratar cartão, taxas e calendário de repasse | E exige avaliação; O T-03 | Pendente de decisão | Modelo comporta taxa realizada e liquidação manual; não equiparar parcela do comprador ao repasse da adquirente. Q-008. |
| RF-025 | Enviar/aceitar convites e personalizar perfis | O T-12/T-13 | Evolução posterior | Fundação RF-003 usa perfis fixos propostos; prazo de 7 dias e editor de matriz não aprovados. |
| RF-026 | Gerenciar estoque, custo médio e alertas | O T-06 | Pendente de decisão | Não é requisito implícito do cadastro de produto; Q-006 define se haverá controle físico no MVP. |
| RF-027 | Importar catálogo e exportar CSV/PDF | O T-02/T-06/T-10 | Evolução posterior | Avaliar formatos, limites, dados sensíveis e autorização antes de implementar. |
| RF-028 | Comparar períodos e emitir relatórios avançados | O T-10 | Evolução posterior | Indicadores mínimos RF-021 são suficientes inicialmente; margem/contabilidade fiscal fora do MVP. |
| RF-029 | Consultar fluxo projetado | O T-09 | Evolução posterior | Exibir previsão separada do realizado; regra de atrasados depende de Q-010. |
| RF-030 | Central de notificações e busca global | O T-17/shell | Evolução posterior | Pendências mínimas ficam no dashboard; nenhuma mensageria é necessária nesta fase. |
| RF-031 | Gerenciar assinatura SaaS | O T-14 | Evolução posterior | Sem gateway, cartão armazenado, plano pago, cobrança automática ou limite comercial de usuários no MVP. |
| RF-032 | Aplicar descontos/acréscimos comerciais | E; O T-03 | MVP essencial | Desconto explícito entre zero e subtotal; total positivo; parcela considera valor final; preço histórico imutável. |
| RF-033 | Aplicar desconto, acréscimo ou taxa na liquidação | E exige avaliação; P | Pendente de decisão | RN-008 propõe campos e equação; iniciar com zeros até aprovar permissões e limites em Q-007/Q-008. Sem juros automáticos. |
| RF-034 | Manter interface responsiva e estados claros | E; O T-21/T-23; S | MVP essencial | Desktop/mobile usam o mesmo saldo; confirmação depende de resposta do servidor; falha não remove formulário nem duplica operação. |

## Dependências de entrega

RF-001–004 são fundação para expor RF-005–023 com segurança. RF-008–011 dependem de clientes/produtos ativos. RF-013–020 exigem transações, conta, idempotência e auditoria. RF-021 depende de dados financeiros reconciliados. Um login ausente das imagens não elimina a exigência explícita de contexto autenticado.

Valores agregados vistos nas telas não são atributos editáveis de clientes, vendas ou contas. São projeções calculadas; sua aceitação depende de RN-013 e dos cenários A–G.
