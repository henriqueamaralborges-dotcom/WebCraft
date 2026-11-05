/**
 * WebCraft - Script do Painel Administrativo (Controle de Acesso, Edição de Preços, Descontos e Pessoas Cadastradas)
 */

// ==========================================================================
// 1. Constantes e Padrões Iniciais do Sistema
// ==========================================================================
const DEFAULT_AUTH = {
  username: "admin",
  password: "webcraft2026"
};

const DEFAULT_CONFIG = {
  whatsappPhone: "5511974814897",
  contactEmail: "contato@webcraft.com.br",
  agencyName: "WebCraft",
  maxInstallments: 12
};

const DEFAULT_PRICING = {
  bases: {
    "express": { name: "Site Express / One-Page", price: 590 },
    "multi": { name: "Site Institucional Multipáginas", price: 1190 }
  },
  extraPageUnitPrice: 150,
  modules: {
    "blog": { name: "Criação de Blog / Notícias", price: 250 },
    "galeria": { name: "Galeria / Portfólio Interativo", price: 120 },
    "whatsapp": { name: "Botão Flutuante do WhatsApp", price: 50 },
    "formulario": { name: "Formulário de Orçamento Completo", price: 100 },
    "agendamento": { name: "Sistema de Agendamento Online", price: 200 },
    "catalogo": { name: "Catálogo de Produtos", price: 300 },
    "seo": { name: "Otimização SEO Local", price: 200 },
    "pixel": { name: "Instalação de Pixel de Anúncios", price: 100 },
    "dominio": { name: "Registro de Domínio por 1 Ano", price: 60 }
  },
  maintenance: {
    "basico": { name: "Plano Básico", price: 49 },
    "pro": { name: "Plano Pro", price: 99 },
    "premium": { name: "Plano Premium", price: 149 }
  }
};

const DEFAULT_DISCOUNTS = {
  active: false,
  globalPercent: 0,
  maintPercent: 0,
  promoText: "OFERTA ESPECIAL — DESCONTO EXCLUSIVO NA CRIAÇÃO DO SEU SITE!"
};

// ==========================================================================
// 2. Utilitários de Armazenamento Local (localStorage)
// ==========================================================================
function getAuthCredentials() {
  const saved = localStorage.getItem('webcraft_admin_auth');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return DEFAULT_AUTH;
}

function getStoredPricing() {
  const saved = localStorage.getItem('webcraft_pricing');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return JSON.parse(JSON.stringify(DEFAULT_PRICING));
}

function getStoredConfig() {
  const saved = localStorage.getItem('webcraft_config');
  if (saved) {
    try { return { ...DEFAULT_CONFIG, ...JSON.parse(saved) }; } catch (e) {}
  }
  return { ...DEFAULT_CONFIG };
}

function getStoredDiscounts() {
  const saved = localStorage.getItem('webcraft_discounts');
  if (saved) {
    try { return { ...DEFAULT_DISCOUNTS, ...JSON.parse(saved) }; } catch (e) {}
  }
  return { ...DEFAULT_DISCOUNTS };
}

