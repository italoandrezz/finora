# ADR-003 — Autenticação futura

**Estado:** proposto, pendente Q-001; não há autenticação de negócio implementada. Data: 23/10/2026.

Contexto: SPA React e backend separado logicamente, primeiro piloto controlado e ausência de telas de login/recuperação no protótipo.

Proposta preferida: sessão de servidor com cookie HttpOnly/Secure/SameSite apropriado e proteção CSRF, servidos sob mesmo domínio quando houver infraestrutura para isso. Revalidar membership por requisição; papéis não ficam confiados a seleção de empresa nem a claims permanentes. A implantação futura deve decidir domínio, armazenamento/expiração de sessão, rotação e recuperação segura.

Alternativas: OIDC com provedor externo (reduz gestão de credenciais, cria dependência operacional); tokens próprios (podem atender múltiplos clientes, mas aumentam custo de emissão, expiração, refresh e revogação). Nenhum JWT fictício ou usuário administrativo padrão será criado.

Vantagens da sessão: revogação central e integração direta com Spring Security; sem token persistido em localStorage. Desvantagens: exige estratégia de sessão/CSRF, origem/cookies e escalabilidade quando houver mais instâncias.

Consequências: login, recuperação e provisionamento precisam de especificação antes da Fase 2; esta fase não cria colunas de senha nem depende de um provedor escolhido. [Referência oficial de CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html) fundamenta o risco técnico, não aprova a decisão de produto.
