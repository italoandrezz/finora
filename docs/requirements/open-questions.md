# Questões abertas e decisões de produto

Responsável sugerido: Ítalo Ramos como dono do produto, com revisão técnica. **Todas permanecem abertas**; a alternativa recomendada abaixo é uma proposta para tornar o modelo discutível, não resposta presumida do usuário.

| ID | Pergunta / conflito | Proposta inicial | Impacto e quando decidir |
| --- | --- | --- | --- |
| Q-001 | Sessão no servidor, provedor OIDC ou outra autenticação? Como recuperar acesso/provisionar? | Sessão com cookie seguro e CSRF para SPA no mesmo domínio; sem JWT fictício | ADR-003; antes de identity/tenancy |
| Q-002 | Exigir CNPJ/razão social? BRL único? Fuso alterável após lançamentos? | Nome de loja obrigatório; documentos opcionais até política definida; BRL; IANA America/Fortaleza como exemplo, sem usar UTC−03 fixo | T-11; antes do onboarding; política jurídica/documental não aprovada |
| Q-003 | Venda sem cliente? Telefone obrigatório? CPF único? | Cliente obrigatório para crediário; propor cliente em toda venda inicialmente; CPF opcional único por tenant quando informado; nome suficiente para cadastro mínimo | T-03/T-18; antes de customers/sales |
| Q-004 | Limite de parcelas e vencimentos em fins de semana/dias 29–31? | Limite técnico proposto 1–120; avanço mensal mantendo dia-âncora, usando último dia se inexistente; sem ajuste de feriados | RF-011; antes de parcelamento; limite é proposta, não regra aprovada |
| Q-005 | Perfis exatos e quem pode ver custo, receber, estornar e cancelar? | Matriz fixa em tenancy; ADMIN preservado, FINANCE e SALES restritos; somente ADMIN estorna | T-13; antes de autorização; personalização posterior |
| Q-006 | Estoque/variações/custo médio e unidades fracionadas fazem parte do MVP? | Catálogo simples, custo conhecido opcional para snapshot, sem baixa de estoque nem margem prometida; quantidade inteira | T-06; antes de catalog; alterar modelo se aprovado |
| Q-007 | Descontos/acréscimos na venda e na baixa: limites, motivo e permissão? Juros de atraso? | Desconto comercial explícito; desconto/acréscimo de liquidação manual apenas após aprovação; sem cálculo automático de multa/juros | RN-008; antes de liquidação com ajustes |
| Q-008 | Cartão: uma ou várias previsões de repasse, taxa por pagamento, retenção no estorno? Pagamento misto? | Cartão pendente; validar cada repasse manual, não marcar caixa ao autorizar venda; taxa explícita, uma forma realizada por baixa; pagamentos mistos posteriores | T-03/T-19; antes de habilitar CARD e campos de taxa |
| Q-009 | Filtros globais, períodos dos cards e paginação mobile? | Distinguir data de venda, vencimento e realização; OR de estados, AND de dimensões; páginas estáveis | T-16/T-22; antes da UI/listagens |
| Q-010 | Saldo consolidado/múltiplas contas, abertura, saldo negativo e inclusão de atrasados na projeção? | Uma conta inicial; abertura auditável; permitir saldo negativo com aviso; projeção posterior, atrasados separados e sinalizados | T-09/T-11; antes de cashflow |
| Q-011 | Autoatendimento, convites de 7 dias, limites de cinco usuários e criação de empresa? | Provisionamento controlado no piloto; sem limites/preços comerciais; convites completos posteriores | T-12/T-14/T-15; antes da comercialização |
| Q-012 | Por que 11 parcelas em T-07 somam R$ 2.180, enquanto cards mostram R$ 2.200? | Reconciliar exemplos antes de fixtures; diferença aparenta ser R$ 20 no conjunto associado a Camila (linhas somam 530 versus saldo 550 em T-04), sem inferir qual valor é correto | T-04/T-07/T-20; antes de validar telas com dados de exemplo |
| Q-013 | Retenção, anonimização, acesso a CPF/comprovantes e permissões de auditoria? | Arquivamento preserva finanças; não prometer retenção indefinida nem adequação legal sem avaliação; anexos posteriores | RNF-007/ADR-006; antes de dados reais |
| Q-014 | Volume, p95, disponibilidade, RPO/RTO e restauração? | Definir metas a partir do piloto; ensaiar restauração antes de uso real | RNF-014–015; antes do piloto |
| Q-015 | Cancelamento após recebimento: restituição imediata ou pendente? Reabertura? | Cancelar comercialmente e bloquear cobrança; indicar restituição pendente até reversão real. Sem reabertura/estorno parcial no MVP | Cenário F; antes de cancelamento e reversão |
| Q-016 | Rascunho é salvo no servidor ou somente formulário local? | Formulário local no MVP; salvar rascunho no servidor é opção posterior. API atômica de confirmação não exige rascunho persistido | T-03/T-23; antes de sales |
| Q-017 | Indicadores históricos são recalculados após cancelamento retroativo? | Visão operacional reprocessável; faturamento exclui vendas atualmente canceladas e sinaliza data de consulta. Sem fechamento contábil no MVP | RN-013; antes de reporting |
| Q-018 | Uma baixa pode quitar várias parcelas ou incluir excedente/crédito do cliente? | Uma baixa por parcela; excedente rejeitado; quitação em lote e crédito futuro fora do MVP | T-19/RF-013; antes de recebimentos |

## Sugestões de melhoria de interface (S)

- Distinguir “Cancelar edição” de “Cancelar venda confirmada”; esta última exige motivo.
- Mostrar valor original, principal liquidado e saldo pendente nas parcelas, além da condição “vencida”.
- No cartão, separar venda autorizada, recebível de repasse e dinheiro disponível.
- Mostrar restituições pendentes sem chamá-las de conta a receber negativa.
- Dar nome acessível às marcas de ações não identificadas no catálogo e usuários.
- Não exigir telefone/CPF apenas porque estão destacados no protótipo sem justificar uso.

Os cenários usam hipóteses explícitas para permitir discussão; se uma escolha for aprovada, registrar data/autor e atualizar RF, RN, ADR, ER e contrato afetados no mesmo PR documental.