function getStoredLeads() {
  const saved = localStorage.getItem('webcraft_leads');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  // Leads de exemplo inicial com CPF e CEP cadastrados
  const initialLeads = [
    {
      id: "LEAD-101",
      date: new Date(Date.now() - 3600000 * 3).toISOString(),
      clientName: "Marcos Vinícius Silva",
      clientCompany: "Clínica Odonto Vida",
      clientPhone: "(11) 98765-4321",
      clientCpf: "234.567.890-12",
      clientCep: "01310-100",
      baseName: "Site Institucional Multipáginas",
      basePrice: 1190,
      modules: ["Formulário de Orçamento Completo", "Botão Flutuante do WhatsApp", "Otimização SEO Local"],
      extraPages: 2,
      maintenanceName: "Plano Pro",
      maintenancePrice: 99,
      subtotal: 1840,
      discountPercent: 10,
      discountAmount: 184,
      total: 1656,
      status: "novo"
    },
    {
      id: "LEAD-102",
      date: new Date(Date.now() - 3600000 * 22).toISOString(),
      clientName: "Camila Ferreira Santos",
      clientCompany: "Artes & Decoração Studio",
      clientPhone: "(11) 97123-8899",
      clientCpf: "345.678.901-23",
      clientCep: "04567-001",
      baseName: "Site Express / One-Page",
      basePrice: 590,
      modules: ["Galeria / Portfólio Interativo", "Botão Flutuante do WhatsApp"],
      extraPages: 0,
      maintenanceName: "Plano Básico",
      maintenancePrice: 49,
      subtotal: 760,
      discountPercent: 0,
      discountAmount: 0,
      total: 760,
      status: "atendimento"
    }
  ];
  localStorage.setItem('webcraft_leads', JSON.stringify(initialLeads));
  return initialLeads;
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

// ==========================================================================
// 3. Sistema de Controle de Acesso e Autenticação
// ==========================================================================
function checkSession() {
  const isLogged = sessionStorage.getItem('webcraft_admin_logged') === 'true';
  const loginWrapper = document.getElementById('login-screen');
  const adminLayout = document.getElementById('admin-dashboard');

  if (isLogged) {
    if (loginWrapper) loginWrapper.style.display = 'none';
    if (adminLayout) adminLayout.classList.add('active');
    initDashboard();
  } else {
    if (loginWrapper) loginWrapper.style.display = 'flex';
    if (adminLayout) adminLayout.classList.remove('active');
  }
}

function setupAuth() {
  const loginForm = document.getElementById('login-form');
  const loginAlert = document.getElementById('login-alert');
  const logoutBtn = document.getElementById('btn-logout');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = document.getElementById('login-username').value.trim();
      const passVal = document.getElementById('login-password').value.trim();

      const creds = getAuthCredentials();

      if (userVal === creds.username && passVal === creds.password) {
        sessionStorage.setItem('webcraft_admin_logged', 'true');
        if (loginAlert) loginAlert.classList.remove('show');
        showToast("Bem-vindo ao Painel WebCraft!", "success");
        checkSession();
      } else {
        if (loginAlert) {
          loginAlert.classList.add('show');
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('webcraft_admin_logged');
      showToast("Sessão finalizada com sucesso.");
      setTimeout(() => {
        window.location.reload();
      }, 400);
    });
  }
}

// ==========================================================================
// 4. Edição de Preços em Tempo Real
// ==========================================================================
function populatePricingForm() {
  const pricing = getStoredPricing();

  const inputBaseExpress = document.getElementById('price-base-express');
  const inputBaseMulti = document.getElementById('price-base-multi');
  const inputExtraPage = document.getElementById('price-extra-page');

  if (inputBaseExpress && pricing.bases.express) inputBaseExpress.value = pricing.bases.express.price;
  if (inputBaseMulti && pricing.bases.multi) inputBaseMulti.value = pricing.bases.multi.price;
  if (inputExtraPage) inputExtraPage.value = pricing.extraPageUnitPrice || 150;

  Object.keys(pricing.modules).forEach(modKey => {
    const input = document.getElementById(`price-mod-${modKey}`);
    if (input) {
      input.value = pricing.modules[modKey].price;
    }
  });

  Object.keys(pricing.maintenance).forEach(maintKey => {
    const input = document.getElementById(`price-maint-${maintKey}`);
    if (input) {
      input.value = pricing.maintenance[maintKey].price;
    }
  });
}

