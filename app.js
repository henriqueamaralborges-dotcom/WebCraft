/**
 * WebCraft - Landing Page & Calculadora Interativa de Orçamento
 * Lógica em JavaScript puro (Vanilla JS) para alta performance e zero dependências.
 */

// ==========================================================================
// 1. Configurações Globais (Edite aqui o telefone da sua agência)
// ==========================================================================
const CONFIG = {
  // Número oficial do WhatsApp para receber orçamentos (DDI + DDD + Número sem traços)
  whatsappPhone: "5511999999999", 
  currencyLocale: "pt-BR",
  currencyCode: "BRL",
  maxInstallments: 12
};

// ==========================================================================
// 2. Dicionário de Preços e Dados dos Módulos
// ==========================================================================
const PRICING_DATA = {
  bases: {
    "express": {
      name: "Site Express / One-Page",
      desc: "Página única com até 5 seções",
      price: 590
    },
    "multi": {
      name: "Site Institucional Multipáginas",
      desc: "Até 4 páginas independentes",
      price: 1190
    }
  },
  extraPageUnitPrice: 150,
  modules: {
    "blog": {
      name: "Criação de Blog / Notícias",
      price: 250
    },
    "galeria": {
      name: "Galeria / Portfólio Interativo",
      price: 120
    },
    "whatsapp": {
      name: "Botão Flutuante do WhatsApp",
      price: 50
    },
    "formulario": {
      name: "Formulário de Orçamento Completo",
      price: 100
    },
    "agendamento": {
      name: "Sistema de Agendamento Online",
      price: 200
    },
    "catalogo": {
      name: "Catálogo de Produtos",
      price: 300
    },
    "seo": {
      name: "Otimização SEO Local",
      price: 200
    },
    "pixel": {
      name: "Instalação de Pixel de Anúncios",
      price: 100
    },
    "dominio": {
      name: "Registro de Domínio por 1 Ano",
      price: 60
    }
  },
  maintenance: {
    "basico": {
      name: "Plano Básico",
      desc: "Hospedagem + SSL",
      price: 49
    },
    "pro": {
      name: "Plano Pro",
      desc: "Hospedagem + SSL + 1h alterações",
      price: 99
    },
    "premium": {
      name: "Plano Premium",
      desc: "Hospedagem + SSL + Alterações + Suporte Prioritário",
      price: 149
    }
  }
};

// ==========================================================================
// 3. Estado da Calculadora
// ==========================================================================
const state = {
  selectedBase: "multi", // Padrão recomendado
  extraPagesCount: 0,
  selectedModules: new Set(),
  selectedMaintenance: "pro", // Padrão recomendado
  clientName: "",
  clientCompany: "",
  clientPhone: ""
};

// ==========================================================================
// 4. Utilitários de Formatação
// ==========================================================================
const formatCurrency = (value) => {
  return new Intl.NumberFormat(CONFIG.currencyLocale, {
    style: "currency",
    currency: CONFIG.currencyCode,
    minimumFractionDigits: 2
  }).format(value);
};

// Formatação dinâmica de telefone brasileiro (11) 99999-9999
const maskPhone = (value) => {
  let cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length > 11) {
    cleanValue = cleanValue.slice(0, 11);
  }

  if (cleanValue.length > 10) {
    return cleanValue.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (cleanValue.length > 6) {
    return cleanValue.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  } else if (cleanValue.length > 2) {
    return cleanValue.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
  } else if (cleanValue.length > 0) {
    return cleanValue.replace(/^(\d{0,2})$/, "($1");
  }
  return cleanValue;
};

