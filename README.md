# 🚀 WebCraft — Criação de Sites Sob Medida com 3 Telas Dedicadas

Plataforma moderna, responsiva e de alta conversão desenvolvida para a agência **WebCraft**, especializada no desenvolvimento de sites personalizados, landing pages e soluções digitais de alto impacto.

O sistema foi estruturado em **3 Telas Principais**:
1. **Tela 1: Início & Como Funciona**
2. **Tela 2: Calculadora & Planos**
3. **Tela 3: Dúvidas**

---

## 🖥️ As 3 Telas do Sistema

### 1. Tela de Início & Como Funciona (`#inicio` ou `index.html`)
- **Hero Section:** Headline de alto impacto ("Crie o site ideal para sua empresa pagando apenas pelo que precisa"), prova social com métricas reais (+180 sites entregues, 4.9/5 estrelas) e mockup interativo com badges flutuantes.
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
- **Seção de Manutenção & Hospedagem:** Explicação detalhada dos 4 pilares (Velocidade Cloud, Segurança & SSL, Backups e Suporte) e comparativo lado a lado dos 3 planos com botões de seleção rápida.

### 3. Tela de Dúvidas (`#duvidas` ou `duvidas.html`)
- **Barra de Busca Instantânea:** Digite termos como "prazo", "domínio", "pagamento" e as dúvidas são filtradas em tempo real na tela.
- **Filtros por Categoria:** Botões de filtro para *Prazos & Criação*, *Domínio & Hospedagem*, *Pagamentos & Preços* e *Alterações & Suporte*.
- **Acordeão Suave:** Clique para expandir/recolher as dúvidas com animação fluida.
- **Canais de Contato Direto:** 3 cards para falar no WhatsApp com especialista (resposta em 15 min), ir para a calculadora ou enviar e-mail comercial.

---

## ⚡ Transição Fluida entre Telas

No arquivo principal [**`index.html`**](file:///C:/Users/fcaza/Documents/GitHub/WebCraft-/index.html), as 3 telas funcionam como uma aplicação integrada:
- Ao clicar no menu, a tela troca **instantaneamente sem recarregar a página**, preservando todas as seleções que o cliente já fez na calculadora.
- A URL é atualizada automaticamente (`#inicio`, `#calculadora`, `#duvidas`), permitindo compartilhar links diretos para cada tela.
- Arquivos individuais dedicados ([`calculadora.html`](file:///C:/Users/fcaza/Documents/GitHub/WebCraft-/calculadora.html) e [`duvidas.html`](file:///C:/Users/fcaza/Documents/GitHub/WebCraft-/duvidas.html)) também estão disponíveis para acesso direto.

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

---

## 💻 Como Visualizar Localmente

Basta dar dois cliques em [**`index.html`**](file:///C:/Users/fcaza/Documents/GitHub/WebCraft-/index.html) para abrir no navegador padrão, ou executar:
```bash
python -m http.server 8080
```
E acessar `http://localhost:8080`.