function setupPricingActions() {
  const formPricing = document.getElementById('form-pricing');
  const btnResetPricing = document.getElementById('btn-reset-pricing');

  if (formPricing) {
    formPricing.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPricing = getStoredPricing();

      const expVal = parseFloat(document.getElementById('price-base-express')?.value) || 590;
      const multiVal = parseFloat(document.getElementById('price-base-multi')?.value) || 1190;
      const extraVal = parseFloat(document.getElementById('price-extra-page')?.value) || 150;

      currentPricing.bases.express.price = expVal;
      currentPricing.bases.multi.price = multiVal;
      currentPricing.extraPageUnitPrice = extraVal;

      Object.keys(currentPricing.modules).forEach(modKey => {
        const input = document.getElementById(`price-mod-${modKey}`);
        if (input) {
          currentPricing.modules[modKey].price = parseFloat(input.value) || 0;
        }
      });

      Object.keys(currentPricing.maintenance).forEach(maintKey => {
        const input = document.getElementById(`price-maint-${maintKey}`);
        if (input) {
          currentPricing.maintenance[maintKey].price = parseFloat(input.value) || 0;
        }
      });

      localStorage.setItem('webcraft_pricing', JSON.stringify(currentPricing));
      updateDiscountPreview();
      showToast("✅ Preços atualizados com sucesso no site!", "success");
    });
  }

  if (btnResetPricing) {
    btnResetPricing.addEventListener('click', () => {
      if (confirm("Deseja restaurar todos os preços originais de fábrica?")) {
        localStorage.removeItem('webcraft_pricing');
        populatePricingForm();
        updateDiscountPreview();
        showToast("Preços restaurados para o padrão.");
      }
    });
  }
}

// ==========================================================================
// 5. Gestão de Descontos & Promoções
// ==========================================================================
function populateDiscountsForm() {
  const discounts = getStoredDiscounts();

  const toggle = document.getElementById('discount-active-toggle');
  const inputGlobal = document.getElementById('discount-global-percent');
  const inputMaint = document.getElementById('discount-maint-percent');
  const inputText = document.getElementById('discount-promo-text');

  if (toggle) toggle.checked = discounts.active;
  if (inputGlobal) inputGlobal.value = discounts.globalPercent || 0;
  if (inputMaint) inputMaint.value = discounts.maintPercent || 0;
  if (inputText) inputText.value = discounts.promoText || "";

  updateDiscountPreview();
}

function updateDiscountPreview() {
  const pricing = getStoredPricing();
  const inputGlobal = document.getElementById('discount-global-percent');
  const toggle = document.getElementById('discount-active-toggle');

  const isActive = toggle ? toggle.checked : false;
  const pct = isActive ? (parseFloat(inputGlobal?.value) || 0) : 0;

  const expressBase = pricing.bases.express?.price || 590;
  const multiBase = pricing.bases.multi?.price || 1190;

  const expDiscount = (expressBase * pct) / 100;
  const multiDiscount = (multiBase * pct) / 100;

  const finalExp = expressBase - expDiscount;
  const finalMulti = multiBase - multiDiscount;

  const previewExpEl = document.getElementById('preview-express-price');
  const previewMultiEl = document.getElementById('preview-multi-price');
  const previewSavingsEl = document.getElementById('preview-savings-amount');

  if (previewExpEl) {
    previewExpEl.innerHTML = pct > 0 
      ? `<span style="text-decoration: line-through; color: #9CA3AF; font-size: 0.85rem; margin-right: 6px;">${formatCurrency(expressBase)}</span> <strong>${formatCurrency(finalExp)}</strong> <span class="badge-status fechado">-${pct}%</span>`
      : formatCurrency(expressBase);
  }

  if (previewMultiEl) {
    previewMultiEl.innerHTML = pct > 0 
      ? `<span style="text-decoration: line-through; color: #9CA3AF; font-size: 0.85rem; margin-right: 6px;">${formatCurrency(multiBase)}</span> <strong>${formatCurrency(finalMulti)}</strong> <span class="badge-status fechado">-${pct}%</span>`
      : formatCurrency(multiBase);
  }

  if (previewSavingsEl) {
    previewSavingsEl.textContent = pct > 0 ? `Até ${formatCurrency(multiDiscount)} de economia` : "R$ 0,00 (Nenhum desconto ativo)";
  }
}