// ==========================================================================
// 5. Motor de Cálculo e Atualização da Interface
// ==========================================================================
function calculateTotals() {
  const baseInfo = PRICING_DATA.bases[state.selectedBase] || PRICING_DATA.bases["multi"];
  let initialTotal = baseInfo.price;

  // Soma de páginas extras
  const extraPagesTotal = state.extraPagesCount * PRICING_DATA.extraPageUnitPrice;
  initialTotal += extraPagesTotal;

  // Soma dos módulos opcionais selecionados
  state.selectedModules.forEach((modKey) => {
    if (PRICING_DATA.modules[modKey]) {
      initialTotal += PRICING_DATA.modules[modKey].price;
    }
  });

  // Plano de manutenção
  const maintInfo = PRICING_DATA.maintenance[state.selectedMaintenance] || PRICING_DATA.maintenance["pro"];
  const maintenanceTotal = maintInfo.price;

  // Parcelamento
  const installmentValue = initialTotal / CONFIG.maxInstallments;

  return {
    baseInfo,
    extraPagesTotal,
    initialTotal,
    installmentValue,
    maintInfo,
    maintenanceTotal
  };
}

function updateUI() {
  const calcContainer = document.querySelector('.calculator-section');
  if (!calcContainer) return;

  const totals = calculateTotals();

  // 1. Atualiza os cards visuais de rádio da Base
  document.querySelectorAll('.option-card-radio[data-base]').forEach((card) => {
    const baseKey = card.getAttribute('data-base');
    const radio = card.querySelector('input[type="radio"]');
    if (baseKey === state.selectedBase) {
      card.classList.add('selected');
      if (radio) radio.checked = true;
    } else {
      card.classList.remove('selected');
      if (radio) radio.checked = false;
    }
  });

  // 2. Atualiza os cards de módulos normais
  document.querySelectorAll('.module-card[data-module]').forEach((card) => {
    const modKey = card.getAttribute('data-module');
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (state.selectedModules.has(modKey)) {
      card.classList.add('selected');
      if (checkbox) checkbox.checked = true;
    } else {
      card.classList.remove('selected');
      if (checkbox) checkbox.checked = false;
    }
  });

  // 3. Atualiza o card especial de Páginas Extras
  const extraPagesCard = document.querySelector('.module-extra-pages');
  const extraPagesCheckbox = document.getElementById('chk-extra-pages');
  const counterValueEl = document.getElementById('extra-pages-count');

  if (counterValueEl) {
    counterValueEl.textContent = state.extraPagesCount;
  }

  if (extraPagesCard && extraPagesCheckbox) {
    if (state.extraPagesCount > 0) {
      extraPagesCard.classList.add('selected');
      extraPagesCheckbox.checked = true;
    } else {
      extraPagesCard.classList.remove('selected');
      extraPagesCheckbox.checked = false;
    }
  }

  // 4. Atualiza os cards de Manutenção
  document.querySelectorAll('.maintenance-card[data-maintenance]').forEach((card) => {
    const maintKey = card.getAttribute('data-maintenance');
    const radio = card.querySelector('input[type="radio"]');
    if (maintKey === state.selectedMaintenance) {
      card.classList.add('selected');
      if (radio) radio.checked = true;
    } else {
      card.classList.remove('selected');
      if (radio) radio.checked = false;
    }
  });

  // 5. Atualiza os valores do Card Lateral de Resumo
  const totalDisplayEl = document.getElementById('summary-total-price');
  const installmentDisplayEl = document.getElementById('summary-installment-price');
  const maintDisplayEl = document.getElementById('summary-maint-price');

  if (totalDisplayEl) {
    totalDisplayEl.textContent = formatCurrency(totals.initialTotal);
  }
  if (installmentDisplayEl) {
    installmentDisplayEl.textContent = formatCurrency(totals.installmentValue);
  }
  if (maintDisplayEl) {
    maintDisplayEl.textContent = `${formatCurrency(totals.maintenanceTotal)}/mês`;
  }

  // 6. Atualiza a lista discriminada de itens no resumo
  renderSummaryItemsList(totals);
}

