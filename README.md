# 🚀 WebCraft — Landing Page com Calculadora Interativa de Orçamento

Landing page moderna, responsiva e de alta conversão desenvolvida para a agência **WebCraft**, especializada em criação de sites sob medida.

O diferencial central do projeto é uma **Calculadora Interativa em Tempo Real**, onde o cliente seleciona a estrutura do site, módulos adicionais e plano de hospedagem/manutenção, visualizando os valores de investimento inicial, parcelamento em até 12x e mensalidade na hora, com envio automatizado para o WhatsApp.

---

## 🎨 Características Visuais e Tecnológicas

- **Design Estilo SaaS:** Paleta profissional com fundo claro/cinza suave (`#F8FAFC`), Azul Escuro/Índigo (`#0F172A`, `#4F46E5`) e detalhes em Verde Esmeralda/Ciano (`#10B981`, `#06B6D4`) para CTAs e conversão.
- **Tipografia Moderna:** Fontes *Plus Jakarta Sans* e *Inter* do Google Fonts.
- **Totalmente Responsivo:** Desenvolvido no modelo mobile-first, com layout adaptável para smartphones, tablets, laptops e telas ultra-wide.
- **Micro-interações:** Efeitos de elevação em cards, badges com animação de pulso, accordion com transição suave para o FAQ e menu hambúrguer animado.
- **Zero Dependências Pesadas:** Desenvolvido em HTML5 semântico, CSS3 modular e JavaScript Vanilla nativo de altíssima velocidade.

---

## 📂 Estrutura de Arquivos

```text
WebCraft/
├── index.html       # Estrutura semântica de todas as seções e calculadora
├── styles.css       # Design tokens, variáveis CSS, componentes e responsividade
├── app.js           # Lógica reativa da calculadora, formatação BRL e WhatsApp
└── README.md        # Documentação completa do projeto
```

---

## 🧮 Lógica e Regras da Calculadora

### A. Estrutura Base (Obrigatório 1 - Radio)
- **Site Express / One-Page:** R$ 590,00 *(Página única com até 5 seções)*
- **Site Institucional Multipáginas:** R$ 1.190,00 *(Até 4 páginas independentes)*

### B. Módulos Adicionais (Opcionais - Checkboxes)
- **Páginas Extras:** R$ 150,00 cada *(com contador interativo `+` e `-`)*
- **Criação de Blog / Notícias:** R$ 250,00
- **Galeria / Portfólio Interativo:** R$ 120,00
- **Botão Flutuante do WhatsApp:** R$ 50,00
- **Formulário de Orçamento Completo:** R$ 100,00
- **Sistema de Agendamento Online:** R$ 200,00
- **Catálogo de Produtos:** R$ 300,00
- **Otimização SEO Local:** R$ 200,00
- **Instalação de Pixel de Anúncios:** R$ 100,00
- **Registro de Domínio por 1 Ano:** R$ 60,00

### C. Plano de Manutenção & Hospedagem (Obrigatório 1 - Radio)
- **Plano Básico:** R$ 49,00/mês *(Hospedagem Cloud NVMe + SSL)*
- **Plano Pro:** R$ 99,00/mês *(Hospedagem + SSL + 1h de alterações/mês)*
- **Plano Premium:** R$ 149,00/mês *(Hospedagem + SSL + Alterações + Suporte Prioritário)*

### D. Card Lateral de Resumo (Sticky)
- Atualização em tempo real do **Investimento Inicial de Criação** (Base + Adicionais).
- Cálculo automático de **parcelamento em até 12x no cartão**.
- Indicação do valor da **mensalidade de manutenção**.
- Lista descritiva dos módulos ativos no momento.
- Formulário de captura com validação: Nome, Empresa e WhatsApp (com máscara automática `(11) 99999-9999`).
- Botão **"Enviar Pedido via WhatsApp"**: Abre a API oficial do WhatsApp (`https://wa.me/...`) com uma mensagem estruturada e pronta para o cliente iniciar o atendimento.
- Botão **"Copiar Resumo"**: Copia todo o texto formatado para a área de transferência com notificação Toast.

---

## ⚙️ Como Configurar o Seu Número de WhatsApp

Abra o arquivo [app.js](file:///C:/Users/fcaza/Documents/GitHub/WebCraft-/app.js) e altere a primeira linha de configuração:

```javascript
const CONFIG = {
  // Substitua pelo seu telefone com DDI (55 para Brasil) + DDD + Número:
  whatsappPhone: "5511999999999", 
  currencyLocale: "pt-BR",
  currencyCode: "BRL",
  maxInstallments: 12
};
```

E no arquivo [index.html](file:///C:/Users/fcaza/Documents/GitHub/WebCraft-/index.html), atualize os links diretos para o WhatsApp no botão flutuante e no rodapé:
```html
<a href="https://wa.me/5511999999999" target="_blank" class="floating-whatsapp-btn">
```

---

## 💻 Como Visualizar e Testar Localmente

Como o projeto é construído em padrões web puros (HTML, CSS e JS), não é necessário instalar nenhum pacote npm:

1. **Opção 1:** Dê dois cliques no arquivo `index.html` para abrir diretamente no seu navegador padrão (Chrome, Edge, Firefox, Safari).
2. **Opção 2 (Recomendada para desenvolvimento):** Abra a pasta no VS Code e utilize a extensão **Live Server** para recarregamento automático.
3. **Opção 3 (Terminal):**
   ```bash
   # Com Python:
   python -m http.server 8080

   # Com Node.js / npx:
   npx serve .
   ```

---

## 🌐 Publicação no GitHub Pages (Grátis)

Para colocar o site no ar gratuitamente em menos de 1 minuto:

1. Faça o commit e push dos arquivos para o repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: landing page e calculadora interativa WebCraft"
   git push origin main
   ```
2. No repositório no GitHub, clique na aba **Settings** (Configurações).
3. No menu lateral esquerdo, clique em **Pages**.
4. Em **Build and deployment > Branch**, selecione a branch `main` e a pasta `/(root)`.
5. Clique em **Save**. Em instantes seu site estará disponível no endereço:
   `https://henriqueamaralborges-dotcom.github.io/WebCraft-/`

---

## 📄 Licença

Desenvolvido para **WebCraft**. Todos os direitos reservados.