function setupDiscountsActions() {
  const formDiscounts = document.getElementById('form-discounts');
  const btnResetDiscounts = document.getElementById('btn-reset-discounts');
  const toggle = document.getElementById('discount-active-toggle');
  const inputGlobal = document.getElementById('discount-global-percent');

  if (toggle) toggle.addEventListener('change', updateDiscountPreview);
  if (inputGlobal) inputGlobal.addEventListener('input', updateDiscountPreview);

  if (formDiscounts) {
    formDiscounts.addEventListener('submit', (e) => {
      e.preventDefault();

      const active = document.getElementById('discount-active-toggle')?.checked || false;
      const globalPercent = Math.min(90, Math.max(0, parseFloat(document.getElementById('discount-global-percent')?.value) || 0));
      const maintPercent = Math.min(90, Math.max(0, parseFloat(document.getElementById('discount-maint-percent')?.value) || 0));
      const promoText = document.getElementById('discount-promo-text')?.value.trim() || "OFERTA ESPECIAL COM DESCONTO!";

      const discountsData = {
        active,
        globalPercent,
        maintPercent,
        promoText
      };

      localStorage.setItem('webcraft_discounts', JSON.stringify(discountsData));
      updateDiscountPreview();

      if (active && globalPercent > 0) {
        showToast(`🎉 Promoção de ${globalPercent}% ativada com sucesso no site!`, "success");
      } else if (!active) {
        showToast("Descontos desativados no site.", "info");
      } else {
        showToast("Configurações salvas.");
      }
    });
  }

  if (btnResetDiscounts) {
    btnResetDiscounts.addEventListener('click', () => {
      if (confirm("Deseja desativar e zerar todos os descontos aplicados no site?")) {
        const resetData = { ...DEFAULT_DISCOUNTS };
        localStorage.setItem('webcraft_discounts', JSON.stringify(resetData));
        populateDiscountsForm();
        showToast("Todos os descontos foram removidos.");
      }
    });
  }
}