function renderSummaryItemsList(totals) {
  const listEl = document.getElementById('summary-selected-items');
  if (!listEl) return;

  listEl.innerHTML = '';

  // Item Base
  const baseRow = document.createElement('div');
  baseRow.className = 'summary-item-row item-base';
  baseRow.innerHTML = `
    <span class="summary-item-name" title="${totals.baseInfo.name}">
      <i class="fa-solid fa-layer-group"></i> ${totals.baseInfo.name}
    </span>
    <span class="summary-item-price">${formatCurrency(totals.baseInfo.price)}</span>
  `;
  listEl.appendChild(baseRow);

  // Páginas Extras
  if (state.extraPagesCount > 0) {
    const extraRow = document.createElement('div');
    extraRow.className = 'summary-item-row';
    extraRow.innerHTML = `
      <span class="summary-item-name">
        <i class="fa-regular fa-file-lines"></i> ${state.extraPagesCount}x Página(s) Extra(s)
      </span>
      <span class="summary-item-price">${formatCurrency(totals.extraPagesTotal)}</span>
    `;
    listEl.appendChild(extraRow);
  }

  // Módulos Selecionados
  state.selectedModules.forEach((modKey) => {
    const mod = PRICING_DATA.modules[modKey];
    if (mod) {
      const modRow = document.createElement('div');
      modRow.className = 'summary-item-row';
      modRow.innerHTML = `
        <span class="summary-item-name" title="${mod.name}">
          <i class="fa-solid fa-puzzle-piece"></i> ${mod.name}
        </span>
        <span class="summary-item-price">${formatCurrency(mod.price)}</span>
      `;
      listEl.appendChild(modRow);
    }
  });

  // Plano de Manutenção
  const maintRow = document.createElement('div');
  maintRow.className = 'summary-item-row';
  maintRow.innerHTML = `
    <span class="summary-item-name" title="${totals.maintInfo.name}">
      <i class="fa-solid fa-shield-halved"></i> ${totals.maintInfo.name}
    </span>
    <span class="summary-item-price">${formatCurrency(totals.maintenanceTotal)}/mês</span>
  `;
  listEl.appendChild(maintRow);
}

// ==========================================================================
// 6. Manipulação de Eventos da Calculadora
// ==========================================================================
function setupCalculatorEvents() {
  // Clique na Estrutura Base
  document.querySelectorAll('.option-card-radio[data-base]').forEach((card) => {
    card.addEventListener('click', () => {
      const baseKey = card.getAttribute('data-base');
      if (baseKey && PRICING_DATA.bases[baseKey]) {
        state.selectedBase = baseKey;
        updateUI();
      }
    });
  });

  // Clique nos Módulos Opcionais normais
  document.querySelectorAll('.module-card[data-module]').forEach((card) => {
    card.addEventListener('click', () => {
      const modKey = card.getAttribute('data-module');
      if (!modKey) return;

      if (state.selectedModules.has(modKey)) {
        state.selectedModules.delete(modKey);
      } else {
        state.selectedModules.add(modKey);
      }
      updateUI();
    });
  });

  // Seletor de Páginas Extras (+ e -)
  const btnDecrement = document.getElementById('btn-decrease-pages');
  const btnIncrement = document.getElementById('btn-increase-pages');
  const extraPagesCard = document.querySelector('.module-extra-pages');

  if (btnDecrement) {
    btnDecrement.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.extraPagesCount > 0) {
        state.extraPagesCount--;
        updateUI();
      }
    });
  }

  if (btnIncrement) {
    btnIncrement.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.extraPagesCount < 20) {
        state.extraPagesCount++;
        updateUI();
      }
    });
  }

  // Clique no card de Páginas Extras
  if (extraPagesCard) {
    extraPagesCard.addEventListener('click', (e) => {
      if (!e.target.closest('.counter-btn')) {
        if (state.extraPagesCount === 0) {
          state.extraPagesCount = 1;
        } else {
          state.extraPagesCount = 0;
        }
        updateUI();
      }
    });
  }

  // Clique nos Planos de Manutenção
  document.querySelectorAll('.maintenance-card[data-maintenance]').forEach((card) => {
    card.addEventListener('click', () => {
      const maintKey = card.getAttribute('data-maintenance');
      if (maintKey && PRICING_DATA.maintenance[maintKey]) {
        state.selectedMaintenance = maintKey;
        updateUI();
      }
    });
  });

  // Planos da Seção de Manutenção (links de seleção rápida)
  document.querySelectorAll('.btn-select-plan[data-plan]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planKey = btn.getAttribute('data-plan');
      if (planKey && PRICING_DATA.maintenance[planKey]) {
        state.selectedMaintenance = planKey;
        updateUI();

        // Rola até a calculadora
        const calcSection = document.getElementById('calculadora');
        if (calcSection) {
          calcSection.scrollIntoView({ behavior: 'smooth' });
        }
        showToast(`Plano "${PRICING_DATA.maintenance[planKey].name}" selecionado!`);
      }
    });
  });
}

