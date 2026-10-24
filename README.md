# 🚀 WebCraft — Criação de Sites Sob Medida com Calculadora Interativa

Plataforma moderna, responsiva e de alta conversão desenvolvida para a agência **WebCraft**, especializada no desenvolvimento de sites personalizados, landing pages e soluções digitais de alto impacto.

O projeto foi organizado com arquitetura **Multi-Páginas (MPA)** limpa e de alta performance, permitindo que cada área do site tenha seu próprio foco e facilidade de navegação para o cliente.

---

## 📂 Estrutura de Páginas do Projeto

```text
WebCraft/
├── index.html         # Página 1: Início, Como Funciona, Diferenciais e Vitrine de Recursos
├── calculadora.html   # Página 2: Calculadora Interativa em Tempo Real e Comparativo de Planos
├── duvidas.html       # Página 3: Perguntas Frequentes (FAQ) com busca em tempo real e Canais de Suporte
├── styles.css         # Design system completo estilo SaaS, variáveis CSS e responsividade mobile-first
├── app.js             # Lógica reativa da calculadora, formatação BRL, validações e API do WhatsApp
├── .gitignore         # Configurações de exclusão para arquivos temporários
└── README.md          # Documentação do projeto
```

---

## 📄 Detalhamento de Cada Página

### 1. `index.html` (Início & Como Funciona)
- **Hero Section:** Headline de alto impacto ("Crie o site ideal para sua empresa pagando apenas pelo que precisa"), subtítulo persuasivo, prova social (+180 sites entregues, 4.9/5 estrelas) e mockup interativo de navegador com métricas de desempenho.
- **Como Funciona:** Passo a passo em 3 etapas transparentes (1. Monte o pacote na calculadora -> 2. Veja o valor instantâneo -> 3. Receba seu site pronto).
- **Diferenciais WebCraft:** 6 pilares de qualidade técnica (Mobile-first, Foco em Conversão, Propriedade Total, Velocidade Cloud NVMe, SEO Estruturado e Suporte Humano).
- **Vitrine de Recursos:** Apresentação visual dos principais módulos integráveis.
- **CTAs Magnéticos:** Botões estratégicos direcionando o usuário para montar o orçamento na calculadora.

### 2. `calculadora.html` (Calculadora Interativa & Planos de Manutenção)
- **Calculadora em Tempo Real (Duas Colunas no Desktop):**
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
    - Botão **"Enviar Pedido via WhatsApp"**: Valida os campos e abre o WhatsApp com a mensagem estruturada.
    - Botão **"Copiar Resumo"**: Copia o texto para a área de transferência com notificação Toast.
- **Seção de Manutenção & Hospedagem:** Explicação detalhada sobre a necessidade de estabilidade e segurança com comparativo dos planos e botões de seleção rápida.

### 3. `duvidas.html` (Perguntas Frequentes & Central de Ajuda)
- **Barra de Busca Instantânea:** Digite termos como "prazo", "domínio", "pagamento" e as dúvidas são filtradas em tempo real na tela.
- **Filtros por Categoria:** Botões de filtro para *Prazos & Criação*, *Domínio & Hospedagem*, *Pagamentos & Preços* e *Alterações & Suporte*.
- **Acordeão Suave:** Clique para expandir/recolher as dúvidas com animação fluida.
- **Canais de Contato Direto:** 3 cards para falar no WhatsApp com especialista, ir para a calculadora ou enviar e-mail comercial.

---

## ⚙️ Como Configurar o Seu Número de WhatsApp

Abra o arquivo [app.js](file:///C:/Users/fcaza/Documents/GitHub/WebCraft-/app.js) e substitua o número da constante `CONFIG`:

```javascript
const CONFIG = {
  // Coloque seu telefone com DDI (55 para Brasil) + DDD + Número sem espaços:
  whatsappPhone: "5511999999999", 
  currencyLocale: "pt-BR",
  currencyCode: "BRL",
  maxInstallments: 12
};
```

E no botão flutuante e rodapé das páginas (`index.html`, `calculadora.html`, `duvidas.html`), atualize os links diretos para o WhatsApp:
```html
<a href="https://wa.me/5511999999999" target="_blank" class="floating-whatsapp-btn">
```

---

## 💻 Como Visualizar Localmente

Não requer instalação de Node ou dependências externas pesadas:
- Dê dois cliques em [**`index.html`**](file:///C:/Users/fcaza/Documents/GitHub/WebCraft-/index.html) para abrir no navegador padrão.
- Ou execute um servidor local simples:
  ```bash
  # Via Python:
  python -m http.server 8080

  # Via npx:
  npx serve .
  ```

---

## 🌐 Publicação no GitHub Pages (100% Gratuito)

1. Faça o commit e o envio dos arquivos:
   ```bash
   git add .
   git commit -m "feat: landing page multi-páginas e calculadora WebCraft"
   git push origin main
   ```
2. No repositório no GitHub, abra **Settings** > **Pages**.
3. Em **Branch**, selecione `main` e a pasta `/(root)`.
4. Salve para gerar o link oficial do site.