// ==========================================================================
// 6. Gestão de Pessoas Cadastradas & Pedidos (Leads com CPF e CEP)
// ==========================================================================
function renderLeadsTable(searchTerm = "") {
  const tbody = document.getElementById('leads-table-body');
  if (!tbody) return;

  const leads = getStoredLeads();
  const term = searchTerm.toLowerCase().trim();

  const filtered = leads.filter(item => {
    return (
      (item.clientName && item.clientName.toLowerCase().includes(term)) ||
      (item.clientCompany && item.clientCompany.toLowerCase().includes(term)) ||
      (item.clientPhone && item.clientPhone.includes(term)) ||
      (item.clientCpf && item.clientCpf.includes(term)) ||
      (item.clientCep && item.clientCep.includes(term)) ||
      (item.baseName && item.baseName.toLowerCase().includes(term)) ||
      (item.maintenanceName && item.maintenanceName.toLowerCase().includes(term))
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 36px;">
          <i class="fa-solid fa-user-slash" style="font-size: 2rem; display: block; margin-bottom: 8px; opacity: 0.5;"></i>
          Nenhum cadastro encontrado para a busca informada.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((lead, idx) => {
    const rawPhone = (lead.clientPhone || "").replace(/\D/g, "");
    const formattedDate = new Date(lead.date).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const cpfDisplay = lead.clientCpf || '<span style="color:#6B7280;">Não informado</span>';
    const cepDisplay = lead.clientCep || '<span style="color:#6B7280;">-</span>';

    // Formata a lista de módulos em badges
    const modulesHtml = (lead.modules && lead.modules.length > 0)
      ? lead.modules.map(m => `<span class="module-chip">${m}</span>`).join('')
      : '<span style="font-size: 0.75rem; color: var(--text-muted);">Nenhum adicional</span>';

    const extraPagesBadge = (lead.extraPages && lead.extraPages > 0)
      ? `<span class="module-chip extra-page">+${lead.extraPages} página(s)</span>`
      : '';

    // Valor com ou sem desconto
    let priceHtml = `<strong style="color: var(--emerald-400);">${formatCurrency(lead.total)}</strong>`;
    if (lead.discountAmount && lead.discountAmount > 0) {
      priceHtml = `
        <div>
          <span style="text-decoration: line-through; font-size: 0.75rem; color: var(--text-muted);">${formatCurrency(lead.subtotal)}</span>
          <strong style="color: var(--emerald-400); display: block;">${formatCurrency(lead.total)}</strong>
          <span style="font-size: 0.7rem; color: #EF4444; font-weight: 700;">-${lead.discountPercent}% OFF</span>
        </div>
      `;
    }

    return `
      <tr>
        <td>
          <strong>#${idx + 1}</strong>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${formattedDate}</div>
        </td>
        <td>
          <div style="font-weight: 700; color: #fff;">${lead.clientName}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${lead.clientCompany || 'Pessoa Física'}</div>
        </td>
        <td>
          <a href="https://wa.me/55${rawPhone}" target="_blank" style="color: #25D366; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;" title="Conversar no WhatsApp">
            <i class="fa-brands fa-whatsapp"></i> ${lead.clientPhone}
          </a>
        </td>
        <td>
          <div style="font-family: monospace; font-size: 0.8rem; color: var(--cyan-500);">${cpfDisplay}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">CEP: ${cepDisplay}</div>
        </td>
        <td style="max-width: 240px;">
          <div style="font-weight: 600; font-size: 0.825rem; margin-bottom: 3px;">${lead.baseName}</div>
          <div style="display: flex; flex-wrap: wrap; gap: 3px;">
            ${extraPagesBadge}
            ${modulesHtml}
          </div>
        </td>
        <td>
          <span class="badge-status atencao" style="background-color: rgba(16, 185, 129, 0.15); color: var(--emerald-400);">
            ${lead.maintenanceName || 'Plano Pro'}
          </span>
        </td>
        <td>
          ${priceHtml}
        </td>
        <td>
          <select class="admin-input" style="padding: 4px 8px; font-size: 0.75rem;" onchange="updateLeadStatus('${lead.id}', this.value)">
            <option value="novo" ${lead.status === 'novo' ? 'selected' : ''}>Novo</option>
            <option value="atendimento" ${lead.status === 'atendimento' ? 'selected' : ''}>Em Contato</option>
            <option value="fechado" ${lead.status === 'fechado' ? 'selected' : ''}>Fechado</option>
            <option value="cancelado" ${lead.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-table-action" onclick="openLeadModal('${lead.id}')" title="Ver Ficha Completa do Cliente">
              <i class="fa-regular fa-id-card"></i>
            </button>
            <a href="https://wa.me/55${rawPhone}" target="_blank" class="btn-table-action whatsapp" title="Falar no WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button type="button" class="btn-table-action" onclick="deleteLead('${lead.id}')" title="Excluir Cadastro">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openLeadModal = function(leadId) {
  const leads = getStoredLeads();
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  const rawPhone = (lead.clientPhone || "").replace(/\D/g, "");
  const formattedDate = new Date(lead.date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  document.getElementById('modal-lead-name').textContent = lead.clientName;
  document.getElementById('modal-lead-date').textContent = `Cadastrado em: ${formattedDate} — ID: ${lead.id}`;
  document.getElementById('modal-field-name').textContent = lead.clientName;
  document.getElementById('modal-field-company').textContent = lead.clientCompany || 'Não informada';
  document.getElementById('modal-field-phone').textContent = lead.clientPhone;
  document.getElementById('modal-field-cpf').textContent = lead.clientCpf || 'Não informado';
  document.getElementById('modal-field-cep').textContent = lead.clientCep || 'Não informado';

  document.getElementById('modal-field-base').textContent = `${lead.baseName} (${formatCurrency(lead.basePrice || 0)})`;
  document.getElementById('modal-field-plan').textContent = `${lead.maintenanceName || 'Plano Pro'} (${formatCurrency(lead.maintenancePrice || 99)}/mês)`;

  const modulesContainer = document.getElementById('modal-field-modules');
  if (modulesContainer) {
    let mods = '';
    if (lead.extraPages && lead.extraPages > 0) {
      mods += `<span class="module-chip extra-page">+${lead.extraPages} Página(s) Extra(s)</span>`;
    }
    if (lead.modules && lead.modules.length > 0) {
      mods += lead.modules.map(m => `<span class="module-chip">${m}</span>`).join('');
    } else if (!lead.extraPages) {
      mods = '<span style="font-size: 0.8rem; color: var(--text-muted);">Nenhum módulo opcional selecionado</span>';
    }
    modulesContainer.innerHTML = mods;
  }

  document.getElementById('modal-field-total').textContent = formatCurrency(lead.total);
  document.getElementById('modal-field-discount').textContent = (lead.discountAmount && lead.discountAmount > 0)
    ? `-${lead.discountPercent}% OFF (Economia de ${formatCurrency(lead.discountAmount)})`
    : 'Nenhum desconto aplicado';

  document.getElementById('modal-field-maintenance').textContent = `${formatCurrency(lead.maintenancePrice || 99)}/mês`;

  const btnWa = document.getElementById('modal-btn-whatsapp');
  if (btnWa) {
    btnWa.href = `https://wa.me/55${rawPhone}?text=${encodeURIComponent(`Olá ${lead.clientName}! Somos da equipe WebCraft e recebemos a simulação do seu site. Vamos dar continuidade?`)}`;
  }

  const modal = document.getElementById('modal-lead-details');
  if (modal) modal.classList.add('show');
};

window.closeLeadModal = function() {
  const modal = document.getElementById('modal-lead-details');
  if (modal) modal.classList.remove('show');
};

window.updateLeadStatus = function(leadId, newStatus) {
  const leads = getStoredLeads();
  const index = leads.findIndex(l => l.id === leadId);
  if (index !== -1) {
    leads[index].status = newStatus;
    localStorage.setItem('webcraft_leads', JSON.stringify(leads));
    showToast("Status do cadastro atualizado!");
    updateDashboardMetrics();
  }
};

window.deleteLead = function(leadId) {
  if (confirm("Deseja realmente remover este cadastro do histórico?")) {
    let leads = getStoredLeads();
    leads = leads.filter(l => l.id !== leadId);
    localStorage.setItem('webcraft_leads', JSON.stringify(leads));
    renderLeadsTable();
    updateDashboardMetrics();
    showToast("Cadastro removido com sucesso.");
  }
};

function setupLeadsActions() {
  const searchInput = document.getElementById('search-leads');
  const btnExportCsv = document.getElementById('btn-export-csv');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderLeadsTable(e.target.value);
    });
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const leads = getStoredLeads();
      if (leads.length === 0) {
        showToast("Não há pessoas cadastradas para exportar.", "warning");
        return;
      }

      let csv = "ID;Data;Nome Completo;Empresa;WhatsApp;CPF;CEP;Estrutura;Modulos Solicitados;Plano Mensal;Subtotal (R$);Desconto (%);Total Final (R$);Status\n";
      leads.forEach(l => {
        const modulesStr = (l.modules || []).join(' + ') + (l.extraPages ? ` (+${l.extraPages} paginas extras)` : '');
        csv += `"${l.id}";"${l.date}";"${l.clientName}";"${l.clientCompany || ''}";"${l.clientPhone}";"${l.clientCpf || ''}";"${l.clientCep || ''}";"${l.baseName}";"${modulesStr}";"${l.maintenanceName}";"${l.subtotal || l.total}";"${l.discountPercent || 0}%";"${l.total}";"${l.status}"\n`;
      });

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cadastros_webcraft_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Planilha CSV com CPF e CEP exportada com sucesso!", "success");
    });
  }
}