// ==========================================================================
// 7. Formulário de Lead e Envio via WhatsApp
// ==========================================================================
function setupLeadForm() {
  const inputName = document.getElementById('lead-name');
  const inputCompany = document.getElementById('lead-company');
  const inputPhone = document.getElementById('lead-phone');
  const btnSendWhatsApp = document.getElementById('btn-send-whatsapp');
  const btnCopySummary = document.getElementById('btn-copy-summary');

  if (!btnSendWhatsApp && !btnCopySummary) return;

  // Máscara e validação em tempo real do Telefone
  if (inputPhone) {
    inputPhone.addEventListener('input', (e) => {
      e.target.value = maskPhone(e.target.value);
      if (e.target.value.replace(/\D/g, '').length >= 10) {
        e.target.classList.remove('error');
      }
    });
  }

  if (inputName) {
    inputName.addEventListener('input', (e) => {
      if (e.target.value.trim().length > 2) {
        e.target.classList.remove('error');
      }
    });
  }

  // Botão Enviar Pedido via WhatsApp
  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();

      const nameVal = inputName ? inputName.value.trim() : "";
      const companyVal = inputCompany ? inputCompany.value.trim() : "";
      const phoneVal = inputPhone ? inputPhone.value.trim() : "";

      let hasError = false;

      if (!nameVal || nameVal.length < 2) {
        if (inputName) inputName.classList.add('error');
        hasError = true;
      }

      const rawPhone = phoneVal.replace(/\D/g, '');
      if (!rawPhone || rawPhone.length < 10) {
        if (inputPhone) inputPhone.classList.add('error');
        hasError = true;
      }

      if (hasError) {
        showToast("⚠️ Por favor, informe seu Nome e WhatsApp para contato.", "warning");
        if (inputName && !nameVal) inputName.focus();
        else if (inputPhone) inputPhone.focus();
        return;
      }

      state.clientName = nameVal;
      state.clientCompany = companyVal || "Não informada";
      state.clientPhone = phoneVal;

      // Gera mensagem formatada
      const message = generateWhatsAppMessage();

      // Monta URL oficial da API do WhatsApp
      const cleanTargetPhone = CONFIG.whatsappPhone.replace(/\D/g, '');
      const waUrl = `https://wa.me/${cleanTargetPhone}?text=${encodeURIComponent(message)}`;

      showToast("🚀 Abrindo WhatsApp com seu orçamento...", "success");

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 300);
    });
  }

  // Botão Copiar Resumo
  if (btnCopySummary) {
    btnCopySummary.addEventListener('click', (e) => {
      e.preventDefault();
      const message = generateWhatsAppMessage();
      navigator.clipboard.writeText(message).then(() => {
        showToast("📋 Resumo copiado para a área de transferência!", "success");
      }).catch(() => {
        showToast("Não foi possível copiar automaticamente.", "warning");
      });
    });
  }
}

