# 🚀 WebCraft — Criação de Sites Sob Medida com Calculadora Interativa

Plataforma moderna, responsiva e de alta conversão desenvolvida para a agência **WebCraft**, especializada no desenvolvimento de sites personalizados, landing pages e soluções digitais de alto impacto.

O sistema foi estruturado em **3 Telas Principais** + **Painel Administrativo**:
1. **Tela 1: Início & Como Funciona**
2. **Tela 2: Calculadora & Planos**
3. **Tela 3: Dúvidas**
4. **Painel Admin: Gestão Completa**

---

## 🖥️ As 3 Telas do Sistema

### 1. Tela de Início & Como Funciona (`#inicio` ou `index.html`)
- **Hero Section:** Headline de alto impacto ("Crie o site ideal para sua empresa pagando apenas pelo que precisa") e mockup interativo com badges flutuantes.
- **Como Funciona:** Passo a passo em 3 etapas simples (1. Monte o pacote na calculadora ➔ 2. Veja o valor instantâneo ➔ 3. Receba seu site pronto).
- **Diferenciais WebCraft:** 6 pilares de qualidade técnica (Mobile-first, Foco em Conversão, Propriedade Total, Velocidade Cloud NVMe, SEO Estruturado e Suporte Humano).
- **Vitrine de Recursos:** Apresentação visual dos principais módulos integráveis com botões de ação para a tela da calculadora.

### 2. Tela da Calculadora & Planos (`#calculadora` ou `calculadora.html`)
- **Calculadora Interativa em Tempo Real (Duas Colunas no Desktop):**
  - **Bloco A (Estrutura Base - Obrigatório 1):**
    - Site Express / One-Page (R$ 590,00)
    - Site Institucional Multipáginas (R$ 1.190,00)
  - **Bloco B (Módulos Adicionais Opcionais):**
    - Páginas Extras (R$ 150,00/cada com contador dinâmico `+` e `-`)
    - Criação de Blog / Notícias (R$ 250,00)
    - Galeria / Portfólio Interativo (R$ 120,00)
    - Botão Flutuante do WhatsApp (R$ 50,00)
    - Formulário de Orçamento Completo (R$ 100,00)
    - Sistema de Agendamento Online (R$ 200,00)
    - Catálogo de Produtos (R$ 300,00)
    - Otimização SEO Local (R$ 200,00)
    - Instalação de Pixel de Anúncios (R$ 100,00)
    - Registro de Domínio por 1 Ano (R$ 60,00)
  - **Bloco C (Plano de Manutenção Mensal - Obrigatório 1):**
    - Plano Básico: R$ 49,00/mês
    - Plano Pro: R$ 99,00/mês
    - Plano Premium: R$ 149,00/mês
  - **Card Lateral de Resumo Fixo (Sticky Sidebar):**
    - Lista descritiva dos módulos ativos no momento.
    - Total do Investimento Inicial e simulação de **parcelamento em até 12x no cartão**.
    - Valor da Mensalidade de Hospedagem & Suporte.
    - Formulário de contato rápido (Nome, Empresa e WhatsApp com máscara automática `(11) 99999-9999`).
    - Botão **"Enviar Pedido via WhatsApp"**: Valida os campos e abre o WhatsApp com mensagem estruturada.
    - Botão **"Copiar Resumo"**: Copia o texto para a área de transferência com notificação Toast.
- **Seção de Manutenção & Hospedagem:** Explicação detalhada dos 4 pilares e comparativo lado a lado dos 3 planos com botões de seleção rápida.

### 3. Tela de Dúvidas (`#duvidas` ou `duvidas.html`)
- **Barra de Busca Instantânea:** Digite termos como "prazo", "domínio", "pagamento" e as dúvidas são filtradas em tempo real na tela.
- **Filtros por Categoria:** Botões de filtro para *Prazos & Criação*, *Domínio & Hospedagem*, *Pagamentos & Preços* e *Alterações & Suporte*.
- **Acordeão Suave:** Clique para expandir/recolher as dúvidas com animação fluida.
- **Canais de Contato Direto:** 3 cards para falar no WhatsApp com especialista, ir para a calculadora ou enviar e-mail comercial.

---

## 🔐 Painel Administrativo

O painel administrativo está localizado na subpasta `/admin/` dentro deste mesmo repositório, gerando sua própria URL limpa e direta no GitHub Pages:

| Recurso | URL |
|---------|-----|
| **Site Principal** | `https://henriqueamaralborges-dotcom.github.io/WebCraft/` |
| **Painel Admin** | `https://henriqueamaralborges-dotcom.github.io/WebCraft/admin/` |

- **Credenciais padrão:** Usuário `admin` / Senha `webcraft2026`
- ⚠️ **Altere a senha no primeiro acesso** no menu de Configurações do painel.