// ==========================================================================
// 7. Métricas do Dashboard
// ==========================================================================
function updateDashboardMetrics() {
  const leads = getStoredLeads();

  const totalLeadsEl = document.getElementById('metric-total-leads');
  const totalValueEl = document.getElementById('metric-total-value');
  const avgTicketEl = document.getElementById('metric-avg-ticket');
  const closedRateEl = document.getElementById('metric-closed-rate');

  const count = leads.length;
  const totalValue = leads.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const avg = count > 0 ? totalValue / count : 0;
  const closed = leads.filter(l => l.status === 'fechado').length;
  const rate = count > 0 ? Math.round((closed / count) * 100) : 0;

  if (totalLeadsEl) totalLeadsEl.textContent = count;
  if (totalValueEl) totalValueEl.textContent = formatCurrency(totalValue);
  if (avgTicketEl) avgTicketEl.textContent = formatCurrency(avg);
  if (closedRateEl) closedRateEl.textContent = `${rate}%`;
}

// ==========================================================================
// 8. Configurações Gerais e Alteração de Senha
// ==========================================================================
function populateSettingsForm() {
  const config = getStoredConfig();
  const inputPhone = document.getElementById('config-whatsapp-phone');
  const inputEmail = document.getElementById('config-contact-email');

  if (inputPhone) inputPhone.value = config.whatsappPhone;
  if (inputEmail) inputEmail.value = config.contactEmail;
}