// Gera a mensagem em Markdown limpa para o WhatsApp
function generateWhatsAppMessage() {
  const totals = calculateTotals();

  let msg = `🚀 *NOVO ORÇAMENTO DE SITE - WEBCRAFT*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Dados do Cliente
  msg += `👤 *Cliente:* ${state.clientName || 'Cliente'}\n`;
  if (state.clientCompany && state.clientCompany !== "Não informada") {
    msg += `🏢 *Empresa:* ${state.clientCompany}\n`;
  }
  msg += `📱 *WhatsApp:* ${state.clientPhone || 'Não informado'}\n\n`;

  // Estrutura Base
  msg += `📦 *Estrutura Base Escolhida:*\n`;
  msg += `• ${totals.baseInfo.name} — *${formatCurrency(totals.baseInfo.price)}*\n`;
  msg += `  _${totals.baseInfo.desc}_\n\n`;

  // Módulos Adicionais
  msg += `🧩 *Módulos Adicionais Selecionados:*\n`;
  let hasExtras = false;

  if (state.extraPagesCount > 0) {
    hasExtras = true;
    msg += `• Páginas Extras (${state.extraPagesCount}x) — *${formatCurrency(totals.extraPagesTotal)}*\n`;
  }

  state.selectedModules.forEach((modKey) => {
    const mod = PRICING_DATA.modules[modKey];
    if (mod) {
      hasExtras = true;
      msg += `• ${mod.name} — *${formatCurrency(mod.price)}*\n`;
    }
  });

  if (!hasExtras) {
    msg += `• _Nenhum módulo adicional selecionado_\n`;
  }
  msg += `\n`;

  // Plano de Manutenção
  msg += `🛡️ *Plano de Manutenção & Hospedagem:*\n`;
  msg += `• ${totals.maintInfo.name} — *${formatCurrency(totals.maintenanceTotal)}/mês*\n`;
  msg += `  _${totals.maintInfo.desc}_\n\n`;

  // Resumo Financeiro
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *INVESTIMENTO INICIAL:* *${formatCurrency(totals.initialTotal)}*\n`;
  msg += `💳 *Parcelamento:* Em até ${CONFIG.maxInstallments}x de *${formatCurrency(totals.installmentValue)}* no cartão\n`;
  msg += `🔄 *Mensalidade:* *${formatCurrency(totals.maintenanceTotal)}/mês* (após entrega)\n\n`;

  msg += `Olá equipe WebCraft! Acabei de simular este orçamento pelo site e gostaria de tirar dúvidas e dar início ao meu projeto. Aguardo o contato!`;

  return msg;
}