### Integração em Tempo Real via Firebase Cloud Firestore

O WebCraft conta com integração oficial com o **Google Firebase (Cloud Firestore)**. Com isso, os clientes podem acessar o site de qualquer lugar do mundo (celular, tablet ou computador) e as informações caem instantaneamente no seu painel de administração em tempo real.

| Recurso | Coleção Firestore | Sincronização |
|---------|-------------------|---------------|
| **Pessoas Cadastradas / Leads** | `leads` | Tempo Real (`onSnapshot`) com notificação na tela |
| **Tabela de Preços** | `settings/pricing` | Sincroniza alterações para a calculadora do site |
| **Descontos & Promoções** | `settings/discounts` | Ativa/desativa descontos para todos os visitantes |
| **Configurações Gerais** | `settings/general` | WhatsApp de destino e e-mail comercial |

> 💡 **Fallback Automático (Offline):** Caso o Firebase ainda não tenha sido conectado, o sistema opera de forma transparente via `localStorage` sem travar nenhuma função.

#### Como Conectar seu Banco de Dados Firebase:
1. Acesse o **Firebase Console** em [console.firebase.google.com](https://console.firebase.google.com/) com sua conta Google e clique em **Criar Projeto**;
2. No menu lateral, acesse **Firestore Database** e clique em **Criar Banco de Dados** (escolha *Modo de Teste* ou configure as regras para leitura/escrita pública);
3. Nas **Configurações do Projeto ⚙️**, role até *Seus Aplicativos* e clique no ícone Web **&lt;/&gt;** para gerar seu `firebaseConfig`;
4. Abra o seu **Painel Admin ➔ Configurações ➔ Banco de Dados Firebase**, cole o bloco de código e clique em **Salvar e Conectar**. Pronto!

---

## ⚡ Transição Fluida entre Telas

No arquivo principal [`index.html`](index.html), as 3 telas funcionam como uma aplicação integrada:
- Ao clicar no menu, a tela troca **instantaneamente sem recarregar a página**, preservando todas as seleções que o cliente já fez na calculadora.
- A URL é atualizada automaticamente (`#inicio`, `#calculadora`, `#duvidas`), permitindo compartilhar links diretos para cada tela.
- Arquivos individuais dedicados ([`calculadora.html`](calculadora.html) e [`duvidas.html`](duvidas.html)) também estão disponíveis para acesso direto.

---

## 📁 Estrutura de Arquivos

```
WebCraft-/
├── index.html          # SPA principal (3 telas integradas)
├── calculadora.html    # Página standalone da calculadora
├── duvidas.html        # Página standalone das dúvidas
├── styles.css          # Estilos do site (design system completo)
├── app.js              # Lógica do site (calculadora, FAQ, navegação)
├── firebase-service.js # 🔥 Serviço de Banco de Dados Firebase (Cloud Firestore)
├── admin/              # 🔐 Painel Administrativo com URL própria (/admin/)
│   ├── index.html      # Tela de login e dashboard do admin
│   ├── admin.css       # Estilos do painel admin (tema escuro)
│   └── admin.js        # Lógica do admin (auth, preços, leads, exportação)
├── .github/workflows/  # Automação de deploy e exibição de links
├── .gitignore          # Exclusões do Git
└── README.md           # Esta documentação
```

---

## ⚙️ Como Configurar o Número de WhatsApp

### Opção 1: Via Painel Admin (Recomendado)
1. Acesse `admin.html` e faça login.
2. Vá em **Configurações**.
3. Altere o campo **WhatsApp** e salve.

### Opção 2: Direto no Código
Abra o arquivo [`app.js`](app.js) e substitua o número na constante `CONFIG`:

```javascript
const CONFIG = {
  // Telefone oficial configurado: +55 11 97481-4897
  whatsappPhone: "5511974814897", 
  currencyLocale: "pt-BR",
  currencyCode: "BRL",
  maxInstallments: 12
};
```

---

## 💻 Como Visualizar Localmente

Basta dar dois cliques em [`index.html`](index.html) para abrir no navegador padrão, ou executar:
```bash
python -m http.server 8080
```
E acessar `http://localhost:8080`.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico com SEO otimizado
- **CSS3** com variáveis customizadas (design tokens), Grid, Flexbox e animações
- **JavaScript** puro (Vanilla JS) — sem dependências externas
- **Font Awesome 6** para ícones
- **Google Fonts** (Plus Jakarta Sans + Inter)
- **LocalStorage API** para persistência de dados admin/leads

---

## 📱 Contato Configurado

- **WhatsApp:** +55 11 97481-4897
- **Número formatado (wa.me):** `5511974814897`

---

© 2026 **WebCraft** — Criação de Sites Sob Medida. Todos os direitos reservados.