function setupSettingsActions() {
  const formSettings = document.getElementById('form-settings');
  const formPassword = document.getElementById('form-password');

  if (formSettings) {
    formSettings.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneVal = document.getElementById('config-whatsapp-phone').value.replace(/\D/g, '');
      const emailVal = document.getElementById('config-contact-email').value.trim();

      if (phoneVal.length < 10) {
        showToast("Número de WhatsApp inválido.", "warning");
        return;
      }

      const config = getStoredConfig();
      config.whatsappPhone = phoneVal;
      config.contactEmail = emailVal;

      localStorage.setItem('webcraft_config', JSON.stringify(config));
      showToast("Configurações salvas com sucesso!", "success");
    });
  }

  if (formPassword) {
    formPassword.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPass = document.getElementById('pass-current').value;
      const newPass = document.getElementById('pass-new').value;
      const confirmPass = document.getElementById('pass-confirm').value;

      const creds = getAuthCredentials();

      if (currentPass !== creds.password) {
        showToast("A senha atual digitada está incorreta.", "warning");
        return;
      }

      if (newPass.length < 6) {
        showToast("A nova senha deve ter no mínimo 6 caracteres.", "warning");
        return;
      }

      if (newPass !== confirmPass) {
        showToast("A confirmação da nova senha não confere.", "warning");
        return;
      }

      creds.password = newPass;
      localStorage.setItem('webcraft_admin_auth', JSON.stringify(creds));
      formPassword.reset();
      showToast("Senha de acesso alterada com sucesso!", "success");
    });
  }
}

// ==========================================================================
// 9. Navegação por Abas no Dashboard
// ==========================================================================
function setupTabNavigation() {
  const navButtons = document.querySelectorAll('.nav-item-btn[data-tab]');
  const panels = document.querySelectorAll('.admin-view-panel');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar) sidebar.classList.remove('open');
    });
  });

  const mobileToggle = document.getElementById('mobile-admin-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// ==========================================================================
// 10. Toast Notification no Admin
// ==========================================================================
let adminToastTimer = null;
function showToast(message, type = "info") {
  let toastEl = document.getElementById('admin-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'admin-toast';
    toastEl.className = 'admin-toast';
    document.body.appendChild(toastEl);
  }

  let icon = '<i class="fa-solid fa-circle-check" style="color: var(--emerald-400);"></i>';
  if (type === "warning") {
    icon = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--amber-500);"></i>';
  }

  toastEl.innerHTML = `${icon} <span>${message}</span>`;
  toastEl.classList.add('show');

  if (adminToastTimer) clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3500);
}

// ==========================================================================
// 11. Inicialização
// ==========================================================================
function initDashboard() {
  updateDashboardMetrics();
  populatePricingForm();
  populateDiscountsForm();
  renderLeadsTable();
  populateSettingsForm();
}

document.addEventListener('DOMContentLoaded', () => {
  setupAuth();
  setupTabNavigation();
  setupPricingActions();
  setupDiscountsActions();
  setupLeadsActions();
  setupSettingsActions();
  checkSession();
});