// ==========================================================================
// 8. FAQ Accordion & Busca / Filtros
// ==========================================================================
function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fecha todos os outros itens
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Alterna o atual
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 30 + "px";
        } else {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        }
      });
    }
  });

  // Filtro de Busca em Tempo Real
  const searchInput = document.getElementById('faq-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      faqItems.forEach((item) => {
        const questionText = item.querySelector('.faq-question span')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';

        if (questionText.includes(term) || answerText.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Filtro de Categorias (Botões Pills)
  const filterButtons = document.querySelectorAll('.faq-filter-btn');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-category');

      faqItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (targetCategory === 'todos' || itemCategory === targetCategory) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      document.querySelectorAll('.faq-category-header').forEach((catHeader) => {
        const headerCat = catHeader.getAttribute('data-category');
        if (targetCategory === 'todos' || headerCat === targetCategory) {
          catHeader.style.display = 'flex';
        } else {
          catHeader.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// 9. Gerenciador de Telas (Screen Switcher para as 3 Telas do Sistema)
// ==========================================================================
function switchScreen(screenName, updateHistory = true) {
  const validScreens = ['inicio', 'calculadora', 'duvidas'];
  const targetScreen = validScreens.includes(screenName) ? screenName : 'inicio';

  const screens = document.querySelectorAll('.app-screen');
  if (screens.length > 0) {
    screens.forEach(screen => {
      screen.classList.remove('active');
    });

    const activeEl = document.getElementById(`screen-${targetScreen}`);
    if (activeEl) {
      activeEl.classList.add('active');
    }
  }

  // Atualiza botões e links de navegação ativos
  document.querySelectorAll('[data-screen-target]').forEach(link => {
    if (link.getAttribute('data-screen-target') === targetScreen) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Atualiza o estado da calculadora caso a tela seja 'calculadora'
  if (targetScreen === 'calculadora') {
    updateUI();
  }

  // Rola suavemente até o topo da tela
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Sincroniza hash da URL sem causar refresh
  if (updateHistory) {
    history.pushState(null, '', `#${targetScreen}`);
  }
}

function initScreenRouting() {
  const screens = document.querySelectorAll('.app-screen');
  if (screens.length === 0) return; // Se for uma página individual estática, não precisa do switcher

  // Identifica hash inicial na URL (ex: #calculadora, #duvidas, #inicio)
  const initialHash = window.location.hash.replace('#', '').toLowerCase();
  if (initialHash === 'calculadora' || initialHash === 'planos') {
    switchScreen('calculadora', false);
  } else if (initialHash === 'duvidas' || initialHash === 'faq') {
    switchScreen('duvidas', false);
  } else {
    switchScreen('inicio', false);
  }

  // Listener para navegação pelo histórico do navegador (botões Voltar/Avançar)
  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '').toLowerCase();
    if (currentHash === 'calculadora' || currentHash === 'planos') {
      switchScreen('calculadora', false);
    } else if (currentHash === 'duvidas' || currentHash === 'faq') {
      switchScreen('duvidas', false);
    } else {
      switchScreen('inicio', false);
    }
  });

  // Event listener para todos os links com data-screen-target
  document.querySelectorAll('[data-screen-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-screen-target');
      switchScreen(target, true);

      // Fecha menu mobile se estiver aberto
      const mobileNav = document.querySelector('.nav-mobile');
      const toggleBtn = document.querySelector('.mobile-toggle');
      if (mobileNav && mobileNav.classList.contains('show')) {
        mobileNav.classList.remove('show');
        if (toggleBtn) toggleBtn.classList.remove('active');
      }
    });
  });

  // Event listener para links que trocam de tela E rolam para uma seção específica (ex: #como-funciona)
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetScreen = btn.getAttribute('data-target-screen') || 'inicio';
      const scrollToSelector = btn.getAttribute('data-scroll-to');
      
      switchScreen(targetScreen, true);
      
      setTimeout(() => {
        const el = document.querySelector(scrollToSelector);
        if (el) {
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 150);
    });
  });
}

// ==========================================================================
// 10. Toast Notification
// ==========================================================================
let toastTimeout = null;

function showToast(message, type = "info") {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  let iconHtml = '<i class="fa-solid fa-circle-check"></i>';
  if (type === "warning") {
    iconHtml = '<i class="fa-solid fa-triangle-exclamation" style="color: #F59E0B;"></i>';
  }

  toastContainer.innerHTML = `
    <div class="toast-box">
      ${iconHtml}
      <span>${message}</span>
    </div>
  `;

  toastContainer.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastContainer.classList.remove('show');
  }, 3800);
}

// ==========================================================================
// 11. Header Scrolled & Menu Mobile
// ==========================================================================
function setupNavigation() {
  const header = document.querySelector('.header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.nav-mobile');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (header) header.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
    }
  });

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');
      mobileNav.classList.toggle('show');
    });

    mobileNav.querySelectorAll('.nav-link, .btn').forEach((link) => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        mobileNav.classList.remove('show');
      });
    });
  }
}

// ==========================================================================
// 12. Inicialização Geral no DOMContentLoaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  initScreenRouting();
  setupCalculatorEvents();
  setupLeadForm();
  setupFAQ();
  updateUI();
});
